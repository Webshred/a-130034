
import { useState, useCallback } from 'react';
import { isPageAuthenticated, protectedPaths } from '@/utils/pin-utils';

export const usePinVerification = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [resolveAuth, setResolveAuth] = useState<(value: boolean) => void>(() => () => {});

  const verifyPin = useCallback(async (pageName: string): Promise<boolean> => {
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
  }, []);

  const cancelAuth = useCallback(() => {
    resolveAuth(false);
    setIsDialogOpen(false);
  }, [resolveAuth]);

  return {
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
  };
};
