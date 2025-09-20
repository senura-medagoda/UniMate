import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaStar, FaDownload, FaCalendar } from "react-icons/fa";

const MaterialsPage = () => {
  const [view, setView] = useState("top"); // default: top rated
  const [topMaterials, setTopMaterials] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    campus: "",
    course: "",
    year: "",
    semester: "",
    subject: ""
  });

  // Fetch top materials
  const fetchTopMaterials = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5001/api/study-materials/top?';
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(url + params.toString());
      const data = await response.json();
      setTopMaterials(data);
    } catch (error) {
      console.error('Error fetching top materials:', error);
      // Fallback data
      setTopMaterials([
        { id: 3, title: "Algorithms Book", uploadedBy: "Student C", likeCount: 25, unlikeCount: 2, downloadCount: 150, rating: 4.8, campus: "Malabe", course: "Computer Science", year: "3", semester: "2", subject: "Algorithms", description: "Comprehensive algorithms guide", createdAt: new Date().toISOString() },
        { id: 4, title: "Chemistry Guide", uploadedBy: "Student D", likeCount: 18, unlikeCount: 1, downloadCount: 120, rating: 4.6, campus: "Kandy", course: "Engineering", year: "2", semester: "1", subject: "Chemistry", description: "Complete chemistry reference", createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent materials
  const fetchRecentMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/study-materials/all');
      const data = await response.json();
      // Sort by creation date (most recent first)
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentMaterials(sortedData);
    } catch (error) {
      console.error('Error fetching recent materials:', error);
      // Fallback data
      setRecentMaterials([
        { id: 1, title: "Math Notes", uploadedBy: "Student A", likeCount: 12, unlikeCount: 0, downloadCount: 80, rating: 4.2, campus: "Malabe", course: "IT", year: "1", semester: "1", subject: "Mathematics", description: "Calculus and algebra notes", createdAt: new Date().toISOString() },
        { id: 2, title: "Physics PDF", uploadedBy: "Student B", likeCount: 5, unlikeCount: 1, downloadCount: 45, rating: 3.8, campus: "Matara", course: "Physics", year: "2", semester: "2", subject: "Physics", description: "Modern physics concepts", createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "top") {
      fetchTopMaterials();
    } else {
      fetchRecentMaterials();
    }
  }, [view, filters]);

  const handleLike = async (materialId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/${materialId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'student123' }) // TODO: Replace with actual user ID
      });
      
      if (response.ok) {
        // Update the material in the appropriate list
        if (view === "top") {
          setTopMaterials(prev => prev.map(material => 
            (material._id === materialId || material.id === materialId)
              ? { ...material, likeCount: (material.likeCount || 0) + 1 }
              : material
          ));
        } else {
          setRecentMaterials(prev => prev.map(material => 
            (material._id === materialId || material.id === materialId)
              ? { ...material, likeCount: (material.likeCount || 0) + 1 }
              : material
          ));
        }
      }
    } catch (error) {
      console.error('Error liking material:', error);
      // Fallback: update local state
      if (view === "top") {
        setTopMaterials(prev => prev.map(material => 
          (material._id === materialId || material.id === materialId)
            ? { ...material, likeCount: (material.likeCount || 0) + 1 }
            : material
        ));
      } else {
        setRecentMaterials(prev => prev.map(material => 
          (material._id === materialId || material.id === materialId)
            ? { ...material, likeCount: (material.likeCount || 0) + 1 }
            : material
        ));
      }
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
        // Update the material in the appropriate list
        if (view === "top") {
          setTopMaterials(prev => prev.map(material => 
            (material._id === materialId || material.id === materialId)
              ? { ...material, unlikeCount: (material.unlikeCount || 0) + 1 }
              : material
          ));
        } else {
          setRecentMaterials(prev => prev.map(material => 
            (material._id === materialId || material.id === materialId)
              ? { ...material, unlikeCount: (material.unlikeCount || 0) + 1 }
              : material
          ));
        }
      }
    } catch (error) {
      console.error('Error unliking material:', error);
      // Fallback: update local state
      if (view === "top") {
        setTopMaterials(prev => prev.map(material => 
          (material._id === materialId || material.id === materialId)
            ? { ...material, unlikeCount: (material.unlikeCount || 0) + 1 }
            : material
        ));
      } else {
        setRecentMaterials(prev => prev.map(material => 
          (material._id === materialId || material.id === materialId)
            ? { ...material, unlikeCount: (material.unlikeCount || 0) + 1 }
            : material
        ));
      }
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
      
      // Update download count locally
      if (view === "top") {
        setTopMaterials(prev => prev.map(material => 
          (material._id === materialId || material.id === materialId)
            ? { ...material, downloadCount: (material.downloadCount || 0) + 1 }
            : material
        ));
      } else {
        setRecentMaterials(prev => prev.map(material => 
          (material._id === materialId || material.id === materialId)
            ? { ...material, downloadCount: (material.downloadCount || 0) + 1 }
            : material
        ));
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      // Simulate download for demo purposes
      alert('Download functionality would work here with a real file URL');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentMaterials = view === "top" ? topMaterials : recentMaterials;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Study Materials</h1>
        
        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setView("top")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              view === "top" 
                ? "bg-blue-500 text-white shadow-lg" 
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <FaStar className="inline mr-2" />
            Top Rated
          </button>
          <button
            onClick={() => setView("recent")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              view === "recent" 
                ? "bg-blue-500 text-white shadow-lg" 
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <FaCalendar className="inline mr-2" />
            Recently Uploaded
          </button>
        </div>

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

      {/* Materials List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading materials...</p>
        </div>
      ) : currentMaterials.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No materials found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMaterials.map((material) => (
            <div key={material._id || material.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Material Preview */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600 text-sm font-medium">{material.title}</p>
                </div>
              </div>
              
              {/* Material Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>
                
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  <p><span className="font-semibold">Campus:</span> {material.campus}</p>
                  <p><span className="font-semibold">Course:</span> {material.course}</p>
                  <p><span className="font-semibold">Year:</span> {material.year} | <span className="font-semibold">Semester:</span> {material.semester}</p>
                  <p><span className="font-semibold">Subject:</span> {material.subject}</p>
                  {view === "recent" && (
                    <p><span className="font-semibold">Uploaded:</span> {formatDate(material.createdAt)}</p>
                  )}
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded">
                  <span className="flex items-center">
                    <FaThumbsUp className="mr-1 text-green-500" />
                    {material.likeCount || 0}
                  </span>
                  <span className="flex items-center">
                    <FaThumbsDown className="mr-1 text-red-500" />
                    {material.unlikeCount || 0}
                  </span>
                  <span className="flex items-center">
                    <FaStar className="mr-1 text-yellow-500" />
                    {material.rating?.toFixed(1) || 0}
                  </span>
                  <span className="flex items-center">
                    <FaDownload className="mr-1 text-blue-500" />
                    {material.downloadCount || 0}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleLike(material._id || material.id)}
                    className="px-3 py-2 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
                  >
                    <FaThumbsUp className="inline mr-1" />
                    Like
                  </button>
                  
                  <button
                    onClick={() => handleUnlike(material._id || material.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    <FaThumbsDown className="inline mr-1" />
                    Unlike
                  </button>
                  
                  <button
                    onClick={() => handleDownload(material._id || material.id, material.fileUrl || "#")}
                    className="px-3 py-2 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                  >
                    <FaDownload className="inline mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;