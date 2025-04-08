
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loader2, ExternalLink, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { qrApi, handleApiError } from '@/services/api';

interface QRData {
  id: string;
  url?: string;
  data: string;
  timestamp: string;
  created_at: string;
  risk_level?: string;
  [key: string]: any;
}

const QRHistory: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [qrHistory, setQrHistory] = useState<QRData[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast.error('Please log in to access this feature');
      navigate('/login');
    } else {
      fetchQRHistory();
    }
  }, [navigate]);

  const fetchQRHistory = async () => {
    setIsLoading(true);
    try {
      const data = await qrApi.getQRHistory();
      setQrHistory(data);
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

  const viewQRDetails = (id: string) => {
    navigate(`/qr-analysis-report/${id}`);
  };

  return (
    <>
      <Navbar isLoggedIn onLogout={handleLogout} />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">QR Code History</h1>
            <p className="text-lg text-muted-foreground">
              View all your previously scanned QR codes
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scanned QR Codes</CardTitle>
              <CardDescription>
                History of all QR codes you've scanned with analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : qrHistory.length === 0 ? (
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                  <p className="text-muted-foreground">No QR codes have been scanned yet</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/qr-scanner')}
                  >
                    Scan a QR code
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {qrHistory.map((qr) => (
                        <TableRow key={qr.id}>
                          <TableCell>
                            {new Date(qr.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-mono truncate max-w-xs">
                            {qr.data}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              qr.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                              qr.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {qr.risk_level || 'low'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewQRDetails(qr.id)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
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

export default QRHistory;
