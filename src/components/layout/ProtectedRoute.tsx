
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Simplified version that doesn't check for authentication
  return <>{children}</>;
};

export default ProtectedRoute;
