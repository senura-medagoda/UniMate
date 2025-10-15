import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';

const JPAuthContext = createContext();

const API_BASE_URL = 'http://localhost:5001/api';

export const useJPAuth = () => {
  const context = useContext(JPAuthContext);
  if (!context) {
    throw new Error('useJPAuth must be used within a JPAuthProvider');
  }
  return context;
};

export const JPAuthProvider = ({ children }) => {
  const [jpAdmin, setJpAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const { error: toastError, success: toastSuccess } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('jpAdminToken');
    const savedJpAdmin = localStorage.getItem('jpAdminData');
    
    console.log('JPAuthContext - Loading from localStorage:');
    console.log('Saved token:', savedToken ? savedToken.substring(0, 20) + '...' : 'No token');
    console.log('Saved JP Admin data:', savedJpAdmin);
    
    if (savedToken && savedJpAdmin) {
      try {
        const parsedJpAdmin = JSON.parse(savedJpAdmin);
        console.log('Parsed JP Admin data:', parsedJpAdmin);
        console.log('Parsed JP Admin firstName:', parsedJpAdmin.firstName);
        
        setToken(savedToken);
        setJpAdmin(parsedJpAdmin);
      } catch (error) {
        console.error('Error parsing saved JP Admin data:', error);
        localStorage.removeItem('jpAdminToken');
        localStorage.removeItem('jpAdminData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('JP Admin Auth: Attempting login with:', { email, password: '***' });
      console.log('JP Admin Auth: API URL:', `${API_BASE_URL}/jpadmin/login`);
      
      const response = await fetch(`${API_BASE_URL}/jpadmin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jpa_email: email, 
          jpa_password: password 
        }),
      });

      console.log('JP Admin Auth: Response status:', response.status);

      const data = await response.json();
      console.log('JP Admin Auth: Response data:', data);

      if (data.success) {
        const { admin: jpAdminData, token: authToken } = data.data;

        console.log('JP Admin Auth: Login successful, token received:', authToken ? authToken.substring(0, 20) + "..." : "No token");
        console.log('JP Admin Auth: JP Admin data to store:', jpAdminData);
        console.log('JP Admin Auth: JP Admin firstName:', jpAdminData.firstName);

        setJpAdmin(jpAdminData);
        setToken(authToken);
        localStorage.setItem('jpAdminToken', authToken);
        localStorage.setItem('jpAdminData', JSON.stringify(jpAdminData));

        toastSuccess('Login successful!');
        return true;
      } else {
        toastError(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('JP Admin Auth: Login error:', error);
      toastError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setJpAdmin(null);
    setToken(null);
    localStorage.removeItem('jpAdminToken');
    localStorage.removeItem('jpAdminData');
    toastSuccess('Logged out successfully');
  };

  const clearStoredData = () => {
    localStorage.removeItem('jpAdminToken');
    localStorage.removeItem('jpAdminData');
    setJpAdmin(null);
    setToken(null);
  };

  const isAuthenticated = () => {
    return !!(token && jpAdmin);
  };

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    if (!token) {
      console.error('JPAuthContext: No authentication token available');
      throw new Error('No authentication token available');
    }

    console.log('JPAuthContext: Making authenticated request to:', url);
    console.log('JPAuthContext: Token available:', token ? 'Yes' : 'No');

    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    console.log('JPAuthContext: Response status:', response.status);

    if (response.status === 401) {
      // Token expired or invalid
      console.error('JPAuthContext: Authentication failed, logging out');
      logout();
      throw new Error('Authentication expired. Please login again.');
    }

    return response;
  }, [token, logout]);

  const value = {
    jpAdmin,
    token,
    loading,
    login,
    logout,
    clearStoredData,
    isAuthenticated,
    getAuthHeaders,
    makeAuthenticatedRequest
  };

  return (
    <JPAuthContext.Provider value={value}>
      {children}
    </JPAuthContext.Provider>
  );
};
