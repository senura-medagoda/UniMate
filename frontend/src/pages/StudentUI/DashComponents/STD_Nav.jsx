import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function STD_Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sample notifications
  const notifications = [
    { id: 1, message: "Your job application was viewed", time: "2 hours ago", read: false },
    { id: 2, message: "New study materials available", time: "5 hours ago", read: true },
    { id: 3, message: "Food order delivered successfully", time: "Yesterday", read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar mx-auto max-w-6xl p-4">
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
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
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            {isMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li><Link to="/std-dash"><a>Dashboard</a></Link></li>
                <li><Link to="/jobs"><a>Jobs</a></Link></li>
                <li><Link to="/accommodation"><a>Accommodation</a></Link></li>
                <li><Link to="/food"><a>Food</a></Link></li>
                <li><Link to="/study"><a>Study Materials</a></Link></li>
                <li><Link to="/marketplace"><a>Marketplace</a></Link></li>
                <li><Link to="/profile"><a>Profile</a></Link></li>
              </ul>
            )}
          </div>
          <Link to="/std-dash" className="btn btn-ghost normal-case text-xl text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
            </svg>
            Unimate
          </Link>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/std-dash"><a className="font-medium">Dashboard</a></Link></li>
            <li><Link to="/jobs"><a className="font-medium">Jobs</a></Link></li>
            <li><Link to="/accommodation"><a className="font-medium">Accommodation</a></Link></li>
            <li><Link to="/food"><a className="font-medium">Food</a></Link></li>
            <li>
              <details>
                <summary className="font-medium">More</summary>
                <ul className="p-2 bg-base-100">
                  <li><Link to="/study"><a>Study Materials</a></Link></li>
                  <li><Link to="/marketplace"><a>Marketplace</a></Link></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        
        <div className="navbar-end">
          {/* Notification Bell */}
          <div className="dropdown dropdown-end mr-2">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
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
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72 mt-1">
              <li className="menu-title">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="badge badge-primary badge-sm">{unreadCount} new</span>
                )}
              </li>
              {notifications.map(notification => (
                <li key={notification.id}>
                  <a className={notification.read ? "" : "active"}>
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </a>
                </li>
              ))}
              <li>
                <a className="text-center text-primary">View all notifications</a>
              </li>
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://placehold.co/400x400?text=S" alt="Student" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>Emily Johnson</span>
              </li>
              <li><Link to="/profile"><a>Profile</a></Link></li>
              <li><Link to="/settings"><a>Settings</a></Link></li>
              <li><a>Help & Support</a></li>
              <li className="divider mt-0 mb-0"></li>
              <li><a className="text-error">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default STD_Nav;