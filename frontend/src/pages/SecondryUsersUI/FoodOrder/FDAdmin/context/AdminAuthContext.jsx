import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

const AdminAuthContext = createContext();

const API_BASE_URL = 'http://localhost:5001/api';

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const { error: toastError, success: toastSuccess } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('adminData');
    
    if (savedToken && savedAdmin) {
      try {
        setToken(savedToken);
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { admin: adminData, token: authToken } = data.data;
        
        // Save to localStorage
        localStorage.setItem('adminToken', authToken);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        
        // Update state
        setAdmin(adminData);
        setToken(authToken);
        
        toastSuccess('Login successful!');
        return { success: true };
      } else {
        toastError(data.message || 'Login failed. Please check your credentials.');
        return { success: false };
      }
    } catch (error) {
      console.error('Login error:', error);
      toastError('Login failed. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    // Clear state
    setAdmin(null);
    setToken(null);
    
    toastSuccess('Logged out successfully');
  };

  const updateAdmin = (updatedData) => {
    const updatedAdmin = { ...admin, ...updatedData };
    setAdmin(updatedAdmin);
    localStorage.setItem('adminData', JSON.stringify(updatedAdmin));
  };

  const isAuthenticated = () => {
    return !!admin && !!token;
  };

  const hasPermission = (permission) => {
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    return admin.permissions && admin.permissions.includes(permission);
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    updateAdmin,
    isAuthenticated,
    hasPermission
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};


