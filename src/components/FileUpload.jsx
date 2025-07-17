import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';

const FileUpload = ({ onFileLoad, fileLabel, currentFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file.name.toLowerCase().endsWith('.dbf')) {
      alert('Please select a .dbf file');
      return;
    }

    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        onFileLoad(arrayBuffer, file.name);
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      setIsProcessing(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearFile = () => {
    onFileLoad(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="hover-lift fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5 text-primary" />
          {fileLabel}
        </CardTitle>
        <CardDescription>
          Upload a Visual FoxPro .dbf file to view its contents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {currentFile}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    File loaded successfully
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`upload-area custom-scrollbar p-8 rounded-lg text-center cursor-pointer transition-all duration-300 ${
                isDragOver ? 'drag-over' : ''
              } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleButtonClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".dbf"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <div className="space-y-4">
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-lg font-medium">Processing file...</p>
                    <p className="text-sm text-muted-foreground">
                      Parsing DBF structure and data
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium mb-2">
                        Drop your .dbf file here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click to browse files
                      </p>
                      <Badge variant="outline" className="badge-glow">
                        Supports Visual FoxPro 9 format
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {!isProcessing && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleButtonClick}
                  className="flex items-center gap-2 hover-lift"
                >
                  <Upload className="h-4 w-4" />
                  Browse Files
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;

