
import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../context/context.jsx"; // ✅ Import fixed

const Navbar = () => {

  const { user, setUser, setshowUserLogin, navigate, cartItems } = useAppContext();
  const [open, setOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only show navbar when at the very top of the page or when scrolling up from top
      if (currentScrollY <= 10) {
        setIsVisible(true); // Always show when at top
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        setIsVisible(true); // Show when scrolling up near the top
      } else {
        setIsVisible(false); // Hide when scrolling down or far from top
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);


  const logout = () => {
    setUser(null); // Log the user out
    navigate("/"); // Navigate back to home
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-2 sm:py-3 md:py-4 lg:py-5 border-b border-white/20 bg-white/10 backdrop-blur-lg transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Logo */}
      <NavLink to="/food" className="flex-shrink-0">
        <img className="h-8 sm:h-9 md:h-10 lg:h-11 transition-all duration-300" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6">
        <NavLink to="/food" className="text-xs sm:text-sm lg:text-base font-medium text-white hover:text-orange-300 transition-colors">Home</NavLink>
        <NavLink to="/menu" className="text-xs sm:text-sm lg:text-base font-medium text-white hover:text-orange-300 transition-colors">Menu</NavLink>
        <NavLink to="/shops" className="text-xs sm:text-sm lg:text-base font-medium text-white hover:text-orange-300 transition-colors">Shops</NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center">
          {!searchExpanded ? (
            <button
              onClick={() => setSearchExpanded(true)}
              className="p-1.5 lg:p-2 text-white hover:text-orange-300 transition-colors"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center text-sm gap-2 border border-gray-300 px-2 lg:px-3 rounded-full min-w-0 flex-1 max-w-xs xl:max-w-sm bg-white">
              <input
                className="py-1 lg:py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-xs lg:text-sm"
                type="text"
                placeholder="Search Foods"
                autoFocus
              />
              <button
                onClick={() => setSearchExpanded(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer flex-shrink-0" onClick={() => navigate("/cart")}>

          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"

            className="text-white hover:text-orange-300 transition-colors w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="currentColor"

              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {getCartCount() > 0 && (
            <button className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 lg:-top-2 lg:-right-3 text-xs text-white bg-[#fc944c] w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full animate-pulse flex items-center justify-center">
              {getCartCount() > 99 ? '99+' : getCartCount()}
            </button>
          )}

        </div>

        {/* Login / Profile / Logout */}
        {!user ? (

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            <button
              onClick={() => setshowUserLogin(true)}
              className="cursor-pointer px-2 sm:px-3 lg:px-4 xl:px-6 py-1 sm:py-1.5 lg:py-2 border border-[#fc944c] text-[#fc944c] hover:bg-[#fc944c] hover:text-white transition rounded-full text-xs lg:text-sm font-medium"
            >
              Login
            </button>
            <NavLink
              to="/vendor/login"
              className="cursor-pointer px-2 sm:px-3 lg:px-4 xl:px-6 py-1 sm:py-1.5 lg:py-2 border border-[#fc944c] text-[#fc944c] hover:bg-[#fc944c] hover:text-white transition rounded-full text-xs lg:text-sm font-medium"
            >
              <span className="hidden lg:inline">Vendor Login</span>
              <span className="lg:hidden">Vendor</span>
            </NavLink>
          </div>
        ) : (
          <div className="relative group flex-shrink-0">
            <button className="flex items-center gap-1 lg:gap-2 text-white hover:text-orange-300 transition-colors">
              <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-[#fc944c] rounded-full flex items-center justify-center text-white font-semibold text-xs lg:text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden xl:block text-sm lg:text-base">{user.name || 'User'}</span>
              <svg className="w-3 h-3 lg:w-4 lg:h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <NavLink to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                  Profile
                </NavLink>
                <NavLink to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                  My Orders
                </NavLink>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>

        
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}

        className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}

        </svg>
      </button>

      {/* Mobile Menu */}
      {open && (

        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg border-t border-gray-200 py-3 sm:py-4 flex flex-col items-start gap-2 sm:gap-3 px-3 sm:px-4 text-sm md:hidden z-50">
          <NavLink to="/food" onClick={() => setOpen(false)} className="w-full px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors font-medium">
            Home
          </NavLink>
          <NavLink to="/menu" onClick={() => setOpen(false)} className="w-full px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors font-medium">
            Menu
          </NavLink>
          {user && (
            <NavLink to="/shops" onClick={() => setOpen(false)} className="w-full px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors font-medium">
              Shops
            </NavLink>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)} className="w-full px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors font-medium">
            Contact
          </NavLink>

          {/* Mobile Cart */}
          <div className="flex items-center gap-2 w-full py-3 border-t border-gray-200 mt-2">
            <span className="text-gray-600 font-medium">Cart:</span>
            <button 
              onClick={() => {
                setOpen(false);
                navigate("/cart");
              }}
              className="flex items-center gap-2 text-[#fc944c] hover:text-orange-600 transition-colors font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {getCartCount()} items
            </button>
          </div>

          {!user ? (
            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setshowUserLogin(true);
                }}
                className="cursor-pointer px-4 py-2.5 bg-[#fc944c] hover:bg-[#ffa669] transition text-white rounded-lg text-sm font-medium"
              >
                Login
              </button>
              <NavLink
                to="/vendor/login"
                onClick={() => setOpen(false)}
                className="cursor-pointer px-4 py-2.5 border border-[#fc944c] text-[#fc944c] hover:bg-[#fc944c] hover:text-white transition rounded-lg text-sm text-center font-medium"
              >
                Vendor Login
              </NavLink>
            </div>

          ) : (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}

              className="cursor-pointer px-4 py-2.5 mt-2 bg-[#fc944c] hover:bg-[#ffa669] transition text-white rounded-lg text-sm font-medium w-full"

            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
