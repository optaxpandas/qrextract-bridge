import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { FileUp, Table as TableIcon, Download, FileJson, FileSpreadsheet, ClipboardCopy, Loader2, History } from 'lucide-react';
import { toast } from 'sonner';
import { BlobServiceClient } from '@azure/storage-blob';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { tableApi, handleApiError } from '@/services/api';

interface TableData {
  id: number;
  product: string;
  price: string;
  stock: number;
  [key: string]: any;
}

const SAS = "https://scanlytic.blob.core.windows.net/scanlytic-blob?sp=racw&st=2025-03-24T15:56:56Z&se=2025-06-29T23:56:56Z&sv=2024-11-04&sr=c&sig=iYgL2Ca7pMUToWEvbtmOptRqV4sGipq1Uezj3ZR0KMA%3D";
const CONTAINER_NAME = 'scanlytic-blob';

const TableExtraction: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<TableData[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast.error('Please log in to access this feature');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);
    setExtractedData(null);

    setTimeout(() => {
      setIsUploading(false);
      toast.success('File uploaded successfully!');
    }, 1500);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const extractData = async () => {
    if (!uploadedFile) return;
    setIsExtracting(true);

    try {
      const blobServiceClient = new BlobServiceClient(SAS);
      const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
      const blobClient = containerClient.getBlockBlobClient(uploadedFile.name);

      await blobClient.uploadBrowserData(uploadedFile, {
        blobHTTPHeaders: {
          blobContentType: uploadedFile.type,
        },
      });

      const blobUrl = blobClient.url;

      const response = await tableApi.extractTable({
        image_url: blobUrl,
        file_name: uploadedFile.name,
        format: 'csv',
      });

      const { content, fileName } = response.data;

      const fileRes = await fetch(content);
      const blob = await fileRes.blob();

      if (fileName.endsWith('.csv')) {
        const text = await blob.text();
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });
        setExtractedData(parsed.data as TableData[]);
      } else if (fileName.endsWith('.xlsx')) {
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<TableData>(sheet);
        setExtractedData(jsonData);
      }
      
      toast.success('Table extraction completed successfully!');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsExtracting(false);
    }
  };

  const downloadJSON = () => {
    if (!extractedData) return;
    
    const dataStr = JSON.stringify(extractedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'extracted-table-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('JSON file downloaded!');
  };

  const downloadCSV = () => {
    if (!extractedData || extractedData.length === 0) return;
    
    const headers = Object.keys(extractedData[0]);
    
    let csvContent = headers.join(',') + '\n';
    
    extractedData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return `"${value}"`;
      });
      csvContent += values.join(',') + '\n';
    });
    
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    
    const exportFileDefaultName = 'extracted-table-data.csv';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('CSV file downloaded!');
  };

  const copyToClipboard = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    toast.success('Copied to clipboard!');
  };

  const viewTableHistory = () => {
    navigate('/table-history');
  };

  return (
    <>
      <Navbar isLoggedIn onLogout={handleLogout} />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 animate-fade-in">
              Table Extraction
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
              Extract Data from Tables
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Upload images containing tables and extract structured data in various formats.
            </p>
          </div>

          <Card className="mb-8 animate-scale-in">
            <CardHeader>
              <CardTitle>Upload Table Image</CardTitle>
              <CardDescription>
                Upload an image containing a table to extract the data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-muted rounded-lg p-10 mb-6 text-center cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={triggerFileInput}
              >
                {isUploading ? (
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                    <p>Uploading file...</p>
                  </div>
                ) : uploadedFile ? (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <TableIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="font-medium">File uploaded: {uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {Math.round(uploadedFile.size / 1024)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Click to upload an image containing a table or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports PNG, JPG or JPEG
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFileUpload}
              />
              <div className="flex gap-3">
                <Button 
                  onClick={triggerFileInput} 
                  disabled={isUploading} 
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>Select File</>
                  )}
                </Button>
                <Button 
                  onClick={extractData} 
                  disabled={isExtracting || !uploadedFile} 
                  className="flex-1"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>Extract Data</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {extractedData && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Extracted Table Data</CardTitle>
                <CardDescription>
                  The data extracted from your table image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border mb-6 overflow-hidden">
                  <Table>
                    <TableHeader>
                      {extractedData.length > 0 && (
                        <TableRow>
                          {Object.keys(extractedData[0]).map((header) => (
                            <TableHead key={header} className="font-medium">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      )}
                    </TableHeader>
                    <TableBody>
                      {extractedData.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value, i) => (
                            <TableCell key={i}>{String(value)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <ClipboardCopy size={16} className="mr-2" />
                    Copy Table
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadJSON}>
                    <FileJson size={16} className="mr-2" />
                    Download JSON
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadCSV}>
                    <FileSpreadsheet size={16} className="mr-2" />
                    Download CSV
                  </Button>
                  <Button size="sm">
                    <Download size={16} className="mr-2" />
                    Export All
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-6 mt-4">
                <p className="text-sm text-muted-foreground">
                  Processing is done on your Django backend for accuracy and security
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default TableExtraction;
