
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import Logo from '@/components/Logo';
import { toast } from '@/components/ui/sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (data: any) => {
    console.log('Login data:', data);
    
    // Here you would make API call to Django backend
    // For now, we'll just simulate a successful login
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel with form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 inline-block">
            <Logo />
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Log in to your account to continue</p>
          
          <AuthForm type="login" onSubmit={handleLogin} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right panel with image/design */}
      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-primary/90 to-blue-600/90 text-white">
        <div className="flex flex-col justify-center px-10 md:px-16 max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6">Extract data with precision</h2>
          <p className="text-lg opacity-90 mb-10">
            Access powerful tools for QR code scanning and table extraction, all in one place.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-medium mb-2">QR Scanning</h3>
              <p className="text-sm opacity-80">Extract and decode data from any QR code instantly</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-medium mb-2">Table Extraction</h3>
              <p className="text-sm opacity-80">Convert visual tables to structured data formats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
