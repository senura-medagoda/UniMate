import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';

const VendorNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { vendor, logout } = useVendorAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/vendor/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
        
          <div className="flex items-center">
            <Link to="/vendor/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Vendor Portal</span>
            </Link>
          </div>

       
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/vendor/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/vendor/dashboard')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              Dashboard
            </Link>
            
            <Link
              to="/vendor/shop-details"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/vendor/shop-details')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              Shop Details
            </Link>
            
            <Link
              to="/vendor/menu-management"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/vendor/menu-management')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              Menu Management
            </Link>

          
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{vendor?.businessName}</span>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-medium text-sm">
                    {vendor?.businessName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

      
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

   
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              to="/vendor/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/vendor/dashboard')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            <Link
              to="/vendor/shop-details"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/vendor/shop-details')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop Details
            </Link>
            
            <Link
              to="/vendor/menu"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/vendor/menu')
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu Management
            </Link>

            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-medium text-sm">
                    {vendor?.businessName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{vendor?.businessName}</div>
                  <div className="text-sm font-medium text-gray-500">{vendor?.email}</div>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default VendorNavbar;

