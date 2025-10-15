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
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-20 min-w-0">
                    {/* Logo - Left aligned with image, no left margin */}
                    <div className="flex-shrink-0">
                        <Link to="/std-dash" className="flex items-center space-x-3">
                            <img 
                                src="/src/pages/StudentUI/Accommodation/assets/unimatelogo.png" 
                                alt="UniMate Logo" 
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation - With proper spacing from logo */}
                    <div className="hidden md:flex items-center space-x-6 ml-8 flex-shrink min-w-0">
                        <Link 
                            to="/StudyMaterialDash" 
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive('/StudyMaterialDash') 
                                    ? 'bg-orange-100 text-orange-700 shadow-sm' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaHome className="mr-2" />
                            Dashboard
                        </Link>
                        <Link 
                            to="/BrowseSM" 
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive('/BrowseSM') 
                                    ? 'bg-orange-100 text-orange-700 shadow-sm' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaSearch className="mr-2" />
                            Browse
                        </Link>
                        <Link 
                            to="/UploadSM" 
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive('/UploadSM') 
                                    ? 'bg-orange-100 text-orange-700 shadow-sm' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaUpload className="mr-2" />
                            Upload
                        </Link>
                        <Link 
                            to="/RequestSM" 
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive('/RequestSM') 
                                    ? 'bg-orange-100 text-orange-700 shadow-sm' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaHandPaper className="mr-2" />
                            Request
                        </Link>
                        <Link 
                            to="/ForumSM" 
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive('/ForumSM') 
                                    ? 'bg-orange-100 text-orange-700 shadow-sm' 
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            <FaComments className="mr-2" />
                            Forum
                        </Link>
                    </div>

                    {/* Right Section - Search and Profile */}
                    <div className="flex items-center space-x-3 ml-auto pr-4 flex-shrink-0">
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
                                        className="w-56 lg:w-60 xl:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors duration-200"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Profile Section */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                className="flex items-center space-x-2 text-sm rounded-lg px-2 py-2 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                                onClick={toggleProfile}
                                type="button"
                            >
                                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
                                    <span className="text-white font-semibold text-sm">
                                        {(user?.name || user?.fname || 'S').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="hidden lg:block text-gray-700 font-medium text-sm max-w-24 truncate">
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

                                    <Link
                                        to="/StudentMessaging"
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                                        onClick={() => setOpenProfile(false)}
                                    >
                                        <FaQuestionCircle className="mr-3 text-orange-600" />
                                        Contact Admin
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
                            className="md:hidden p-3 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                        >
                            {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-4 pt-4 pb-4 space-y-2 bg-gray-50 rounded-lg mt-2 mx-2">
                            <Link 
                                to="/StudyMaterialDash" 
                                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaHome className="mr-3" />
                                Dashboard
                            </Link>
                            <Link 
                                to="/BrowseSM" 
                                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaSearch className="mr-3" />
                                Browse
                            </Link>
                            <Link 
                                to="/UploadSM" 
                                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaUpload className="mr-3" />
                                Upload
                            </Link>
                            <Link 
                                to="/RequestSM" 
                                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaHandPaper className="mr-3" />
                                Request
                            </Link>
                            <Link 
                                to="/ForumSM" 
                                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaComments className="mr-3" />
                                Forum
                            </Link>
                            
                            {/* Mobile Search */}
                            <div className="px-4 py-3">
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search materials..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
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