import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, FileUp, Link as LinkIcon, ClipboardCopy, Download, Loader2, QrCode, SendHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { BrowserQRCodeReader, NotFoundException } from '@zxing/library';
import { qrApi, handleApiError } from '@/services/api';

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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast.error('Please log in to access this feature');
      navigate('/login');
    }
  }, [navigate]);

  // Cleanup function to stop all tracks when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
      if (cameraActive) {
        stopCameraScanning();
      }
    };
  }, [cameraActive]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannedData(null);
    setCapturedImage(null);

    try {
      const imageElement = document.createElement('img');
      imageElement.src = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });
      
      const result = await codeReader.current.decodeFromImageElement(imageElement);
      const data = result.getText();
      setScannedData(data);
      setCapturedImage(imageElement.src);
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

  const captureVideoFrame = () => {
    if (!videoRef.current) return;
    
    // Create a canvas element to capture the frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Draw the current video frame to the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL (base64 encoded image)
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      toast.success('QR code image captured!');
    }
  };

  const startCameraScanning = async () => {
    setIsScanning(true);
    setScannedData(null);
    setCapturedImage(null);
    
    try {
      // First check if we already have permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        // Save the stream to make it easier to clean up later
        streamRef.current = stream;
        setHasPermission(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(err => {
              console.error("Error playing video:", err);
              toast.error("Failed to start video stream");
            });
          };
          
          // Start QR code detection
          codeReader.current.decodeFromStream(stream, videoRef.current, (result, error) => {
            if (result) {
              const data = result.getText();
              setScannedData(data);
              
              // Capture frame when QR code is detected
              captureVideoFrame();
              
              toast.success('QR code scanned successfully!');
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error('QR scan error:', error);
            }
          });
          
          setCameraActive(true);
        } else {
          throw new Error("Video element reference not available");
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setHasPermission(false);
        toast.error('Camera permission denied. Please allow camera access to scan QR codes.');
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Failed to start camera. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const stopCameraScanning = () => {
    try {
      codeReader.current.reset();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
      
      if (videoRef.current) {
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
      await qrApi.sendQRData({
        data: scannedData,
        timestamp: new Date().toISOString(),
        device_info: navigator.userAgent,
        image: capturedImage // Including the captured image
      });
      
      toast.success('Data and image sent to backend successfully!');
      
      // Navigate to QR analysis report page if needed
      // navigate('/qr-analysis-report', { state: { analysisData: response.data } });
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSending(false);
    }
  };

  const viewQRHistory = () => {
    navigate('/qr-history');
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
                  
                  {capturedImage && (
                    <div className="mt-4 mb-4">
                      <h3 className="text-sm font-medium mb-2">Captured QR Image:</h3>
                      <div className="border rounded-md overflow-hidden max-w-xs">
                        <img src={capturedImage} alt="Captured QR code" className="w-full" />
                      </div>
                      {cameraActive && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setCapturedImage(null);
                            toast.info('Ready to capture new QR image');
                          }}
                          className="mt-2"
                        >
                          Retake Picture
                        </Button>
                      )}
                    </div>
                  )}
                  
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
                        <>Initial Analysis</>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={sendToBackend}
                      disabled={isSending || !capturedImage}
                    >
                      {isSending ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>Send for Deep Analysis</>
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
