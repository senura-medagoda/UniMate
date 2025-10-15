import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const OwnerAuthContext = createContext();

export const OwnerAuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    console.log("Initializing token from localStorage:", savedToken ? savedToken.substring(0, 20) + "..." : "No token");
    return savedToken || null;
  });

  useEffect(() => {
    const savedOwner = localStorage.getItem("owner");
    if (savedOwner) {
      const parsedOwner = JSON.parse(savedOwner);
      console.log("Initializing owner from localStorage:", parsedOwner);
      setOwner(parsedOwner);
    }
  }, []);

  const loginOwner = async (email, password) => {
    try {
      console.log("ownerAuthContext: Attempting login with email:", email);
      console.log("ownerAuthContext: API URL:", "http://localhost:5001/api/owner/login");
      
      const res = await axios.post("http://localhost:5001/api/owner/login", {
        email,
        password,
      });

      console.log("ownerAuthContext: API response:", res.data);

      const { token, ownerId, fullName, status } = res.data;
      
      const ownerData = { ownerId, fullName, status: status || 'active' };

      console.log("ownerAuthContext: Login successful, token received:", token ? token.substring(0, 20) + "..." : "No token");
      console.log("ownerAuthContext: Owner status:", status);

      setOwner(ownerData);
      setToken(token);
      localStorage.setItem("owner", JSON.stringify(ownerData));
      localStorage.setItem("token", token);

      toast.success("Login successful");
      return true;
    } catch (err) {
      console.error("ownerAuthContext: Login error:", err.response?.data || err.message);
      console.error("ownerAuthContext: Full error:", err);
      
      // Handle specific error messages from backend
      if (err.response?.status === 403) {
        const errorMessage = err.response?.data?.message || "Access denied";
        const status = err.response?.data?.status;
        
        // For pending users, we need to get the owner data from the login attempt
        if (status === 'pending') {
          try {
            // Try to get owner data by email for pending users
            const ownerRes = await axios.get(`http://localhost:5001/api/owner/find-by-email/${email}`);
            if (ownerRes.data) {
              const ownerData = { 
                ownerId: ownerRes.data._id, 
                fullName: ownerRes.data.fullName, 
                status: 'pending' 
              };
              setOwner(ownerData);
              localStorage.setItem("owner", JSON.stringify(ownerData));
            }
          } catch (findError) {
            console.error("Could not find owner data:", findError);
          }
        }
        
        toast.error(errorMessage);
        
        // Return status information for the component to handle navigation
        return { success: false, status: status, message: errorMessage };
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
      
      return { success: false, status: null, message: "Login failed" };
    }
  };

  const logout = () => {
    setOwner(null);
    setToken(null);
    localStorage.removeItem("owner");
    localStorage.removeItem("token");
  };

  const getOwnerByEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/owner/find-by-email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error getting owner by email:', error);
      return null;
    }
  };

  return (
    <OwnerAuthContext.Provider value={{ owner, token, loginOwner, logout, getOwnerByEmail }}>
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = () => useContext(OwnerAuthContext);
