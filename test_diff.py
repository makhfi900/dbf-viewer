import struct
import datetime

def create_test_dbf(filename, records):
    """Create a simple DBF file for testing"""
    # DBF header structure
    header = bytearray(32)
    header[0] = 0x03  # File type
    
    # Date (year, month, day)
    today = datetime.date.today()
    header[1] = today.year - 1900
    header[2] = today.month
    header[3] = today.day
    
    # Number of records
    struct.pack_into('<L', header, 4, len(records))
    
    # Header length (32 bytes header + 32 bytes per field + 1 terminator)
    header_length = 32 + 32 * 3 + 1  # 3 fields
    struct.pack_into('<H', header, 8, header_length)
    
    # Record length (1 byte delete flag + field lengths)
    record_length = 1 + 10 + 30 + 10  # ID(10) + NAME(30) + SALARY(10)
    struct.pack_into('<H', header, 10, record_length)
    
    # Field descriptors
    fields = []
    
    # ID field
    field1 = bytearray(32)
    field1[0:11] = b'ID\x00\x00\x00\x00\x00\x00\x00\x00\x00'
    field1[11] = ord('N')  # Numeric
    field1[16] = 10  # Length
    field1[17] = 0   # Decimal count
    fields.append(field1)
    
    # NAME field
    field2 = bytearray(32)
    field2[0:11] = b'NAME\x00\x00\x00\x00\x00\x00\x00'
    field2[11] = ord('C')  # Character
    field2[16] = 30  # Length
    field2[17] = 0   # Decimal count
    fields.append(field2)
    
    # SALARY field
    field3 = bytearray(32)
    field3[0:11] = b'SALARY\x00\x00\x00\x00\x00'
    field3[11] = ord('N')  # Numeric
    field3[16] = 10  # Length
    field3[17] = 2   # Decimal count
    fields.append(field3)
    
    # Write file
    with open(filename, 'wb') as f:
        f.write(header)
        for field in fields:
            f.write(field)
        f.write(b'\r')  # Field terminator
        
        # Write records
        for record in records:
            f.write(b' ')  # Delete flag (space = not deleted)
            f.write(f"{record['id']:>10}".encode('ascii'))
            f.write(f"{record['name']:<30}".encode('ascii'))
            f.write(f"{record['salary']:>10.2f}".encode('ascii'))

# Create test files with differences
records1 = [
    {'id': 1, 'name': 'John Doe', 'salary': 50000.00},
    {'id': 2, 'name': 'Jane Smith', 'salary': 60000.00},
    {'id': 3, 'name': 'Bob Johnson', 'salary': 55000.00},
]

records2 = [
    {'id': 1, 'name': 'John Doe', 'salary': 52000.00},  # Modified salary
    {'id': 2, 'name': 'Jane Smith', 'salary': 60000.00},  # Unchanged
    {'id': 4, 'name': 'Alice Brown', 'salary': 58000.00},  # New record (ID 3 removed, ID 4 added)
]

create_test_dbf('public/samples/test1.dbf', records1)
create_test_dbf('public/samples/test2.dbf', records2)

print("Created test1.dbf and test2.dbf with differences:")
print("- Record 1: Salary changed from 50000 to 52000")
print("- Record 2: Unchanged")
print("- Record 3: Removed (Bob Johnson)")
print("- Record 4: Added (Alice Brown)")
