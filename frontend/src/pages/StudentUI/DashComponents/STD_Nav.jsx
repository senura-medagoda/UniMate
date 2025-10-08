import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function STD_Nav({ user, setUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentUser');
    setUser(null);
    navigate('/')
  }

  // Helper function to get user display name safely
  //const getUserDisplayName = () => {
   // if (!user) return 'Guest';
   // if (user.s_fname && user.s_lname) {
    //  return `${user.s_fname} ${user.s_lname}`;
   // }
    //if (user.s_fname) return user.s_fname;
    //if (user.s_lname) return user.s_lname;
    //return 'Student';
  //}

  // Sample notifications
  const notifications = [
    { id: 1, message: "Your job application was viewed", time: "2 hours ago", read: false },
    { id: 2, message: "New study materials available", time: "5 hours ago", read: true },
    { id: 3, message: "Food order delivered successfully", time: "Yesterday", read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/std-dash' },
    { name: 'Jobs', path: '/jobdash' },
    { name: 'Accommodation', path: '/student/accommodation' },
    { name: 'Food', path: '/food' },
    { name: 'Study Materials', path: '/StudyMaterialDash' },
    { name: 'Marketplace', path: '/M_home' }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/std-dash" className="flex items-center group">
              <img 
                src="/Logo.png" 
                alt="UniMate Logo" 
                className="h-8 w-auto lg:h-10 group-hover:scale-105 transition-transform duration-200"
              />
             
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-200 relative group ${
                  isActive(item.path) 
                    ? 'text-orange-600' 
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`} style={{backgroundColor: '#fc944c'}}></span>
          </Link>
            ))}
        </div>
        
          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
          {/* Notification Bell */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle relative">
              <div className="indicator">
                {unreadCount > 0 && (
                  <span className="indicator-item badge badge-primary badge-xs"></span>
                )}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
              </div>
            </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-72 mt-1 border border-gray-200">
              <li className="menu-title">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="badge badge-primary badge-sm">{unreadCount} new</span>
                )}
              </li>
              {notifications.map(notification => (
                <li key={notification.id}>
                    <a className={notification.read ? "" : "bg-orange-50"}>
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </a>
                </li>
              ))}
              <li>
                  <a className="text-center text-orange-600 hover:bg-orange-50">View all notifications</a>
              </li>
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring-2" style={{ringColor: '#fc944c'}}>
                <img src="https://placehold.co/400x400?text=S" alt="Student" />
              </div>
            </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-white rounded-box w-52 border border-gray-200">
              
                <li><Link to="/std-profile"><a className="hover:bg-orange-50">Profile</a></Link></li>
                <li><Link to="/settings"><a className="hover:bg-orange-50">Settings</a></Link></li>
                <li><a className="hover:bg-orange-50">Help & Support</a></li>
                <div className="divider my-1"></div>
                <li><a className="text-red-600 hover:bg-red-50" onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm rounded-lg mt-2 shadow-lg border border-gray-200/50">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <Link
              to="/std-profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            
            <a 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
            
            <a 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default STD_Nav;