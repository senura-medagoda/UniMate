import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const ProtectedAdminRoute = ({ children, requiredPermission = null }) => {
  const { isAuthenticated, hasPermission, loading } = useAdminAuth();
  const location = useLocation();

  console.log('ProtectedAdminRoute - requiredPermission:', requiredPermission);
  console.log('ProtectedAdminRoute - loading:', loading);
  console.log('ProtectedAdminRoute - isAuthenticated:', isAuthenticated());

  if (loading) {
    console.log('ProtectedAdminRoute - showing loading');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    console.log('ProtectedAdminRoute - not authenticated, redirecting to login');
    return <Navigate to="/food/admin/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log('ProtectedAdminRoute - no permission for:', requiredPermission);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedAdminRoute - rendering children');
  return children;
};

export default ProtectedAdminRoute;


