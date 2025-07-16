#!/usr/bin/env python3
"""
Create sample DBF files for testing the DBF viewer application.
This script creates simple DBF files with test data.
"""

import struct
import datetime
import os

def create_dbf_file(filename, fields, records):
    """Create a simple DBF file with the given fields and records."""
    
    # DBF header structure
    header_size = 32 + (len(fields) * 32) + 1  # Header + field descriptors + terminator
    record_size = 1 + sum(field['length'] for field in fields)  # Delete flag + field data
    
    with open(filename, 'wb') as f:
        # Write main header (32 bytes)
        f.write(struct.pack('<B', 0x03))  # File type (dBase III)
        
        # Last update date (YY MM DD)
        today = datetime.date.today()
        f.write(struct.pack('<BBB', today.year % 100, today.month, today.day))
        
        # Number of records
        f.write(struct.pack('<L', len(records)))
        
        # Header length
        f.write(struct.pack('<H', header_size))
        
        # Record length
        f.write(struct.pack('<H', record_size))
        
        # Reserved bytes (20 bytes)
        f.write(b'\x00' * 20)
        
        # Write field descriptors
        for field in fields:
            # Field name (11 bytes, null-padded)
            name_bytes = field['name'].encode('ascii')[:11]
            name_bytes += b'\x00' * (11 - len(name_bytes))
            f.write(name_bytes)
            
            # Field type
            f.write(field['type'].encode('ascii'))
            
            # Field displacement (4 bytes, not used in dBase III)
            f.write(b'\x00' * 4)
            
            # Field length
            f.write(struct.pack('<B', field['length']))
            
            # Decimal count
            f.write(struct.pack('<B', field.get('decimals', 0)))
            
            # Reserved (14 bytes)
            f.write(b'\x00' * 14)
        
        # Header terminator
        f.write(b'\x0D')
        
        # Write records
        for record in records:
            # Delete flag (space = not deleted)
            f.write(b' ')
            
            # Write field data
            for field in fields:
                field_name = field['name']
                field_length = field['length']
                field_type = field['type']
                
                value = record.get(field_name, '')
                
                if field_type == 'C':  # Character
                    value_str = str(value)[:field_length]
                    value_str += ' ' * (field_length - len(value_str))
                    f.write(value_str.encode('ascii'))
                elif field_type == 'N':  # Numeric
                    value_str = str(value).rjust(field_length)
                    if len(value_str) > field_length:
                        value_str = ' ' * field_length
                    f.write(value_str.encode('ascii'))
                elif field_type == 'D':  # Date
                    if isinstance(value, str) and len(value) == 10:
                        # Convert YYYY-MM-DD to YYYYMMDD
                        date_str = value.replace('-', '')
                    else:
                        date_str = '        '  # Empty date
                    f.write(date_str.encode('ascii'))
                elif field_type == 'L':  # Logical
                    logical_char = 'T' if value else 'F'
                    f.write(logical_char.encode('ascii'))
                else:
                    # Default to spaces
                    f.write(b' ' * field_length)

def main():
    # Create sample directory
    sample_dir = '/home/ubuntu/dbf-viewer/samples'
    os.makedirs(sample_dir, exist_ok=True)
    
    # Sample 1: Employee database
    employee_fields = [
        {'name': 'ID', 'type': 'N', 'length': 5},
        {'name': 'FIRST_NAME', 'type': 'C', 'length': 20},
        {'name': 'LAST_NAME', 'type': 'C', 'length': 25},
        {'name': 'DEPARTMENT', 'type': 'C', 'length': 15},
        {'name': 'SALARY', 'type': 'N', 'length': 8},
        {'name': 'HIRE_DATE', 'type': 'D', 'length': 8},
        {'name': 'ACTIVE', 'type': 'L', 'length': 1}
    ]
    
    employee_records = [
        {'ID': 1, 'FIRST_NAME': 'John', 'LAST_NAME': 'Smith', 'DEPARTMENT': 'Engineering', 'SALARY': 75000, 'HIRE_DATE': '2020-01-15', 'ACTIVE': True},
        {'ID': 2, 'FIRST_NAME': 'Jane', 'LAST_NAME': 'Doe', 'DEPARTMENT': 'Marketing', 'SALARY': 65000, 'HIRE_DATE': '2019-03-22', 'ACTIVE': True},
        {'ID': 3, 'FIRST_NAME': 'Bob', 'LAST_NAME': 'Johnson', 'DEPARTMENT': 'Sales', 'SALARY': 55000, 'HIRE_DATE': '2021-07-10', 'ACTIVE': False},
        {'ID': 4, 'FIRST_NAME': 'Alice', 'LAST_NAME': 'Williams', 'DEPARTMENT': 'Engineering', 'SALARY': 80000, 'HIRE_DATE': '2018-11-05', 'ACTIVE': True},
        {'ID': 5, 'FIRST_NAME': 'Charlie', 'LAST_NAME': 'Brown', 'DEPARTMENT': 'HR', 'SALARY': 60000, 'HIRE_DATE': '2022-02-28', 'ACTIVE': True}
    ]
    
    create_dbf_file(f'{sample_dir}/employees_v1.dbf', employee_fields, employee_records)
    
    # Sample 2: Modified employee database (for diff testing)
    employee_records_v2 = [
        {'ID': 1, 'FIRST_NAME': 'John', 'LAST_NAME': 'Smith', 'DEPARTMENT': 'Engineering', 'SALARY': 78000, 'HIRE_DATE': '2020-01-15', 'ACTIVE': True},  # Salary changed
        {'ID': 2, 'FIRST_NAME': 'Jane', 'LAST_NAME': 'Doe', 'DEPARTMENT': 'Marketing', 'SALARY': 65000, 'HIRE_DATE': '2019-03-22', 'ACTIVE': True},
        # Bob Johnson removed
        {'ID': 4, 'FIRST_NAME': 'Alice', 'LAST_NAME': 'Williams', 'DEPARTMENT': 'Engineering', 'SALARY': 80000, 'HIRE_DATE': '2018-11-05', 'ACTIVE': True},
        {'ID': 5, 'FIRST_NAME': 'Charlie', 'LAST_NAME': 'Brown', 'DEPARTMENT': 'HR', 'SALARY': 62000, 'HIRE_DATE': '2022-02-28', 'ACTIVE': True},  # Salary changed
        {'ID': 6, 'FIRST_NAME': 'Diana', 'LAST_NAME': 'Prince', 'DEPARTMENT': 'Legal', 'SALARY': 90000, 'HIRE_DATE': '2023-01-10', 'ACTIVE': True}  # New employee
    ]
    
    create_dbf_file(f'{sample_dir}/employees_v2.dbf', employee_fields, employee_records_v2)
    
    # Sample 3: Product database
    product_fields = [
        {'name': 'SKU', 'type': 'C', 'length': 10},
        {'name': 'NAME', 'type': 'C', 'length': 30},
        {'name': 'CATEGORY', 'type': 'C', 'length': 15},
        {'name': 'PRICE', 'type': 'N', 'length': 8, 'decimals': 2},
        {'name': 'STOCK', 'type': 'N', 'length': 6},
        {'name': 'ACTIVE', 'type': 'L', 'length': 1}
    ]
    
    product_records = [
        {'SKU': 'LAPTOP001', 'NAME': 'Gaming Laptop Pro', 'CATEGORY': 'Electronics', 'PRICE': 1299.99, 'STOCK': 25, 'ACTIVE': True},
        {'SKU': 'MOUSE002', 'NAME': 'Wireless Mouse', 'CATEGORY': 'Electronics', 'PRICE': 29.99, 'STOCK': 150, 'ACTIVE': True},
        {'SKU': 'DESK003', 'NAME': 'Standing Desk', 'CATEGORY': 'Furniture', 'PRICE': 399.00, 'STOCK': 10, 'ACTIVE': True},
        {'SKU': 'CHAIR004', 'NAME': 'Ergonomic Chair', 'CATEGORY': 'Furniture', 'PRICE': 249.99, 'STOCK': 8, 'ACTIVE': False}
    ]
    
    create_dbf_file(f'{sample_dir}/products.dbf', product_fields, product_records)
    
    print(f"Sample DBF files created in {sample_dir}:")
    print("- employees_v1.dbf (5 records)")
    print("- employees_v2.dbf (5 records, modified for diff testing)")
    print("- products.dbf (4 records)")

if __name__ == '__main__':
    main()

