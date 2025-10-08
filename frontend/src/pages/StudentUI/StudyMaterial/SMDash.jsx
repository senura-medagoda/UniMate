import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUpload, FaStar, FaComments, FaHandPaper, FaBook, FaUsers, FaChartLine, FaRegQuestionCircle } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const Home = ({ user, setUser }) => {
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
    <Navbar user={user} setUser={setUser}/>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                📚 Study Material Hub
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Welcome back,
              <span className="block text-orange-300">{user?.name || user?.fname || 'Student'}!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Your comprehensive platform for sharing and discovering study materials. 
              Connect with fellow students and enhance your learning journey.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
                <div className="relative bg-white rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-center">
                    <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Search for study materials, subjects, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-14 pr-6 py-4 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
                    />
                    <button 
                      onClick={handleSearch}
                      className="px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300 mb-2">{stats.totalMaterials}+</div>
                <div className="text-gray-200">Study Materials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300 mb-2">{stats.totalUsers}+</div>
                <div className="text-gray-200">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300 mb-2">{stats.totalDownloads}+</div>
                <div className="text-gray-200">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300 mb-2">{stats.totalLikes}+</div>
                <div className="text-gray-200">Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your study materials in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/Top_RecentSM" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-orange-300 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaStar className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Top Rated & Recent</h3>
                <p className="text-gray-600 mb-4">Discover the most popular and latest study materials</p>
                <div className="text-orange-600 font-semibold group-hover:text-orange-700">
                  Explore Now →
                </div>
              </div>
            </Link>

            <Link to="/UploadSM" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-blue-300 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaUpload className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Material</h3>
                <p className="text-gray-600 mb-4">Share your study materials with the community</p>
                <div className="text-blue-600 font-semibold group-hover:text-blue-700">
                  Start Uploading →
                </div>
              </div>
            </Link>

            <Link to="/RequestSM" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-green-300 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaHandPaper className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Request Material</h3>
                <p className="text-gray-600 mb-4">Request specific study materials you need</p>
                <div className="text-green-600 font-semibold group-hover:text-green-700">
                  Make Request →
                </div>
              </div>
            </Link>

            <Link to="/ForumSM" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-purple-300 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaComments className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Academic Forum</h3>
                <p className="text-gray-600 mb-4">Join discussions and ask questions</p>
                <div className="text-purple-600 font-semibold group-hover:text-purple-700">
                  Join Discussion →
                </div>
              </div>
            </Link>

            <Link to="/RequestedSM" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaRegQuestionCircle className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Requested Materials</h3>
                <p className="text-gray-600 mb-4">See others requests and help them with your knowledge</p>
                <div className="text-red-600 font-semibold group-hover:text-red-700">
                  Help Others →
                </div>
              </div>
            </Link>

            <Link to="/BrowseSM" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaSearch className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Materials</h3>
                <p className="text-gray-600 mb-4">Explore all available study materials</p>
                <div className="text-indigo-600 font-semibold group-hover:text-indigo-700">
                  Start Browsing →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Materials Section */}
      {recentMaterials.length > 0 && (
        <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Recently Added Materials
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the latest study materials shared by our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentMaterials.map((material, index) => (
                <div key={material._id || material.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <div className="h-48 bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10"></div>
                    <div className="text-center relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FaBook className="text-2xl text-white" />
                      </div>
                      <p className="text-orange-800 font-semibold text-lg">{material.subject}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">{material.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <span className="font-medium">By:</span>
                        <span className="ml-2">{material.uploadedBy || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Campus:</span>
                        <span className="ml-2">{material.campus} • {material.course}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Added:</span>
                        <span className="ml-2">{formatDate(material.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          👍 {material.likeCount || 0}
                        </span>
                        <span className="flex items-center">
                          📥 {material.downloadCount || 0}
                        </span>
                        <span className="flex items-center">
                          ⭐ {material.rating?.toFixed(1) || 0}
                        </span>
                      </div>
                    </div>
                    
                    <Link to={`/BrowseSM?search=${material.title}`}>
                      <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold group-hover:shadow-lg">
                        View Material
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/BrowseSM">
                <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                  View All Materials
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose UniMate?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of collaborative learning with our innovative platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaUsers className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Community Driven</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Join thousands of students sharing knowledge across multiple campuses. 
                Connect, collaborate, and learn together.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaChartLine className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Quality Content</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                All materials are reviewed and rated by the community. 
                Get access to high-quality, verified study resources.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaBook className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Easy Access</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Find exactly what you need with our powerful search and filter system. 
                Access materials anytime, anywhere.
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