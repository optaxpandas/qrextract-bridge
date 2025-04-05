import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, FileUp, Link as LinkIcon, ClipboardCopy, Download, Loader2, QrCode } from 'lucide-react';
import { toast } from 'sonner';

import { BrowserQRCodeReader, NotFoundException } from '@zxing/library';

const BACKEND_API_URL = 'http://localhost:8000/api/qrdata/';

const QRScanner: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast.error('Please log in to access this feature');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (cameraActive) {
        stopCameraScanning();
      }
    };
  }, [cameraActive]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannedData(null);

    try {
      const imageElement = document.createElement('img');
      imageElement.src = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });
      
      const result = await codeReader.current.decodeFromImageElement(imageElement);
      const data = result.getText();
      setScannedData(data);
      toast.success('QR code scanned successfully!');
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast.error('Failed to scan QR code. Please try again with a clearer image.');
    } finally {
      setIsScanning(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startCameraScanning = async () => {
    setIsScanning(true);
    setScannedData(null);
    
    try {
      // First check if we already have permission
      if (hasPermission === null) {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setHasPermission(true);
        } catch (err) {
          setHasPermission(false);
          toast.error('Camera permission denied. Please allow camera access to scan QR codes.');
          setIsScanning(false);
          return;
        }
      }
      
      if (hasPermission === false) {
        toast.error('Camera permission denied. Please allow camera access to scan QR codes.');
        setIsScanning(false);
        return;
      }
      
      // Stop existing camera if active
      if (cameraActive) {
        stopCameraScanning();
      }

      // Get available cameras
      let videoDevices = [];
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available cameras:', videoDevices);
      } catch (err) {
        console.error('Error getting video devices:', err);
        // Continue with default camera
      }
      
      if (videoDevices.length === 0) {
        console.warn('No cameras detected via enumerateDevices, trying default camera');
      }
      
      // Get camera stream directly without ZXing's method
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
      } catch (err) {
        console.error('Failed to access environment camera, trying default:', err);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err2) {
          console.error('Failed to access any camera:', err2);
          toast.error('Could not access camera. Please check camera permissions.');
          setIsScanning(false);
          return;
        }
      }
      
      // Allow time for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to attach stream to video element
      if (!videoRef.current) {
        console.warn('Video element reference is not available, using fallback');
        
        // Fallback solution with a programmatically created video element
        const tempVideo = document.createElement('video');
        tempVideo.autoplay = true;
        tempVideo.playsInline = true;
        tempVideo.muted = true;
        tempVideo.srcObject = stream;
        
        try {
          await tempVideo.play();
          
          // Use the temp video for QR scanning
          codeReader.current.decodeFromVideoElement(tempVideo, (result, error) => {
            if (result) {
              const data = result.getText();
              setScannedData(data);
              toast.success('QR code scanned successfully!');
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error('QR scan error:', error);
            }
          });
          
          setCameraActive(true);
          setIsScanning(false);
          return;
        } catch (err) {
          console.error('Fallback video failed:', err);
          throw new Error('Cannot access camera stream');
        }
      }
      
      // Normal path
      videoRef.current.srcObject = stream;
      
      try {
        await videoRef.current.play();
        console.log('Video is playing:', !videoRef.current.paused);
        
        codeReader.current.decodeFromVideoDevice(
          undefined, // Let the browser use the active stream
          videoRef.current, 
          (result, error) => {
            if (result) {
              const data = result.getText();
              setScannedData(data);
              toast.success('QR code scanned successfully!');
              // Don't stop scanning automatically
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error('QR scan error:', error);
            }
          }
        );
        
        setCameraActive(true);
      } catch (playError) {
        console.error('Error playing video:', playError);
        toast.error('Failed to start video. Please try again.');
        throw playError;
      }
      
      setIsScanning(false);
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Failed to start camera. Please try again.');
      setIsScanning(false);
      stopCameraScanning();
    }
  };

  const stopCameraScanning = () => {
    try {
      codeReader.current.reset();
      
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Track stopped:', track.kind, track.readyState);
        });
        videoRef.current.srcObject = null;
      }
      
      setCameraActive(false);
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };

  const analyzeData = () => {
    if (!scannedData) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      
      if (scannedData.startsWith('http')) {
        toast.success('Analysis complete: Web URL detected');
      } else if (scannedData.match(/^[A-Z0-9]{6}$/)) {
        toast.success('Analysis complete: Verification code detected');
      } else if (scannedData.includes('@')) {
        toast.success('Analysis complete: Email address detected');
      } else if (scannedData.match(/^\+?[0-9\s\-\(\)]{10,}$/)) {
        toast.success('Analysis complete: Phone number detected');
      } else {
        toast.success('Analysis complete: Plain text data');
      }
    }, 2000);
  };

  const copyToClipboard = () => {
    if (!scannedData) return;
    
    navigator.clipboard.writeText(scannedData);
    toast.success('Copied to clipboard!');
  };

  const sendToBackend = async () => {
    if (!scannedData) return;
    
    setIsSending(true);
    
    try {
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: scannedData,
          timestamp: new Date().toISOString(),
          device_info: navigator.userAgent
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      toast.success('Data sent to backend successfully!');
      console.log('Backend response:', result);
    } catch (error) {
      console.error('Error sending data to backend:', error);
      toast.error('Failed to send data to backend. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Navbar isLoggedIn onLogout={handleLogout} />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 animate-fade-in">
              QR Scanner
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
              Scan &amp; Analyze QR Codes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Scan QR codes using your camera or upload QR code images to extract and send data to Django backend.
            </p>
          </div>

          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>QR Code Scanner</CardTitle>
              <CardDescription>
                Choose how you want to scan your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="camera" className="flex items-center gap-2">
                    <Camera size={16} />
                    <span>Camera</span>
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <FileUp size={16} />
                    <span>Upload</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="camera" className="pt-6">
                  <div className="bg-muted aspect-video rounded-lg flex items-center justify-center mb-6 overflow-hidden relative">
                    <video 
                      ref={videoRef} 
                      className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                      autoPlay
                      playsInline
                      muted
                    ></video>
                    
                    {isScanning ? (
                      <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                        <p>Accessing camera...</p>
                      </div>
                    ) : cameraActive ? (
                      <></> /* Video is shown above */
                    ) : scannedData ? (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                          <LinkIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="font-medium">QR Code Scanned!</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <QrCode className="h-16 w-16 mx-auto mb-2 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Camera feed will appear here</p>
                      </div>
                    )}
                  </div>
                  {cameraActive ? (
                    <Button 
                      onClick={stopCameraScanning} 
                      variant="destructive"
                      className="w-full"
                    >
                      Stop Camera
                    </Button>
                  ) : (
                    <Button 
                      onClick={startCameraScanning} 
                      disabled={isScanning} 
                      className="w-full"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>Start Camera Scan</>
                      )}
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value="upload" className="pt-6">
                  <div 
                    className="border-2 border-dashed border-muted rounded-lg p-10 mb-6 text-center cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={triggerFileInput}
                  >
                    {isScanning ? (
                      <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                        <p>Processing image...</p>
                      </div>
                    ) : scannedData ? (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                          <LinkIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="font-medium">QR Code Detected!</p>
                      </div>
                    ) : (
                      <>
                        <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Click to upload a QR code image or drag and drop
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
                  <Button 
                    onClick={triggerFileInput} 
                    disabled={isScanning} 
                    className="w-full"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Upload QR Code</>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              {scannedData && (
                <div className="mt-8 animate-fade-in">
                  <h3 className="text-lg font-medium mb-2">Scanned Result</h3>
                  <div className="bg-muted/50 p-4 rounded-lg break-all mb-4">
                    <p className="font-mono">{scannedData}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <ClipboardCopy size={16} className="mr-2" />
                      Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        if (scannedData.startsWith('http')) {
                          window.open(scannedData, '_blank');
                        } else {
                          toast.info('This content cannot be downloaded directly');
                        }
                      }}
                    >
                      <Download size={16} className="mr-2" />
                      Download/Open
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={analyzeData}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>Analyze Data</>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={sendToBackend}
                      disabled={isSending}
                    >
                      {isSending ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>Send to Backend</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6 mt-4">
              <p className="text-sm text-muted-foreground">
                This scanner connects to your Django backend for advanced analysis
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
};

export default QRScanner;