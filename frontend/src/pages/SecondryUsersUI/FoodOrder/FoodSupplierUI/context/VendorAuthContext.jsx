import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

const VendorAuthContext = createContext();


const API_BASE_URL = 'http://localhost:5001/api';

export const useVendorAuth = () => {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
};

export const VendorAuthProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const { error: toastError, success: toastSuccess } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('vendorToken');
    const savedVendor = localStorage.getItem('vendorData');
    
    if (savedToken && savedVendor) {
      try {
        setToken(savedToken);
        setVendor(JSON.parse(savedVendor));
      } catch (error) {
        console.error('Error parsing saved vendor data:', error);
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('Attempting login with:', { email, password: '***' });
      console.log('API URL:', `${API_BASE_URL}/vendor/login`);
      
      const response = await fetch(`${API_BASE_URL}/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        const { vendor: vendorData, token: authToken } = data.data;
        
        // Save to localStorage
        localStorage.setItem('vendorToken', authToken);
        localStorage.setItem('vendorData', JSON.stringify(vendorData));
        
     
        setVendor(vendorData);
        setToken(authToken);
        
        console.log('Login successful, vendor data:', vendorData);
        return { success: true };
      } else {
        console.log('Login failed:', data.message);
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

  const register = async (vendorData) => {
    try {
      setLoading(true);
      
      // Prepare data for API
      const registrationData = {
        businessName: vendorData.businessName || "",
        ownerName: vendorData.ownerName,
        email: vendorData.email,
        phone: vendorData.phone,
        password: vendorData.password,
        businessLicense: vendorData.businessLicense || "",
        address: vendorData.address
      };

      const response = await fetch(`${API_BASE_URL}/vendor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (data.success) {
        const { vendor: newVendor, token: authToken } = data.data;
        
        // Save to localStorage
        localStorage.setItem('vendorToken', authToken);
        localStorage.setItem('vendorData', JSON.stringify(newVendor));
        
        // Update state
        setVendor(newVendor);
        setToken(authToken);
        
        toastSuccess('Registration successful!');
        return { success: true };
      } else {
        toastError(data.message || 'Registration failed. Please try again.');
        return { success: false };
      }
    } catch (error) {
      console.error('Registration error:', error);
      toastError('Registration failed. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    
    // Clear notification flags
    localStorage.removeItem('welcomeNotificationShown');
    localStorage.removeItem('shopNotificationShown');
    
    // Clear state
    setVendor(null);
    setToken(null);
    
    toastSuccess('Logged out successfully');
  };

  const updateVendor = (updatedData) => {
    const updatedVendor = { ...vendor, ...updatedData };
    setVendor(updatedVendor);
    localStorage.setItem('vendorData', JSON.stringify(updatedVendor));
  };

  const refreshVendorData = async () => {
    try {
      const token = localStorage.getItem('vendorToken');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/vendor/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedVendor = data.data;
          setVendor(updatedVendor);
          localStorage.setItem('vendorData', JSON.stringify(updatedVendor));
          return updatedVendor;
        }
      }
    } catch (error) {
      console.error('Error refreshing vendor data:', error);
    }
    return null;
  };

  const isAuthenticated = () => {
    return !!vendor && !!token;
  };

  // Function to refresh menu data globally
  const refreshMenuData = () => {
    
    if (window.refreshDashboardMenu) {
      window.refreshDashboardMenu();
    }
  };

  const value = {
    vendor,
    token,
    loading,
    login,
    register,
    logout,
    updateVendor,
    refreshVendorData,
    isAuthenticated,
    refreshMenuData
  };

  return (
    <VendorAuthContext.Provider value={value}>
      {children}
    </VendorAuthContext.Provider>
  );
};
