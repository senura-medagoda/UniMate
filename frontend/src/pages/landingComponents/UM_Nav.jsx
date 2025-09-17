// components/UM_Nav.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const UM_Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo and Mobile Menu Button */}
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
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
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h8m-8 6h16"}
                />
              </svg>
            </label>
            {/* Mobile Menu Dropdown */}
            <ul
              tabIndex={0}
              className={`menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 ${isMenuOpen ? 'block' : 'hidden'}`}
            >
              {/* Added Home Link */}
              <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link></li>
              <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
              <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
              <hr className="my-2" />
              <li><Link to="/login" onClick={() => setIsMenuOpen(false)} className="font-semibold justify-center">Login</Link></li>
              <li><Link to="/join" onClick={() => setIsMenuOpen(false)} className="btn btn-primary btn-sm text-white mt-2 justify-center">Register</Link></li>
            </ul>
          </div>
          {/* Website Logo - Links to Homepage */}
          <Link to="/" className="btn btn-ghost normal-case text-xl text-primary">
            UniMate
          </Link>
        </div>

        {/* Desktop Menu Items (Center) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            {/* Added Home Link */}
            <li><Link to="/" className="font-medium hover:text-primary">Home</Link></li>
            <li><Link to="/services" className="font-medium hover:text-primary">Services</Link></li>
            <li><Link to="/about" className="font-medium hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="font-medium hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        {/* Desktop Login/Register Buttons (End) */}
        <div className="navbar-end hidden lg:flex space-x-2">
          <Link to="/login" className="btn btn-ghost font-medium">Login</Link>
          <Link to="/stdregister" className="btn btn-primary text-white">Register</Link>
        </div>

        {/* Mobile: Show simple Login button if menu is not open */}
        <div className="navbar-end lg:hidden">
          {!isMenuOpen && (
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UM_Nav;