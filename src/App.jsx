import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, GitCompare } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import FileUpload from './components/FileUpload';
import DbfTable from './components/DbfTable';
import DiffViewer from './components/DiffViewer';
import { useDbfParser } from './hooks/useDbfParser';
import './App.css';

function App() {
  const [file1Data, setFile1Data] = useState(null);
  const [file1Name, setFile1Name] = useState(null);
  const [file2Data, setFile2Data] = useState(null);
  const [file2Name, setFile2Name] = useState(null);
  const [activeTab, setActiveTab] = useState('viewer');
  
  const { parseFile, isLoading, error } = useDbfParser();

  const handleFile1Load = async (arrayBuffer, fileName) => {
    if (arrayBuffer) {
      try {
        const data = await parseFile(arrayBuffer);
        setFile1Data(data);
        setFile1Name(fileName);
      } catch (err) {
        console.error('Error parsing file 1:', err);
        alert('Error parsing DBF file: ' + err.message);
      }
    } else {
      setFile1Data(null);
      setFile1Name(null);
    }
  };

  const handleFile2Load = async (arrayBuffer, fileName) => {
    if (arrayBuffer) {
      try {
        const data = await parseFile(arrayBuffer);
        setFile2Data(data);
        setFile2Name(fileName);
      } catch (err) {
        console.error('Error parsing file 2:', err);
        alert('Error parsing DBF file: ' + err.message);
      }
    } else {
      setFile2Data(null);
      setFile2Name(null);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">DBF Viewer</h1>
            <p className="text-lg text-muted-foreground">
              Visual FoxPro File Viewer and Diff Tool
            </p>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="viewer" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                File Viewer
              </TabsTrigger>
              <TabsTrigger value="diff" className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                File Diff
              </TabsTrigger>
            </TabsList>

            {/* File Viewer Tab */}
            <TabsContent value="viewer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Single File Viewer</CardTitle>
                  <CardDescription>
                    Upload a .dbf file to view its structure and data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileLoad={handleFile1Load}
                    fileLabel="DBF File"
                    currentFile={file1Name}
                  />
                </CardContent>
              </Card>

              {isLoading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Parsing DBF file...</p>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-destructive">Error: {error}</p>
                  </CardContent>
                </Card>
              )}

              {file1Data && (
                <DbfTable data={file1Data} fileName={file1Name} />
              )}
            </TabsContent>

            {/* File Diff Tab */}
            <TabsContent value="diff" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>File Comparison</CardTitle>
                  <CardDescription>
                    Upload two .dbf files to compare their differences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FileUpload
                      onFileLoad={handleFile1Load}
                      fileLabel="First DBF File"
                      currentFile={file1Name}
                    />
                    <FileUpload
                      onFileLoad={handleFile2Load}
                      fileLabel="Second DBF File"
                      currentFile={file2Name}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Show individual file data when available */}
              {file1Data && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">First File: {file1Name}</h3>
                  <DbfTable data={file1Data} fileName={file1Name} />
                </div>
              )}

              {file2Data && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Second File: {file2Name}</h3>
                  <DbfTable data={file2Data} fileName={file2Name} />
                </div>
              )}

              {/* Diff Results */}
              <DiffViewer 
                file1Data={file1Data}
                file1Name={file1Name}
                file2Data={file2Data}
                file2Name={file2Name}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
