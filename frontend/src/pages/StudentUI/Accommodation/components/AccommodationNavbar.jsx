import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AccommodationNavbar = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

// Debug: Check what user data is being received
console.log('AccommodationNavbar - User data:', user);
console.log('User name:', user?.name);
console.log('User fname:', user?.fname);
console.log('User email:', user?.email);
console.log('User ID:', user?.id);
console.log('User _ID:', user?._id);


  const isActive = (path) => {
    return location.pathname === path;
  };

  // User data changes are handled automatically

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentUser');
    setUser(null);
    setIsUserMenuOpen(false);
    // Force redirect to login page
    window.location.href = '/login-std';
  };

  // Check if we're on the dashboard page for transparent navbar
  const isDashboard = location.pathname === '/student/accommodation';

  return (
    <nav className={`${isDashboard ? 'bg-white/5 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-sm'} sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/std-dash" className="flex items-center space-x-2 sm:space-x-3 group ml-2 sm:ml-0">
            <img 
              src="/src/pages/StudentUI/Accommodation/assets/unimatelogo.png" 
              alt="UniMate Logo" 
              className="h-6 sm:h-7 w-auto"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/120x40?text=UniMate";
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-6 xl:space-x-8">
            <Link
              to="/student/accommodation"
              className={`px-4 xl:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                isActive('/student/accommodation')
                  ? isDashboard 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg'
                  : isDashboard
                    ? 'text-white hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-xl'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80 rounded-xl'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 xl:w-5 h-4 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm xl:text-base">Dashboard</span>
              </div>
            </Link>

            <Link
              to="/student/accommodation/boarding-places"
              className={`px-4 xl:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                isActive('/student/accommodation/boarding-places')
                  ? isDashboard 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg'
                  : isDashboard
                    ? 'text-white hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-xl'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80 rounded-xl'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 xl:w-5 h-4 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm xl:text-base">Boarding Places</span>
              </div>
            </Link>

            <Link
              to="/student/accommodation/my-bookings"
              className={`px-4 xl:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                isActive('/student/accommodation/my-bookings')
                  ? isDashboard 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg'
                  : isDashboard
                    ? 'text-white hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-xl'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80 rounded-xl'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 xl:w-5 h-4 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-sm xl:text-base">My Bookings</span>
              </div>
            </Link>

            <Link
              to="/student/accommodation/services"
              className={`px-4 xl:px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                isActive('/student/accommodation/services')
                  ? isDashboard 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg'
                  : isDashboard
                    ? 'text-white hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-xl'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80 rounded-xl'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <span>Services</span>
              </div>
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isDashboard
                    ? 'text-white hover:bg-white/10 backdrop-blur-sm'
                    : 'text-gray-700 hover:bg-orange-50/80'
                }`}
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {(() => {
                      const name = user?.name || user?.fname || user?.email || 'Student';
                      return name.charAt(0).toUpperCase();
                    })()}
                  </span>
                </div>
                <span className="font-medium">
                  {user?.name || user?.fname || user?.email || 'Student'}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || user?.fname || user?.email || 'Student'}</p>
                    <p className="text-xs text-gray-500">{user?.email || user?.s_email || user?.email || 'student@example.com'}</p>
                  </div>
                  
                  <Link
                    to="/std-profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`focus:outline-none transition-all duration-300 rounded-xl p-2.5 ${
                isDashboard 
                  ? 'text-white/90 hover:text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:shadow-lg'
                  : 'text-gray-700 hover:text-orange-600 bg-gray-50/80 hover:bg-orange-50/80 hover:shadow-md'
              }`}
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 ${
              isDashboard 
                ? 'bg-white/5 backdrop-blur-xl'
                : 'bg-white/95 backdrop-blur-sm'
            }`}>
              <Link
                to="/student/accommodation"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  isActive('/student/accommodation')
                    ? isDashboard 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : isDashboard
                      ? 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </div>
              </Link>

              <Link
                to="/student/accommodation/boarding-places"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  isActive('/student/accommodation/boarding-places')
                    ? isDashboard 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : isDashboard
                      ? 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Boarding Places</span>
                </div>
              </Link>

              <Link
                to="/student/accommodation/my-bookings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  isActive('/student/accommodation/my-bookings')
                    ? isDashboard 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : isDashboard
                      ? 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>My Bookings</span>
                </div>
              </Link>

              <Link
                to="/student/accommodation/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  isActive('/student/accommodation/services')
                    ? isDashboard 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : isDashboard
                      ? 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/80'
                }`}
              >
              <div className="flex items-center space-x-2">
                <svg className="w-4 xl:w-5 h-4 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <span className="text-sm xl:text-base">Services</span>
              </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AccommodationNavbar;
