import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Minus, 
  Edit, 
  BarChart3, 
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { compareDbfFiles, getDiffStats } from '../utils/dbfDiff';

const DiffViewer = ({ file1Data, file1Name, file2Data, file2Name }) => {
  const [activeView, setActiveView] = useState('summary');
  
  const diffResult = useMemo(() => {
    if (!file1Data || !file2Data) return null;
    return compareDbfFiles(file1Data, file2Data);
  }, [file1Data, file2Data]);
  
  const diffStats = useMemo(() => {
    if (!diffResult) return null;
    return getDiffStats(diffResult);
  }, [diffResult]);

  if (!file1Data || !file2Data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Upload two DBF files to compare</p>
          <p className="text-sm text-muted-foreground">
            Both files must be uploaded to see the comparison
          </p>
        </CardContent>
      </Card>
    );
  }

  const { fieldDifferences, recordDifferences, summary } = diffResult;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparison Summary
          </CardTitle>
          <CardDescription>
            Comparing {file1Name} with {file2Name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.file1RecordCount}
              </div>
              <div className="text-sm text-muted-foreground">Records in File 1</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {summary.file2RecordCount}
              </div>
              <div className="text-sm text-muted-foreground">Records in File 2</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {diffStats.recordChanges}
              </div>
              <div className="text-sm text-muted-foreground">Record Changes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summary.fieldChanges}
              </div>
              <div className="text-sm text-muted-foreground">Field Changes</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.addedRecords > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Plus className="h-3 w-3 mr-1" />
                {summary.addedRecords} Added
              </Badge>
            )}
            {summary.removedRecords > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <Minus className="h-3 w-3 mr-1" />
                {summary.removedRecords} Removed
              </Badge>
            )}
            {summary.modifiedRecords > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Edit className="h-3 w-3 mr-1" />
                {summary.modifiedRecords} Modified
              </Badge>
            )}
            {diffStats.totalChanges === 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Files are identical
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="fields">Field Changes</TabsTrigger>
              <TabsTrigger value="records">Record Changes</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{file1Name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Records:</span>
                        <span className="font-medium">{summary.file1RecordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fields:</span>
                        <span className="font-medium">{file1Data.fields.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span className="font-medium">
                          {file1Data.fileInfo.lastUpdate.year}-
                          {String(file1Data.fileInfo.lastUpdate.month).padStart(2, '0')}-
                          {String(file1Data.fileInfo.lastUpdate.day).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{file2Name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Records:</span>
                        <span className="font-medium">{summary.file2RecordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fields:</span>
                        <span className="font-medium">{file2Data.fields.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span className="font-medium">
                          {file2Data.fileInfo.lastUpdate.year}-
                          {String(file2Data.fileInfo.lastUpdate.month).padStart(2, '0')}-
                          {String(file2Data.fileInfo.lastUpdate.day).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fields" className="space-y-4">
              {fieldDifferences.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-medium">No field differences found</p>
                    <p className="text-sm text-muted-foreground">
                      Both files have identical field structures
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {fieldDifferences.map((diff, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {diff.type === 'added' && (
                            <>
                              <Plus className="h-4 w-4 text-green-600" />
                              <Badge className="bg-green-100 text-green-800">Added</Badge>
                            </>
                          )}
                          {diff.type === 'removed' && (
                            <>
                              <Minus className="h-4 w-4 text-red-600" />
                              <Badge className="bg-red-100 text-red-800">Removed</Badge>
                            </>
                          )}
                          {diff.type === 'modified' && (
                            <>
                              <Edit className="h-4 w-4 text-yellow-600" />
                              <Badge className="bg-yellow-100 text-yellow-800">Modified</Badge>
                            </>
                          )}
                          <span className="font-medium">{diff.fieldName}</span>
                        </div>
                        
                        {diff.type === 'modified' && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">File 1:</span>
                              <div className="text-muted-foreground">
                                Type: {diff.field1.type}, Length: {diff.field1.length}
                                {diff.field1.decimalCount > 0 && `, Decimals: ${diff.field1.decimalCount}`}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">File 2:</span>
                              <div className="text-muted-foreground">
                                Type: {diff.field2.type}, Length: {diff.field2.length}
                                {diff.field2.decimalCount > 0 && `, Decimals: ${diff.field2.decimalCount}`}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              {recordDifferences.added.length === 0 && 
               recordDifferences.removed.length === 0 && 
               recordDifferences.modified.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-medium">No record differences found</p>
                    <p className="text-sm text-muted-foreground">
                      All records are identical between the two files
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Added Records */}
                  {recordDifferences.added.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                          <Plus className="h-5 w-5" />
                          Added Records ({recordDifferences.added.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground mb-2">
                          Records present in {file2Name} but not in {file1Name}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Index</TableHead>
                                {file2Data.fields.slice(0, 3).map(field => (
                                  <TableHead key={field.name}>{field.name}</TableHead>
                                ))}
                                {file2Data.fields.length > 3 && <TableHead>...</TableHead>}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recordDifferences.added.slice(0, 10).map((item, index) => (
                                <TableRow key={index} className="bg-green-50">
                                  <TableCell>{item.index}</TableCell>
                                  {file2Data.fields.slice(0, 3).map(field => (
                                    <TableCell key={field.name} className="font-mono text-sm">
                                      {String(item.record[field.name] || '')}
                                    </TableCell>
                                  ))}
                                  {file2Data.fields.length > 3 && <TableCell>...</TableCell>}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {recordDifferences.added.length > 10 && (
                            <div className="text-center text-sm text-muted-foreground mt-2">
                              ... and {recordDifferences.added.length - 10} more
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Removed Records */}
                  {recordDifferences.removed.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <Minus className="h-5 w-5" />
                          Removed Records ({recordDifferences.removed.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground mb-2">
                          Records present in {file1Name} but not in {file2Name}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Index</TableHead>
                                {file1Data.fields.slice(0, 3).map(field => (
                                  <TableHead key={field.name}>{field.name}</TableHead>
                                ))}
                                {file1Data.fields.length > 3 && <TableHead>...</TableHead>}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recordDifferences.removed.slice(0, 10).map((item, index) => (
                                <TableRow key={index} className="bg-red-50">
                                  <TableCell>{item.index}</TableCell>
                                  {file1Data.fields.slice(0, 3).map(field => (
                                    <TableCell key={field.name} className="font-mono text-sm">
                                      {String(item.record[field.name] || '')}
                                    </TableCell>
                                  ))}
                                  {file1Data.fields.length > 3 && <TableCell>...</TableCell>}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {recordDifferences.removed.length > 10 && (
                            <div className="text-center text-sm text-muted-foreground mt-2">
                              ... and {recordDifferences.removed.length - 10} more
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Modified Records */}
                  {recordDifferences.modified.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-600">
                          <Edit className="h-5 w-5" />
                          Modified Records ({recordDifferences.modified.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground mb-2">
                          Records with field-level changes between the files
                        </div>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {recordDifferences.modified.slice(0, 5).map((item, index) => (
                            <div key={index} className="border rounded p-3 bg-yellow-50">
                              <div className="font-medium mb-2">Record {item.index}</div>
                              <div className="space-y-1">
                                {item.fieldChanges.map((change, changeIndex) => (
                                  <div key={changeIndex} className="text-sm">
                                    <span className="font-medium">{change.fieldName}:</span>
                                    <span className="text-red-600 line-through ml-2">
                                      {String(change.oldValue || 'null')}
                                    </span>
                                    <span className="text-green-600 ml-2">
                                      {String(change.newValue || 'null')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          {recordDifferences.modified.length > 5 && (
                            <div className="text-center text-sm text-muted-foreground">
                              ... and {recordDifferences.modified.length - 5} more
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiffViewer;

