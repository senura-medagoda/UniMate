import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaCog, FaChartBar, FaBook, FaSearch, FaBars, FaTimes, FaHome, FaUpload, FaHandPaper, FaComments, FaQuestionCircle, FaStar } from "react-icons/fa";

const Navbar = ({ user, setUser }) => {
    const [openProfile, setOpenProfile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
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
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentUser');
        setUser(null);
        navigate('/');
        setOpenProfile(false);
    };

    const toggleProfile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenProfile(!openProfile);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/BrowseSM?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto pr-4 sm:pr-6 lg:pr-8">
                <div className="flex items-center h-20">
                    {/* Logo - Left aligned */}
                    <div className="flex-shrink-0 pl-4 sm:pl-6 lg:pl-8">
                        <Link to="/std-dash" className="flex items-center">
                            <img 
                                src="/Logo.png" 
                                alt="UniMate Logo" 
                                className="h-12 w-auto"
                            />
                           
                        </Link>
                    </div>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden md:flex items-center space-x-10 flex-1 justify-center">
                        <Link 
                            to="/StudyMaterialDash" 
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive('/StudyMaterialDash') 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaHome className="inline mr-2" />
                            Dashboard
                        </Link>
                        <Link 
                            to="/BrowseSM" 
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive('/BrowseSM') 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaSearch className="inline mr-2" />
                            Browse
                        </Link>
                        <Link 
                            to="/UploadSM" 
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive('/UploadSM') 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaUpload className="inline mr-2" />
                            Upload
                        </Link>
                        <Link 
                            to="/RequestSM" 
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive('/RequestSM') 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaHandPaper className="inline mr-2" />
                            Request
                        </Link>
                        <Link 
                            to="/ForumSM" 
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive('/ForumSM') 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaComments className="inline mr-2" />
                            Forum
                        </Link>
                    </div>

                    {/* Right Section - Search and Profile */}
                    <div className="flex items-center space-x-6">
                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search materials..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Profile Section */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onClick={toggleProfile}
                                type="button"
                            >
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {(user?.name || user?.fname || 'S').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="hidden md:block text-gray-700 font-medium">
                                    {user?.name || user?.fname || 'Student'}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {openProfile && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                                        <p className="text-sm font-semibold text-gray-900">{user?.name || user?.fname || 'Student'}</p>
                                        <p className="text-xs text-gray-500">{user?.email || user?.s_email || 'student@example.com'}</p>
                                    </div>
                                    
                                    <Link
                                        to="/std-profile"
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
                                        <FaUpload className="mr-3 text-orange-600" />
                                        My Uploads
                                    </Link>
                                    
                                    <Link
                                        to="/my-requests"
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                                        onClick={() => setOpenProfile(false)}
                                    >
                                        <FaHandPaper className="mr-3 text-orange-600" />
                                        My Requests
                                    </Link>

                                    <Link
                                        to="/Top_RecentSM"
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                                        onClick={() => setOpenProfile(false)}
                                    >
                                        <FaStar className="mr-3 text-orange-600" />
                                        Top & Recent
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

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-3 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                        >
                            {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
                            <Link 
                                to="/StudyMaterialDash" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaHome className="inline mr-2" />
                                Dashboard
                            </Link>
                            <Link 
                                to="/BrowseSM" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaSearch className="inline mr-2" />
                                Browse
                            </Link>
                            <Link 
                                to="/UploadSM" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaUpload className="inline mr-2" />
                                Upload
                            </Link>
                            <Link 
                                to="/RequestSM" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaHandPaper className="inline mr-2" />
                                Request
                            </Link>
                            <Link 
                                to="/ForumSM" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaComments className="inline mr-2" />
                                Forum
                            </Link>
                            
                            {/* Mobile Search */}
                            <div className="px-3 py-2">
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search materials..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;