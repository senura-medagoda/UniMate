import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaCog, FaChartBar, FaBook } from "react-icons/fa";

const Navbar = () => {
    const [openProfile, setOpenProfile] = useState(false);
    const [user] = useState({
        name: "Student User",
        email: "student@example.com",
        profilePic: "https://via.placeholder.com/40"
    });
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log("Logging out...");
        setOpenProfile(false);
        navigate("/");
    };

    const toggleProfile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenProfile(!openProfile);
    };

    return (
        <div className="bg-orange-900 shadow-lg">
            <nav className="navbar flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="logo flex items-center">
                    <Link to="/StudyMaterialDash">
                        <img 
                            src="/Logo.png" 
                            alt="UniMate Logo" 
                            className="h-12 w-auto"
                        />
                    </Link>
                </div>

                {/* Navigation Links */}
                <ul className="nav-links flex items-center gap-8 text-white">
                    <li>
                        <Link 
                            to="/StudyMaterialDash" 
                            className="hover:text-orange-200 transition-colors duration-200 font-medium"
                        >
                            Study Materials
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/about" 
                            className="hover:text-orange-200 transition-colors duration-200 font-medium"
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/my-uploads" 
                            className="hover:text-orange-200 transition-colors duration-200 font-medium"
                        >
                            My Uploads
                        </Link>
                    </li>
                </ul>

                {/* Profile Section */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        className="flex items-center gap-3 cursor-pointer select-none focus:outline-none"
                        onClick={toggleProfile}
                        type="button"
                    >
                        <img
                            src={user.profilePic}
                            alt="Profile"
                            className="h-10 w-10 rounded-full border-2 border-white hover:border-orange-200 transition-colors duration-200"
                        />
                        <span className="text-white font-medium hidden md:block">
                            {user.name}
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {openProfile && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            
                            <Link
                                to="/profile"
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                                onClick={() => setOpenProfile(false)}
                            >
                                <FaUser className="mr-3 text-orange-600" />
                                My Profile
                            </Link>
                            
                            <Link
                                to="/my-uploads"
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                                onClick={() => setOpenProfile(false)}
                            >
                                <FaChartBar className="mr-3 text-orange-600" />
                                My Uploads
                            </Link>
                            
                            <Link
                                to="/my-requests"
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                                onClick={() => setOpenProfile(false)}
                            >
                                <FaBook className="mr-3 text-orange-600" />
                                My Requests
                            </Link>
                            
                            <div className="border-t border-gray-200 mt-2 pt-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <FaSignOutAlt className="mr-3" />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
