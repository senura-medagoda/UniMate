import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHMAuth } from '@/context/HMAuthContext';

const ProtectedHMRoute = ({ children }) => {
  const { isAuthenticated, loading, hm } = useHMAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        console.log('ProtectedHMRoute: User not authenticated, redirecting to login');
        navigate('/hm/login');
        return;
      }
      
      // Allow access to dashboard even if not verified
      // Only job creation will be restricted
      console.log('ProtectedHMRoute: Hiring manager authenticated, status:', hm?.status);
    }
  }, [isAuthenticated, loading, hm, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return children;
};

export default ProtectedHMRoute;
