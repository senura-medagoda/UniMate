import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

const HMAuthContext = createContext();

const API_BASE_URL = 'http://localhost:5001/api';

export const useHMAuth = () => {
  const context = useContext(HMAuthContext);
  if (!context) {
    throw new Error('useHMAuth must be used within a HMAuthProvider');
  }
  return context;
};

export const HMAuthProvider = ({ children }) => {
  const [hm, setHm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const { error: toastError, success: toastSuccess } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('hmToken');
    const savedHm = localStorage.getItem('hmData');
    
    console.log('HMAuthContext - Loading from localStorage:');
    console.log('Saved token:', savedToken ? savedToken.substring(0, 20) + '...' : 'No token');
    console.log('Saved HM data:', savedHm);
    
    if (savedToken && savedHm) {
      try {
        const parsedHm = JSON.parse(savedHm);
        console.log('Parsed HM data:', parsedHm);
        console.log('Parsed HM firstName:', parsedHm.firstName);
        
        setToken(savedToken);
        setHm(parsedHm);
      } catch (error) {
        console.error('Error parsing saved HM data:', error);
        localStorage.removeItem('hmToken');
        localStorage.removeItem('hmData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('HM Auth: Attempting login with:', { email, password: '***' });
      console.log('HM Auth: API URL:', `${API_BASE_URL}/hm/login`);
      
      const response = await fetch(`${API_BASE_URL}/hm/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          hm_email: email, 
          hm_password: password 
        }),
      });

      console.log('HM Auth: Response status:', response.status);
      console.log('HM Auth: Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('HM Auth: Error response text:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.log('HM Auth: Parsed error data:', errorData);
          toastError(errorData.message || `Login failed with status ${response.status}`);
          return false;
        } catch (parseError) {
          console.log('HM Auth: Could not parse error response:', parseError);
          toastError(`Login failed with status ${response.status}: ${errorText}`);
          return false;
        }
      }

      const data = await response.json();
      console.log('HM Auth: Response data:', data);

      if (data.success) {
        const { hm: hmData, token: authToken } = data.data;

        console.log('HM Auth: Login successful, token received:', authToken ? authToken.substring(0, 20) + "..." : "No token");
        console.log('HM Auth: HM data to store:', hmData);
        console.log('HM Auth: HM firstName:', hmData.firstName);

        setHm(hmData);
        setToken(authToken);
        localStorage.setItem('hmToken', authToken);
        localStorage.setItem('hmData', JSON.stringify(hmData));

        toastSuccess('Login successful!');
        return true;
      } else {
        toastError(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('HM Auth: Login error:', error);
      toastError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setHm(null);
    setToken(null);
    localStorage.removeItem('hmToken');
    localStorage.removeItem('hmData');
    toastSuccess('Logged out successfully');
  };

  const clearStoredData = () => {
    localStorage.removeItem('hmToken');
    localStorage.removeItem('hmData');
    setHm(null);
    setToken(null);
  };

  const isAuthenticated = () => {
    return !!(token && hm);
  };

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expired or invalid
      logout();
      throw new Error('Authentication expired. Please login again.');
    }

    return response;
  };

  const value = {
    hm,
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
    <HMAuthContext.Provider value={value}>
      {children}
    </HMAuthContext.Provider>
  );
};
