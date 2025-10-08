import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaStar, FaThumbsUp, FaThumbsDown, FaDownload, FaEye, FaExclamationTriangle, FaSearch, FaFilter, FaBook, FaCalendar, FaUser, FaGraduationCap, FaArrowLeft } from "react-icons/fa";
import ComplaintForm from "./Components/ComplaintForm.jsx";
import Navbar from "./Components/Navbar.jsx";

const BrowseDocument = ({ user, setUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [filters, setFilters] = useState({
    campus: "",
    course: "",
    year: "",
    semester: "",
    subject: ""
  });
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintTarget, setComplaintTarget] = useState(null);

  const searchQuery = searchParams.get('search');

  // Fetch materials based on search query and filters
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5001/api/study-materials/search?';
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append('searchQuery', searchQuery);
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(url + params.toString());
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all materials if no search query
  const fetchAllMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/study-materials/all');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchMaterials();
    } else {
      fetchAllMaterials();
    }
  }, [searchQuery, filters]);

  const handleLike = async (materialId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/${materialId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'student123' }) // TODO: Replace with actual user ID
      });
      
      if (response.ok) {
        // Update the material in the list
        setMaterials(prev => prev.map(material => 
          material._id === materialId 
            ? { ...material, likeCount: material.likeCount + 1, likedBy: [...material.likedBy, 'student123'] }
            : material
        ));
      }
    } catch (error) {
      console.error('Error liking material:', error);
    }
  };

  const handleUnlike = async (materialId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/${materialId}/unlike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'student123' }) // TODO: Replace with actual user ID
      });
      
      if (response.ok) {
        // Update the material in the list
        setMaterials(prev => prev.map(material => 
          material._id === materialId 
            ? { ...material, unlikeCount: material.unlikeCount + 1, unlikedBy: [...material.unlikedBy, 'student123'] }
            : material
        ));
      }
    } catch (error) {
      console.error('Error unliking material:', error);
    }
  };

  const handleDownload = async (materialId, fileUrl) => {
    try {
      // Track download
      await fetch(`http://localhost:5001/api/study-materials/${materialId}/download`, {
        method: 'POST'
      });
      
      // Download the file
      const response = await fetch(`http://localhost:5001${fileUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedMaterial || !rating) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/${selectedMaterial._id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'student123', // TODO: Replace with actual user ID
          rating,
          review: feedback
        })
      });
      
      if (response.ok) {
        setFeedback("");
        setRating(0);
        setSelectedMaterial(null);
        // Refresh materials to show updated ratings
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const isLiked = (material) => material.likedBy?.includes('student123');
  const isUnliked = (material) => material.unlikedBy?.includes('student123');

  const handleComplaint = (material) => {
    setComplaintTarget({
      type: "material",
      id: material._id,
      name: material.title
    });
    setShowComplaintForm(true);
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Study Materials"}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover and explore study materials shared by our community
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-6">
              <FaFilter className="text-orange-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Materials</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filters.campus}
                  onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">All Campuses</option>
                  <option value="Malabe">Malabe</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Matara">Matara</option>
                  <option value="Jaffna">Jaffna</option>
                </select>
              </div>
              
              <div className="relative">
                <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Course"
                  value={filters.course}
                  onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filters.year}
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
              
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Subject"
                  value={filters.subject}
                  onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Materials Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading materials...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBook className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {materials.map((material) => (
                <div key={material._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  {/* Material Preview */}
                  <div className="h-48 bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10"></div>
                    <div className="text-center relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FaBook className="text-2xl text-white" />
                      </div>
                      <p className="text-orange-800 font-semibold text-lg">{material.subject}</p>
                    </div>
                  </div>
                  
                  {/* Material Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">{material.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <FaGraduationCap className="w-4 h-4 mr-2 text-orange-500" />
                        <span>{material.campus}</span>
                      </div>
                      <div className="flex items-center">
                        <FaBook className="w-4 h-4 mr-2 text-orange-500" />
                        <span>{material.course} • Year {material.year} • Sem {material.semester}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUser className="w-4 h-4 mr-2 text-orange-500" />
                        <span>By {material.uploadedBy || "Anonymous"}</span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          👍 {material.likeCount || 0}
                        </span>
                        <span className="flex items-center">
                          👎 {material.unlikeCount || 0}
                        </span>
                        <span className="flex items-center">
                          ⭐ {material.rating?.toFixed(1) || 0}
                        </span>
                        <span className="flex items-center">
                          📥 {material.downloadCount || 0}
                        </span>
                      </div>
                    </div>
                
                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleLike(material._id)}
                        disabled={isLiked(material)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isLiked(material) 
                            ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200' 
                            : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg'
                        }`}
                      >
                        <FaThumbsUp className="inline mr-2" />
                        Like
                      </button>
                      
                      <button
                        onClick={() => handleUnlike(material._id)}
                        disabled={isUnliked(material)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isUnliked(material) 
                            ? 'bg-red-100 text-red-700 cursor-not-allowed border border-red-200' 
                            : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg'
                        }`}
                      >
                        <FaThumbsDown className="inline mr-2" />
                        Unlike
                      </button>
                      
                      <button
                        onClick={() => setSelectedMaterial(material)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-medium hover:bg-yellow-600 hover:shadow-lg transition-all duration-200"
                      >
                        <FaStar className="inline mr-2" />
                        Rate
                      </button>
                      
                      {material.fileUrl && (
                        <button
                          onClick={() => handleDownload(material._id, material.fileUrl)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 hover:shadow-lg transition-all duration-200"
                        >
                          <FaDownload className="inline mr-2" />
                          Download
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleComplaint(material)}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 hover:shadow-lg transition-all duration-200"
                      >
                        <FaExclamationTriangle className="inline mr-2" />
                        Report
                      </button>
                    </div>
              </div>
            </div>
          ))}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Rate: {selectedMaterial.title}</h3>
            
            {/* Rating Stars */}
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Rating:</p>
              <div className="flex space-x-1">
                {[...Array(5)].map((star, index) => {
                  const currentRating = index + 1;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(currentRating)}
                      onMouseEnter={() => setHover(currentRating)}
                      onMouseLeave={() => setHover(null)}
                      className="focus:outline-none"
                    >
                      <FaStar
                        size={24}
                        className={
                          currentRating <= (hover || rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Feedback */}
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Review:</p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                placeholder="Write your review here..."
                rows="3"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleFeedbackSubmit}
                disabled={!rating}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                Submit Review
              </button>
              <button
                onClick={() => {
                  setSelectedMaterial(null);
                  setFeedback("");
                  setRating(0);
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Form */}
      <ComplaintForm
        isOpen={showComplaintForm}
        onClose={() => {
          setShowComplaintForm(false);
          setComplaintTarget(null);
        }}
        type={complaintTarget?.type || "material"}
        targetId={complaintTarget?.id}
        targetName={complaintTarget?.name}
      />
    </>
  );
};

export default BrowseDocument;