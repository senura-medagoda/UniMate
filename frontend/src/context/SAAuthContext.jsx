import React, { createContext, useContext, useState, useEffect } from 'react';

const SAAuthContext = createContext();

export const useSAAuth = () => {
  const context = useContext(SAAuthContext);
  if (!context) {
    throw new Error('useSAAuth must be used within a SAAuthProvider');
  }
  return context;
};

export const SAAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load authentication data from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('saToken');
    const savedSAData = localStorage.getItem('saData');
    
    if (savedToken && savedSAData) {
      try {
        const saData = JSON.parse(savedSAData);
        setUser({
          token: savedToken,
          ...saData
        });
      } catch (error) {
        console.error('Error parsing saved SA data:', error);
        // Clear invalid data
        localStorage.removeItem('saToken');
        localStorage.removeItem('saData');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5001/api/SystemAdmin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login API Response:', { status: response.status, data });

      if (response.ok && data.success) {
        const { token, sa } = data;
        console.log('Login successful, setting user data:', { token: token.substring(0, 20) + '...', sa });
        
        // Create user object
        const userData = {
          token: token,
          ...sa
        };
        
        // Save to localStorage first
        localStorage.setItem('saToken', token);
        localStorage.setItem('saData', JSON.stringify(sa));
        
        // Update state and wait for it to complete
        setUser(userData);
        
        // Ensure state is updated before returning
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('User state updated, returning success');
        return true;
      } else {
        console.log('Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('SA Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fallback login for backward compatibility (mock authentication)
  const fallbackLogin = async (email) => {
    const mockUser = {
      token: 'mock-token-' + Date.now(),
      id: 'mock-id',
      sa_fname: 'System',
      sa_lname: 'Admin',
      sa_email: email,
      sa_vstatus: 'Verified',
      isActive: true
    };
    
    // Save to localStorage first
    localStorage.setItem('saToken', mockUser.token);
    localStorage.setItem('saData', JSON.stringify(mockUser));
    
    // Update state and wait for it to complete
    setUser(mockUser);
    
    // Ensure state is updated before returning
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('saToken');
    localStorage.removeItem('saData');
    
    // Clear state
    setUser(null);
  };

  // Check if authenticated
  const isAuthenticated = () => {
    return !!(user && user.token);
  };

  // Make authenticated requests
  const makeAuthenticatedRequest = async (url, options = {}) => {
    if (!user || !user.token) {
      throw new Error('No authentication token available');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...options, ...defaultOptions });
    
    // If token is invalid, logout
    if (response.status === 401) {
      logout();
      throw new Error('Authentication expired. Please log in again.');
    }

    return response;
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    fallbackLogin,
    logout,
    isAuthenticated,
    makeAuthenticatedRequest,
  };

  return (
    <SAAuthContext.Provider value={value}>
      {children}
    </SAAuthContext.Provider>
  );
};
