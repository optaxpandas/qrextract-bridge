
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Logo className="mb-8" />
      
      <h1 className="text-5xl font-bold mb-4 animate-fade-in">404</h1>
      <h2 className="text-2xl font-medium mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        Page Not Found
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <Button className="flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
