import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaStar, FaThumbsUp, FaThumbsDown, FaDownload, FaEye, FaExclamationTriangle } from "react-icons/fa";
import ComplaintForm from "./Components/ComplaintForm.jsx";

const BrowseDocument = () => {
  const [searchParams] = useSearchParams();
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
    <div className="max-w-6xl mx-auto mt-10 p-6">
      {/* Search Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Study Materials"}
        </h2>
        
        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <select
            value={filters.campus}
            onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
            className="border p-2 rounded"
          >
            <option value="">All Campuses</option>
            <option value="Malabe">Malabe</option>
            <option value="Kandy">Kandy</option>
            <option value="Matara">Matara</option>
            <option value="Jaffna">Jaffna</option>
          </select>
          
          <input
            type="text"
            placeholder="Course"
            value={filters.course}
            onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
            className="border p-2 rounded"
          />
          
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="border p-2 rounded"
          >
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
          
          <select
            value={filters.semester}
            onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
            className="border p-2 rounded"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          
          <input
            type="text"
            placeholder="Subject"
            value={filters.subject}
            onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading materials...</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No materials found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div key={material._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Material Preview */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-500 text-sm">{material.title}</p>
                </div>
              </div>
              
              {/* Material Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{material.description}</p>
                
                <div className="text-xs text-gray-500 mb-3">
                  <p>Campus: {material.campus}</p>
                  <p>Course: {material.course} | Year: {material.year} | Semester: {material.semester}</p>
                  <p>Subject: {material.subject}</p>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>👍 {material.likeCount || 0}</span>
                  <span>👎 {material.unlikeCount || 0}</span>
                  <span>⭐ {material.rating?.toFixed(1) || 0}</span>
                  <span>📥 {material.downloadCount || 0}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleLike(material._id)}
                    disabled={isLiked(material)}
                    className={`px-3 py-1 rounded text-xs ${
                      isLiked(material) 
                        ? 'bg-green-200 text-green-700 cursor-not-allowed' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    <FaThumbsUp className="inline mr-1" />
                    Like
                  </button>
                  
                  <button
                    onClick={() => handleUnlike(material._id)}
                    disabled={isUnliked(material)}
                    className={`px-3 py-1 rounded text-xs ${
                      isUnliked(material) 
                        ? 'bg-red-200 text-red-700 cursor-not-allowed' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    <FaThumbsDown className="inline mr-1" />
                    Unlike
                  </button>
                  
                  <button
                    onClick={() => setSelectedMaterial(material)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                  >
                    <FaStar className="inline mr-1" />
                    Rate
                  </button>
                  
                  {material.fileUrl && (
                    <button
                      onClick={() => handleDownload(material._id, material.fileUrl)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      <FaDownload className="inline mr-1" />
                      Download
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleComplaint(material)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    <FaExclamationTriangle className="inline mr-1" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default BrowseDocument;