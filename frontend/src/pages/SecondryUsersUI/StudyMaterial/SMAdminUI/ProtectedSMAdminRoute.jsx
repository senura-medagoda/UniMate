// SM - Protected Study Material Admin Route
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedSMAdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('smAdminToken');
        const adminData = localStorage.getItem('smAdminData');

        if (!token || !adminData) {
          navigate('/SMAdminLogin', { replace: true });
          return;
        }

        // Verify token with backend
        const response = await fetch('http://localhost:5001/api/admin/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear storage and redirect
          localStorage.removeItem('smAdminToken');
          localStorage.removeItem('smAdminData');
          navigate('/SMAdminLogin', { replace: true });
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // On error, clear storage and redirect
        localStorage.removeItem('smAdminToken');
        localStorage.removeItem('smAdminData');
        navigate('/SMAdminLogin', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
};

export default ProtectedSMAdminRoute;
