
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, ShieldCheck } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface PinContextType {
  verifyPin: (pageName: string) => Promise<boolean>;
  isAuthenticating: boolean;
}

interface PinContextProviderProps {
  children: ReactNode;
}

// Define which paths require PIN protection
const protectedPaths = [
  "/",  // Dashboard
  "/inventaire", // Inventory
  "/finances",   // Finances 
  "/aide",       // Help
  "/compte"      // Account
];

// Not protected: /facturation (billing), /employes, /auth

const PinContext = createContext<PinContextType | undefined>(undefined);

export const PinContextProvider = ({ children }: PinContextProviderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [confirmationStep, setConfirmationStep] = useState(false);
  
  const [resolveAuth, setResolveAuth] = useState<(value: boolean) => void>(() => () => {});

  useEffect(() => {
    // Clear the authentication state for any previously authenticated pages
    const clearLastAuthenticatedTimeouts = () => {
      const authenticatedPages = JSON.parse(localStorage.getItem('pinAuthenticatedPages') || '{}');
      const now = new Date().getTime();
      
      // Filter out expired authentications (15 minutes)
      const updatedAuthenticated = Object.keys(authenticatedPages).reduce((acc: Record<string, number>, page) => {
        if (now - authenticatedPages[page] < 15 * 60 * 1000) { // 15 minutes
          acc[page] = authenticatedPages[page];
        }
        return acc;
      }, {});
      
      localStorage.setItem('pinAuthenticatedPages', JSON.stringify(updatedAuthenticated));
    };
    
    clearLastAuthenticatedTimeouts();
    const interval = setInterval(clearLastAuthenticatedTimeouts, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handlePinVerification = () => {
    const storedPin = localStorage.getItem(`page_pin_${currentPage}`);
    
    if (isSettingPin) {
      if (confirmationStep) {
        if (pin === confirmPin) {
          localStorage.setItem(`page_pin_${currentPage}`, pin);
          setIsDialogOpen(false);
          setIsSettingPin(false);
          setConfirmationStep(false);
          markPageAuthenticated(currentPage);
          toast({
            title: "PIN configuré avec succès",
            description: "Ce PIN sera requis pour accéder à cette page",
          });
          resolveAuth(true);
        } else {
          toast({
            title: "Les PINs ne correspondent pas",
            description: "Veuillez réessayer",
            variant: "destructive",
          });
          setConfirmPin("");
          setConfirmationStep(false);
        }
      } else {
        setConfirmationStep(true);
      }
    } else if (storedPin === pin) {
      setIsDialogOpen(false);
      markPageAuthenticated(currentPage);
      resolveAuth(true);
    } else {
      toast({
        title: "PIN incorrect",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
      setPin("");
    }
  };

  const markPageAuthenticated = (pageName: string) => {
    const authenticated = JSON.parse(localStorage.getItem('pinAuthenticatedPages') || '{}');
    authenticated[pageName] = new Date().getTime();
    localStorage.setItem('pinAuthenticatedPages', JSON.stringify(authenticated));
  };

  const isPageAuthenticated = (pageName: string): boolean => {
    const authenticated = JSON.parse(localStorage.getItem('pinAuthenticatedPages') || '{}');
    const lastAuth = authenticated[pageName];
    if (!lastAuth) return false;
    
    // Check if authentication is still valid (15 minutes)
    const now = new Date().getTime();
    return now - lastAuth < 15 * 60 * 1000; // 15 minutes
  };

  const verifyPin = async (pageName: string): Promise<boolean> => {
    // If the page is not in the protected paths list, allow access
    if (!protectedPaths.includes(pageName)) {
      return true;
    }
    
    // If the page is already authenticated, allow access
    if (isPageAuthenticated(pageName)) {
      return true;
    }
    
    setCurrentPage(pageName);
    setIsDialogOpen(true);
    setIsAuthenticating(true);
    
    // Check if PIN exists for this page
    const storedPin = localStorage.getItem(`page_pin_${pageName}`);
    if (!storedPin) {
      setIsSettingPin(true);
      setPin("");
      setConfirmPin("");
      setConfirmationStep(false);
    } else {
      setIsSettingPin(false);
      setPin("");
    }
    
    return new Promise<boolean>((resolve) => {
      setResolveAuth(() => resolve);
    }).finally(() => {
      setIsAuthenticating(false);
    });
  };

  return (
    <PinContext.Provider value={{ verifyPin, isAuthenticating }}>
      {children}
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resolveAuth(false);
          setIsDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-2">
              {isSettingPin ? (
                <>
                  <Shield className="h-6 w-6 text-primary" />
                  {confirmationStep 
                    ? "Confirmer votre PIN" 
                    : "Définir un PIN pour cette page"}
                </>
              ) : (
                <>
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  Entrer votre PIN
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            <InputOTP 
              maxLength={6} 
              value={confirmationStep ? confirmPin : pin} 
              onChange={confirmationStep ? setConfirmPin : setPin}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
            />
            
            <div className="flex justify-center gap-3 w-full">
              <Button 
                onClick={() => {
                  resolveAuth(false);
                  setIsDialogOpen(false);
                }}
                variant="outline"
                className="w-1/3"
              >
                Annuler
              </Button>
              <Button 
                onClick={handlePinVerification}
                disabled={(confirmationStep ? confirmPin.length !== 6 : pin.length !== 6)}
                className="w-2/3"
              >
                {isSettingPin
                  ? (confirmationStep ? "Confirmer" : "Continuer")
                  : "Vérifier"
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PinContext.Provider>
  );
};

export const usePinContext = () => {
  const context = useContext(PinContext);
  if (!context) {
    throw new Error("usePinContext must be used within a PinContextProvider");
  }
  return context;
};
