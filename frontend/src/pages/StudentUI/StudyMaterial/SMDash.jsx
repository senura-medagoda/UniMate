import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUpload, FaStar, FaComments, FaHandPaper, FaBook, FaUsers, FaChartLine, FaRegQuestionCircle } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalLikes: 0
  });
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch dashboard stats and recent materials
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all materials to get stats
        const response = await fetch('http://localhost:5001/api/study-materials/all');
        const materials = await response.json();
        
        // Calculate stats
        const totalDownloads = materials.reduce((sum, material) => sum + (material.downloadCount || 0), 0);
        const totalLikes = materials.reduce((sum, material) => sum + (material.likeCount || 0), 0);
        
        setStats({
          totalMaterials: materials.length,
          totalUsers: 500, // Mock data for now
          totalDownloads,
          totalLikes
        });

        // Get recent materials (last 3)
        const recent = materials
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentMaterials(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback data if API fails
        setStats({
          totalMaterials: 1250,
          totalUsers: 500,
          totalDownloads: 8900,
          totalLikes: 4500
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/BrowseSM?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ 
          backgroundImage: "url('https://media.istockphoto.com/id/507009337/photo/students-helping-each-other.jpg?s=1024x1024&w=is&k=20&c=0mt9fTFb5QtPz36VhWvkmr8nnjSrwCq7JUCcHYorC9E=')",
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to UniMate
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Your comprehensive platform for sharing and discovering study materials
          </p>
          
          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <div className="relative max-w-2xl w-full">
              <input
                type="text"
                placeholder="Search for study materials, subjects, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-6 py-3 text-lg rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-0 top-0 px-8 py-4 bg-orange-600 text-white rounded-r-full hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center"
              >
                <FaSearch className="text-xl" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-400">{stats.totalMaterials}+</div>
              <div className="text-sm text-gray-300">Study Materials</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-400">{stats.totalUsers}+</div>
              <div className="text-sm text-gray-300">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-400">{stats.totalDownloads}+</div>
              <div className="text-sm text-gray-300">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-400">{stats.totalLikes}+</div>
              <div className="text-sm text-gray-300">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="py-8 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link to="/Top_RecentSM">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg">
                <FaStar className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Top Rated & Recent</h3>
                <p className="text-orange-100">Discover the most popular and latest study materials</p>
              </div>
            </Link>

            <Link to="/UploadSM">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg">
                <FaUpload className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Upload Material</h3>
                <p className="text-blue-100">Share your study materials with the community</p>
              </div>
            </Link>

            <Link to="/RequestSM">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg">
                <FaHandPaper className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Request Material</h3>
                <p className="text-green-100">Request specific study materials you need</p>
              </div>
            </Link>

            <Link to="/ForumSM">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg">
                <FaComments className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Academic Forum</h3>
                <p className="text-purple-100">Join discussions and ask questions</p>
              </div>
            </Link>
            <Link to="/RequestedSM">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg">
                <FaRegQuestionCircle className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Requested Materials</h3>
                <p className="text-purple-100">See others requests and help them with your knowledge</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Materials Section */}
      {recentMaterials.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Recently Added Materials
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentMaterials.map((material) => (
                <div key={material._id || material.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <div className="text-center">
                      <FaBook className="text-4xl text-orange-600 mx-auto mb-2" />
                      <p className="text-orange-800 font-medium">{material.subject}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{material.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{material.description}</p>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      <p>By {material.uploadedBy || "Anonymous"}</p>
                      <p>{material.campus} • {material.course}</p>
                      <p>Added {formatDate(material.createdAt)}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>👍 {material.likeCount || 0}</span>
                      <span>📥 {material.downloadCount || 0}</span>
                      <span>⭐ {material.rating?.toFixed(1) || 0}</span>
                    </div>
                    
                    <Link to={`/BrowseSM?search=${material.title}`}>
                      <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                        View Material
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/BrowseSM">
                <button className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-200">
                  View All Materials
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose UniMate?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Community Driven</h3>
              <p className="text-gray-600">
                Join thousands of students sharing knowledge across multiple campuses
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Quality Content</h3>
              <p className="text-gray-600">
                All materials are reviewed and rated by the community
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Easy Access</h3>
              <p className="text-gray-600">
                Find exactly what you need with our powerful search and filter system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default Home;