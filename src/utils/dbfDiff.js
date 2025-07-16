// Utility functions for comparing DBF files

export const compareDbfFiles = (file1Data, file2Data) => {
  const { fields: fields1, records: records1 } = file1Data;
  const { fields: fields2, records: records2 } = file2Data;
  
  // Compare field structures
  const fieldDifferences = compareFields(fields1, fields2);
  
  // Compare records
  const recordDifferences = compareRecords(records1, records2, fields1, fields2);
  
  return {
    fieldDifferences,
    recordDifferences,
    summary: {
      file1RecordCount: records1.length,
      file2RecordCount: records2.length,
      addedRecords: recordDifferences.added.length,
      removedRecords: recordDifferences.removed.length,
      modifiedRecords: recordDifferences.modified.length,
      fieldChanges: fieldDifferences.length
    }
  };
};

const compareFields = (fields1, fields2) => {
  const differences = [];
  
  // Create maps for easier comparison
  const fields1Map = new Map(fields1.map(f => [f.name, f]));
  const fields2Map = new Map(fields2.map(f => [f.name, f]));
  
  // Check for added fields
  fields2.forEach(field => {
    if (!fields1Map.has(field.name)) {
      differences.push({
        type: 'added',
        fieldName: field.name,
        field: field
      });
    }
  });
  
  // Check for removed fields
  fields1.forEach(field => {
    if (!fields2Map.has(field.name)) {
      differences.push({
        type: 'removed',
        fieldName: field.name,
        field: field
      });
    }
  });
  
  // Check for modified fields
  fields1.forEach(field => {
    const field2 = fields2Map.get(field.name);
    if (field2) {
      const changes = [];
      if (field.type !== field2.type) changes.push('type');
      if (field.length !== field2.length) changes.push('length');
      if (field.decimalCount !== field2.decimalCount) changes.push('decimalCount');
      
      if (changes.length > 0) {
        differences.push({
          type: 'modified',
          fieldName: field.name,
          field1: field,
          field2: field2,
          changes
        });
      }
    }
  });
  
  return differences;
};

const compareRecords = (records1, records2, fields1, fields2) => {
  // Create a simple hash for each record to identify matches
  const createRecordHash = (record, fields) => {
    return fields.map(field => String(record[field.name] || '')).join('|');
  };
  
  // Create maps of records with their hashes
  const records1Map = new Map();
  const records2Map = new Map();
  
  records1.forEach((record, index) => {
    const hash = createRecordHash(record, fields1);
    if (!records1Map.has(hash)) {
      records1Map.set(hash, []);
    }
    records1Map.get(hash).push({ record, index });
  });
  
  records2.forEach((record, index) => {
    const hash = createRecordHash(record, fields2);
    if (!records2Map.has(hash)) {
      records2Map.set(hash, []);
    }
    records2Map.get(hash).push({ record, index });
  });
  
  const added = [];
  const removed = [];
  const modified = [];
  const unchanged = [];
  
  // Find added records (in file2 but not in file1)
  records2Map.forEach((recordList, hash) => {
    if (!records1Map.has(hash)) {
      recordList.forEach(({ record, index }) => {
        added.push({ record, index, file: 2 });
      });
    }
  });
  
  // Find removed records (in file1 but not in file2)
  records1Map.forEach((recordList, hash) => {
    if (!records2Map.has(hash)) {
      recordList.forEach(({ record, index }) => {
        removed.push({ record, index, file: 1 });
      });
    }
  });
  
  // Find unchanged records and potential modifications
  records1Map.forEach((recordList1, hash) => {
    const recordList2 = records2Map.get(hash);
    if (recordList2) {
      // Records with same hash are considered unchanged
      recordList1.forEach(({ record: record1, index: index1 }) => {
        recordList2.forEach(({ record: record2, index: index2 }) => {
          unchanged.push({
            record1,
            record2,
            index1,
            index2
          });
        });
      });
    }
  });
  
  // For a more detailed comparison, we can also compare records by position
  // and look for field-level changes
  const maxLength = Math.max(records1.length, records2.length);
  for (let i = 0; i < maxLength; i++) {
    const record1 = records1[i];
    const record2 = records2[i];
    
    if (record1 && record2) {
      const fieldChanges = compareRecordFields(record1, record2, fields1, fields2);
      if (fieldChanges.length > 0) {
        modified.push({
          record1,
          record2,
          index: i,
          fieldChanges
        });
      }
    }
  }
  
  return {
    added,
    removed,
    modified,
    unchanged
  };
};

const compareRecordFields = (record1, record2, fields1, fields2) => {
  const changes = [];
  
  // Get all unique field names
  const allFields = new Set([
    ...fields1.map(f => f.name),
    ...fields2.map(f => f.name)
  ]);
  
  allFields.forEach(fieldName => {
    const value1 = record1[fieldName];
    const value2 = record2[fieldName];
    
    if (value1 !== value2) {
      changes.push({
        fieldName,
        oldValue: value1,
        newValue: value2
      });
    }
  });
  
  return changes;
};

export const getDiffStats = (diffResult) => {
  const { summary } = diffResult;
  
  return {
    totalChanges: summary.addedRecords + summary.removedRecords + summary.modifiedRecords + summary.fieldChanges,
    recordChanges: summary.addedRecords + summary.removedRecords + summary.modifiedRecords,
    structureChanges: summary.fieldChanges,
    percentageChanged: summary.file1RecordCount > 0 
      ? ((summary.addedRecords + summary.removedRecords + summary.modifiedRecords) / summary.file1RecordCount * 100).toFixed(1)
      : 0
  };
};

