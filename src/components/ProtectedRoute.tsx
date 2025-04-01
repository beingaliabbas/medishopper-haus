
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyToken } from '@/api/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin-token');
      console.log('Checking authentication with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      // Use the verifyToken function to check if token exists
      const decodedToken = verifyToken(token);
      console.log('Token verification result:', decodedToken ? 'Valid' : 'Invalid');
      setIsAuthenticated(!!decodedToken);
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
