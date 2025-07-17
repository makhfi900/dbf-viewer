import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  Search,
  Info,
  Columns,
  Eye,
  EyeOff
} from 'lucide-react';

const DbfTable = ({ data, fileName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(new Set());

  const { fields, records, fileInfo } = data;

  // Initialize visible columns when data changes
  useMemo(() => {
    if (fields && fields.length > 0) {
      setVisibleColumns(new Set(fields.map(field => field.name)));
    }
  }, [fields]);

  // Get visible fields based on column visibility settings
  const visibleFields = useMemo(() => {
    return fields ? fields.filter(field => visibleColumns.has(field.name)) : [];
  }, [fields, visibleColumns]);

  const toggleColumnVisibility = (fieldName) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldName)) {
        newSet.delete(fieldName);
      } else {
        newSet.add(fieldName);
      }
      return newSet;
    });
  };

  const showAllColumns = () => {
    setVisibleColumns(new Set(fields.map(field => field.name)));
  };

  const hideAllColumns = () => {
    setVisibleColumns(new Set());
  };

  // Filter records based on search term
  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;
    
    return records.filter(record => 
      Object.values(record).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [records, searchTerm]);

  // Sort records
  const sortedRecords = useMemo(() => {
    if (!sortField) return filteredRecords;
    
    return [...filteredRecords].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aVal.toString().localeCompare(bVal.toString());
      } else {
        return bVal.toString().localeCompare(aVal.toString());
      }
    });
  }, [filteredRecords, sortField, sortDirection]);

  // Paginate records
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRecords.slice(startIndex, startIndex + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedRecords.length / pageSize);

  const handleSort = (fieldName) => {
    if (sortField === fieldName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(fieldName);
      setSortDirection('asc');
    }
  };

  const getFieldTypeColor = (type) => {
    switch (type) {
      case 'C': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'N': case 'F': case 'I': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'D': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'L': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'M': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getFieldTypeName = (type) => {
    switch (type) {
      case 'C': return 'Character';
      case 'N': return 'Numeric';
      case 'F': return 'Float';
      case 'I': return 'Integer';
      case 'D': return 'Date';
      case 'L': return 'Logical';
      case 'M': return 'Memo';
      default: return type;
    }
  };

  if (!data || !records.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No data to display</p>
          <p className="text-sm text-muted-foreground">
            Upload a DBF file to view its contents
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* File Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">{fileName}</span>
            <Badge variant="secondary">
              {sortedRecords.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Last updated: {fileInfo.lastUpdate.year}-{String(fileInfo.lastUpdate.month).padStart(2, '0')}-{String(fileInfo.lastUpdate.day).padStart(2, '0')} • 
            {fields.length} fields • 
            File type: 0x{fileInfo.fileType.toString(16).toUpperCase()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Field Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Field Structure</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {visibleColumns.size} of {fields.length} visible
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {fields.map((field, index) => (
              <div key={index} className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                visibleColumns.has(field.name) 
                  ? 'bg-background border-border' 
                  : 'bg-muted/50 border-muted opacity-60'
              }`}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={visibleColumns.has(field.name)}
                    onCheckedChange={() => toggleColumnVisibility(field.name)}
                  />
                  <div>
                    <span className="font-medium">{field.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({field.length}{field.decimalCount > 0 ? `.${field.decimalCount}` : ''})
                    </span>
                  </div>
                </div>
                <Badge className={getFieldTypeColor(field.type)}>
                  {getFieldTypeName(field.type)}
                </Badge>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={showAllColumns}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={hideAllColumns}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Hide All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm bg-background"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
              
              {/* Column Visibility Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Columns className="h-4 w-4" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {fields.map((field) => (
                    <DropdownMenuCheckboxItem
                      key={field.name}
                      checked={visibleColumns.has(field.name)}
                      onCheckedChange={() => toggleColumnVisibility(field.name)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{field.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {field.type}
                        </Badge>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="flex gap-1 p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={showAllColumns}
                      className="flex-1 h-8 text-xs"
                    >
                      Show All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={hideAllColumns}
                      className="flex-1 h-8 text-xs"
                    >
                      Hide All
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleFields.map((field) => (
                    <TableHead 
                      key={field.name}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort(field.name)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{field.name}</span>
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        {sortField === field.name && (
                          <span className="text-xs font-bold">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record, index) => (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                    {visibleFields.map((field) => (
                      <TableCell key={field.name} className="font-mono text-sm">
                        {record[field.name] === null || record[field.name] === undefined 
                          ? <span className="text-muted-foreground italic">null</span>
                          : <span className="break-all">{String(record[field.name])}</span>
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {visibleFields.length === 0 && (
            <div className="p-8 text-center">
              <EyeOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No columns visible</p>
              <p className="text-sm text-muted-foreground mb-4">
                Select columns to display from the field structure above or the columns menu
              </p>
              <Button onClick={showAllColumns} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Show All Columns
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedRecords.length)} of {sortedRecords.length} records
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DbfTable;

