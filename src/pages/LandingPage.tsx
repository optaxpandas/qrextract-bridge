
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';
import { ArrowRight, QrCode, Table } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 md:px-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-slide-up">
              Unlock Data from <span className="gradient-text">QR Codes</span> and <span className="gradient-text">Tables</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Powerful tools to extract, analyze, and process data from QR codes and tables with precision and speed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button size="lg" className="px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 md:px-10 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Choose Your Tool
            </h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <div className="feature-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="icon-container">
                  <QrCode size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-3">QR Code Scanner</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Scan and decode QR codes instantly. Extract embedded data and analyze the content with our powerful scanning tools.
                </p>
                <Link to="/signup">
                  <Button className="w-full">
                    Explore QR Scanning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="feature-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="icon-container">
                  <Table size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Table Extraction</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Extract data from tables in images or documents. Convert visual tables to structured, analyzable data formats.
                </p>
                <Link to="/signup">
                  <Button className="w-full">
                    Explore Table Extraction
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-10">
          <div className="max-w-4xl mx-auto text-center glass-effect p-10 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Extract Data?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Create an account now and start using our powerful tools to extract and analyze data from QR codes and tables.
            </p>
            <Link to="/signup">
              <Button size="lg" className="px-8">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-10 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2023 QRExtract. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
