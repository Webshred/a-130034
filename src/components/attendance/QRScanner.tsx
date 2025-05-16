
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (data: string) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, isScanning, setIsScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start the camera when scanning is enabled
  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else if (stream) {
      stopCamera();
    }
    
    return () => {
      if (stream) {
        stopCamera();
      }
    };
  }, [isScanning]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      });
      setIsScanning(false);
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const toggleCamera = () => {
    if (isScanning) {
      setIsScanning(false);
    } else {
      setIsScanning(true);
    }
  };

  // In a real implementation, you would need to add QR code detection logic here
  // This would typically involve a library like jsQR or a service worker
  // For this example, we'll simulate scanning with a timer

  useEffect(() => {
    let scanInterval: NodeJS.Timeout | null = null;
    
    if (isScanning) {
      // Simulate QR detection with random intervals
      scanInterval = setInterval(() => {
        // In a real app, this is where the QR detection would happen
        // For now, we'll just log and not actually detect QR codes
        console.log('Scanning for QR codes...');
      }, 2000);
    }
    
    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [isScanning, onScan]);

  return (
    <Card className="border-2 border-dashed border-gray-200">
      <CardContent className="p-0 overflow-hidden relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        <div className="aspect-video relative bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          
          {!isScanning && !error && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Button 
                onClick={toggleCamera}
                className="flex items-center gap-2 bg-white text-black hover:bg-gray-100"
              >
                <Camera className="h-5 w-5" />
                Start Camera
              </Button>
            </div>
          )}
          
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="border-2 border-blue-400 w-48 h-48 rounded-lg opacity-70"></div>
              <p className="text-white mt-4 bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
                Position QR code in the square
              </p>
            </div>
          )}
        </div>
        
        {isScanning && (
          <div className="p-4 flex justify-center">
            <Button 
              onClick={toggleCamera} 
              variant="outline" 
              className="w-full"
            >
              Stop Scanner
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRScanner;
