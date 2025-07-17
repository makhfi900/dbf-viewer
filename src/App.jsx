import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, GitCompare, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                DBF Viewer
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Visual FoxPro File Viewer and Diff Tool
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="secondary" className="badge-glow">
                Visual FoxPro 9
              </Badge>
              <Badge variant="outline">
                File Comparison
              </Badge>
              <Badge variant="outline">
                Responsive Design
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 hover-lift">
                <TabsTrigger value="viewer" className="flex items-center gap-2 text-base py-3">
                  <Database className="h-5 w-5" />
                  File Viewer
                </TabsTrigger>
                <TabsTrigger value="diff" className="flex items-center gap-2 text-base py-3">
                  <GitCompare className="h-5 w-5" />
                  File Diff
                </TabsTrigger>
              </TabsList>

              {/* File Viewer Tab */}
              <TabsContent value="viewer" className="space-y-8 fade-in">
                <Card className="hover-lift">
                  <CardHeader className="gradient-border">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-6 w-6 text-primary" />
                      Single File Viewer
                    </CardTitle>
                    <CardDescription className="text-base">
                      Upload a .dbf file to view its structure and data with advanced filtering and sorting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <FileUpload
                      onFileLoad={handleFile1Load}
                      fileLabel="DBF File"
                      currentFile={file1Name}
                    />
                  </CardContent>
                </Card>

                {isLoading && (
                  <Card className="fade-in">
                    <CardContent className="p-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium">Parsing DBF file...</p>
                          <p className="text-sm text-muted-foreground">
                            Analyzing file structure and loading data
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {error && (
                  <Card className="fade-in border-destructive/50">
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                      <p className="text-lg font-medium text-destructive mb-2">Error Processing File</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </CardContent>
                  </Card>
                )}

                {file1Data && (
                  <div className="slide-in">
                    <DbfTable data={file1Data} fileName={file1Name} />
                  </div>
                )}
              </TabsContent>

              {/* File Diff Tab */}
              <TabsContent value="diff" className="space-y-8 fade-in">
                <Card className="hover-lift">
                  <CardHeader className="gradient-border">
                    <CardTitle className="flex items-center gap-2">
                      <GitCompare className="h-6 w-6 text-primary" />
                      File Comparison
                    </CardTitle>
                    <CardDescription className="text-base">
                      Upload two .dbf files to compare their differences with detailed analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                          First File
                        </h3>
                        <FileUpload
                          onFileLoad={handleFile1Load}
                          fileLabel="First DBF File"
                          currentFile={file1Name}
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                          Second File
                        </h3>
                        <FileUpload
                          onFileLoad={handleFile2Load}
                          fileLabel="Second DBF File"
                          currentFile={file2Name}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Show individual file data when available */}
                {file1Data && (
                  <div className="slide-in">
                    <Card className="hover-lift">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                          First File: {file1Name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DbfTable data={file1Data} fileName={file1Name} />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {file2Data && (
                  <div className="slide-in">
                    <Card className="hover-lift">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                          Second File: {file2Name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DbfTable data={file2Data} fileName={file2Name} />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Diff Results */}
                <div className="slide-in">
                  <DiffViewer 
                    file1Data={file1Data}
                    file1Name={file1Name}
                    file2Data={file2Data}
                    file2Name={file2Name}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Footer */}
          <footer className="mt-16 text-center text-sm text-muted-foreground fade-in">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Database className="h-4 w-4" />
              <span>Built with React, Tailwind CSS, and shadcn/ui</span>
            </div>
            <p>Open source DBF viewer for Visual FoxPro files</p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
