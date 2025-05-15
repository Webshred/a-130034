
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePinVerification } from '@/hooks/use-pin-verification';
import PinDialog from '@/components/pin/PinDialog';
import { clearExpiredAuthentications } from '@/utils/pin-utils';

interface PinContextType {
  verifyPin: (pageName: string) => Promise<boolean>;
  isAuthenticating: boolean;
}

interface PinContextProviderProps {
  children: ReactNode;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const PinContextProvider = ({ children }: PinContextProviderProps) => {
  const {
    verifyPin,
    isAuthenticating,
    isDialogOpen,
    setIsDialogOpen,
    currentPage,
    pin,
    setPin,
    isSettingPin,
    confirmPin,
    setConfirmPin,
    confirmationStep,
    setConfirmationStep,
    resolveAuth,
    cancelAuth
  } = usePinVerification();

  useEffect(() => {
    // Clear expired authentication entries periodically
    clearExpiredAuthentications();
    const interval = setInterval(clearExpiredAuthentications, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <PinContext.Provider value={{ verifyPin, isAuthenticating }}>
      {children}
      
      <PinDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        pin={pin}
        confirmPin={confirmPin}
        isSettingPin={isSettingPin}
        confirmationStep={confirmationStep}
        currentPage={currentPage}
        onCancel={cancelAuth}
        onPinChange={setPin}
        onConfirmPinChange={setConfirmPin}
        resolveAuth={resolveAuth}
      />
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
