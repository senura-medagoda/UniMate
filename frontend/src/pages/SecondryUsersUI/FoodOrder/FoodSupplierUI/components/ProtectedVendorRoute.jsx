import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';

const ProtectedVendorRoute = ({ children }) => {
  const { vendor, loading } = useVendorAuth();
  const location = useLocation();

  console.log('ProtectedVendorRoute - vendor:', vendor, 'loading:', loading, 'location:', location.pathname);

  if (loading) {
    console.log('ProtectedVendorRoute - showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    console.log('ProtectedVendorRoute - no vendor, redirecting to main login');
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedVendorRoute - vendor authenticated, rendering children');
  return children;
};

export default ProtectedVendorRoute;
