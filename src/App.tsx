
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import QRScanner from "./pages/QRScanner";
import TableExtraction from "./pages/TableExtraction";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import QRHistory from "./pages/QRHistory";
import TableHistory from "./pages/TableHistory";
import QRAnalysisReport from "./pages/QRAnalysisReport";

const queryClient = new QueryClient();

const App = () => {
  // Apply saved theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply selected theme
    if (savedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(savedTheme);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/qr-scanner" element={<QRScanner />} />
            <Route path="/qr-history" element={<QRHistory />} />
            <Route path="/qr-analysis-report/:id" element={<QRAnalysisReport />} />
            <Route path="/table-extraction" element={<TableExtraction />} />
            <Route path="/table-history" element={<TableHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
