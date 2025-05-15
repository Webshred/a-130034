
import React, { ReactNode, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePinContext } from '@/contexts/PinContext';
import { useLocation } from 'react-router-dom';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const isMobile = useIsMobile();
  const { verifyPin, isAuthenticating } = usePinContext();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      const authenticated = await verifyPin(location.pathname);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    
    checkAuthentication();
  }, [location.pathname, verifyPin]);
  
  if (isLoading || isAuthenticating) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <Navbar />
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <Navbar />
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
            <p className="text-gray-600">Veuillez entrer un PIN valide pour accéder à cette page</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <Navbar />
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className={`container mx-auto px-3 py-4 md:px-6 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
