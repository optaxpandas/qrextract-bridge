
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loader2, ExternalLink, FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'sonner';
import { tableApi, handleApiError } from '@/services/api';

interface TableHistoryItem {
  id: string;
  file_name: string;
  created_at: string;
  rows_count?: number;
  columns_count?: number;
  status: 'completed' | 'processing' | 'failed';
  [key: string]: any;
}

const TableHistory: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tableHistory, setTableHistory] = useState<TableHistoryItem[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast.error('Please log in to access this feature');
      navigate('/login');
    } else {
      fetchTableHistory();
    }
  }, [navigate]);

  const fetchTableHistory = async () => {
    setIsLoading(true);
    try {
      const data = await tableApi.getAllTables();
      setTableHistory(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const viewTableDetails = (id: string) => {
    navigate(`/table-details/${id}`);
  };

  const downloadTable = async (id: string, fileName: string) => {
    try {
      const tableData = await tableApi.getTableById(id);
      
      // Trigger download based on the file type
      if (tableData.content) {
        const link = document.createElement('a');
        link.href = tableData.content;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Table data downloaded successfully');
      } else {
        toast.error('No downloadable content available');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <Navbar isLoggedIn onLogout={handleLogout} />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Table Extraction History</h1>
            <p className="text-lg text-muted-foreground">
              View all your previously extracted tables
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Extracted Tables</CardTitle>
              <CardDescription>
                History of all tables you've extracted from images
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : tableHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FileSpreadsheet className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                  <p className="text-muted-foreground">No tables have been extracted yet</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/table-extraction')}
                  >
                    Extract a table
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{item.file_name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'completed' ? 'bg-green-100 text-green-700' :
                              item.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.rows_count && item.columns_count 
                              ? `${item.rows_count} × ${item.columns_count}`
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => viewTableDetails(item.id)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => downloadTable(item.id, item.file_name)}
                                disabled={item.status !== 'completed'}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default TableHistory;
