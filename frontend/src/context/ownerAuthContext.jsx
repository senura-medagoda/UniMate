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
      const res = await axios.post("http://localhost:5001/api/owner/login", {
        email,
        password,
      });

      const { token, ownerId, fullName } = res.data;
      const ownerData = { ownerId, fullName };

      console.log("Login successful, token received:", token ? token.substring(0, 20) + "..." : "No token");

      setOwner(ownerData);
      setToken(token);
      localStorage.setItem("owner", JSON.stringify(ownerData));
      localStorage.setItem("token", token);

      toast.success("Login successful");
      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error("Login failed. Please check your credentials.");
      return false;
    }
  };

  const logout = () => {
    setOwner(null);
    setToken(null);
    localStorage.removeItem("owner");
    localStorage.removeItem("token");
  };

  return (
    <OwnerAuthContext.Provider value={{ owner, token, loginOwner, logout }}>
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = () => useContext(OwnerAuthContext);
