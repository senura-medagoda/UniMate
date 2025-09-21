import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Admin_Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove admin token
    localStorage.removeItem("adminToken");
    
    // Show success message
    toast.success("Logged out successfully!");
    
    // Small delay to show the toast before navigation
    setTimeout(() => {
      // Redirect to login page
      navigate("/A_login");
      
      // Force page reload to clear any cached state
      window.location.reload();
    }, 500);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 lg:px-8 h-16">
        {/* Logo */}
        <img
          className="h-20 w-auto"
          src={assets?.admin_uni}
          alt="UniMate Admin"
        />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center gap-2"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Admin_Navbar;