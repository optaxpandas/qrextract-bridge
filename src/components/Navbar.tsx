
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, QrCode, Table, Home } from 'lucide-react';

type NavbarProps = {
  isLoggedIn?: boolean;
  onLogout?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn = false, 
  onLogout = () => {} 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={isLoggedIn ? "/dashboard" : "/"}>
          <Logo className="transition-transform hover:scale-105" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              {/* Navigation Links */}
              <div className="flex items-center mr-4 space-x-1">
                <Link to="/dashboard">
                  <Button variant="ghost" className={cn(
                    "flex items-center gap-2",
                    location.pathname === '/dashboard' && "bg-primary/10 text-primary"
                  )}>
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Link to="/qr-scanner">
                  <Button variant="ghost" className={cn(
                    "flex items-center gap-2",
                    location.pathname === '/qr-scanner' && "bg-primary/10 text-primary"
                  )}>
                    <QrCode size={18} />
                    <span>QR Scanner</span>
                  </Button>
                </Link>
                <Link to="/table-extraction">
                  <Button variant="ghost" className={cn(
                    "flex items-center gap-2",
                    location.pathname === '/table-extraction' && "bg-primary/10 text-primary"
                  )}>
                    <Table size={18} />
                    <span>Table Extraction</span>
                  </Button>
                </Link>
              </div>
              
              {/* Logout Button */}
              <Button 
                variant="ghost" 
                className="flex items-center gap-2" 
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg shadow-md p-4 flex flex-col gap-3 animate-slide-down">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="w-full">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex items-center justify-start gap-2 w-full",
                    location.pathname === '/dashboard' && "bg-primary/10 text-primary"
                  )}
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link to="/qr-scanner" className="w-full">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex items-center justify-start gap-2 w-full",
                    location.pathname === '/qr-scanner' && "bg-primary/10 text-primary"
                  )}
                >
                  <QrCode size={18} />
                  <span>QR Scanner</span>
                </Button>
              </Link>
              <Link to="/table-extraction" className="w-full">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex items-center justify-start gap-2 w-full",
                    location.pathname === '/table-extraction' && "bg-primary/10 text-primary"
                  )}
                >
                  <Table size={18} />
                  <span>Table Extraction</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="flex items-center justify-start gap-2 w-full mt-2 border-t pt-2" 
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full">Log In</Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
