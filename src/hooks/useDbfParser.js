import { useState, useCallback } from 'react';

// Simple DBF parser for browser environment
const parseDbfFile = (arrayBuffer) => {
  const view = new DataView(arrayBuffer);
  
  // Read header
  const fileType = view.getUint8(0);
  const lastUpdate = {
    year: view.getUint8(1) + 1900,
    month: view.getUint8(2),
    day: view.getUint8(3)
  };
  const recordCount = view.getUint32(4, true); // little endian
  const headerLength = view.getUint16(8, true);
  const recordLength = view.getUint16(10, true);
  
  // Calculate number of fields
  const fieldCount = Math.floor((headerLength - 33) / 32);
  
  // Read field definitions
  const fields = [];
  let offset = 32;
  
  for (let i = 0; i < fieldCount; i++) {
    const fieldName = new TextDecoder('ascii').decode(
      new Uint8Array(arrayBuffer, offset, 11)
    ).replace(/\0/g, '');
    
    const fieldType = String.fromCharCode(view.getUint8(offset + 11));
    const fieldLength = view.getUint8(offset + 16);
    const decimalCount = view.getUint8(offset + 17);
    
    fields.push({
      name: fieldName,
      type: fieldType,
      length: fieldLength,
      decimalCount: decimalCount
    });
    
    offset += 32;
  }
  
  // Read records
  const records = [];
  const recordStart = headerLength;
  
  for (let i = 0; i < recordCount; i++) {
    const recordOffset = recordStart + (i * recordLength);
    const deleteFlag = view.getUint8(recordOffset);
    
    // Skip deleted records
    if (deleteFlag === 0x2A) continue;
    
    const record = {};
    let fieldOffset = recordOffset + 1; // Skip delete flag
    
    for (const field of fields) {
      const fieldData = new Uint8Array(arrayBuffer, fieldOffset, field.length);
      let value = new TextDecoder('ascii').decode(fieldData).trim();
      
      // Convert based on field type
      switch (field.type) {
        case 'N': // Numeric
        case 'F': // Float
          value = value === '' ? null : parseFloat(value);
          break;
        case 'I': // Integer
          value = value === '' ? null : parseInt(value, 10);
          break;
        case 'L': // Logical
          value = value === 'T' || value === 't' || value === 'Y' || value === 'y';
          break;
        case 'D': // Date
          if (value && value.length === 8) {
            const year = value.substring(0, 4);
            const month = value.substring(4, 6);
            const day = value.substring(6, 8);
            value = `${year}-${month}-${day}`;
          }
          break;
        case 'C': // Character
        default:
          // Keep as string
          break;
      }
      
      record[field.name] = value;
      fieldOffset += field.length;
    }
    
    records.push(record);
  }
  
  return {
    fields,
    records,
    recordCount: records.length,
    fileInfo: {
      fileType,
      lastUpdate,
      totalRecords: recordCount,
      headerLength,
      recordLength
    }
  };
};

export const useDbfParser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseFile = useCallback(async (arrayBuffer) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = parseDbfFile(arrayBuffer);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    parseFile,
    isLoading,
    error
  };
};

