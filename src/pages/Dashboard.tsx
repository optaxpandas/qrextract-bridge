import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import { QrCode, Table } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast.error('Please log in to access the dashboard');
      navigate('/login');
      return;
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar isLoggedIn onLogout={handleLogout} />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 animate-fade-in">
              Dashboard
            </span>
            <h1 className="text-4xl font-bold mb-4 animate-slide-up">
              Choose Your Tool
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Select one of our powerful tools to extract and analyze data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <FeatureCard
              icon={QrCode}
              title="QR Code Scanner"
              description="Scan and analyze QR codes. Extract information and interpret the data."
              to="/qr-scanner"
              className="animate-scale-in"
            />
            
            <FeatureCard
              icon={Table}
              title="Table Extraction"
              description="Extract tables from images or documents and convert them to structured data."
              to="/table-extraction"
              className="animate-scale-in"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
