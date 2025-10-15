// SM - Top Rated & Recently Uploaded Study Materials Component
import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaStar, FaDownload, FaCalendar } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const MaterialsPage = ({ user, setUser }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    campus: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
    sortBy: "top" // Add sort option to filters
  });

  // System data states
  const [systemData, setSystemData] = useState({
    campuses: [],
    courses: [],
    years: [],
    semesters: [],
    subjects: []
  });
  const [systemDataLoading, setSystemDataLoading] = useState(false);

  // Fetch system data for dropdowns
  const fetchSystemData = async () => {
    setSystemDataLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/system-data/all');
      const data = await response.json();
      if (data.success) {
        setSystemData(data.data);
      }
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setSystemDataLoading(false);
    }
  };

  // Fetch materials based on sort option
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      let url = '';
      if (filters.sortBy === "top") {
        url = 'http://localhost:5001/api/study-materials/top?';
      } else {
        url = 'http://localhost:5001/api/study-materials/all?';
      }
      
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'sortBy') params.append(key, value);
      });
      
      const response = await fetch(url + params.toString());
      const data = await response.json();
      
      if (filters.sortBy === "recent") {
        // Sort by creation date (most recent first)
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMaterials(sortedData);
      } else {
        setMaterials(data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      // Fallback data
      setMaterials([
        { id: 1, title: "Math Notes", uploadedBy: "Student A", likeCount: 12, unlikeCount: 0, downloadCount: 80, rating: 4.2, campus: "Malabe", course: "IT", year: "1", semester: "1", subject: "Mathematics", description: "Calculus and algebra notes", createdAt: new Date().toISOString() },
        { id: 2, title: "Physics PDF", uploadedBy: "Student B", likeCount: 5, unlikeCount: 1, downloadCount: 45, rating: 3.8, campus: "Matara", course: "Physics", year: "2", semester: "2", subject: "Physics", description: "Modern physics concepts", createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

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
          (material._id === materialId || material.id === materialId)
            ? { ...material, likeCount: (material.likeCount || 0) + 1 }
            : material
        ));
      }
    } catch (error) {
      console.error('Error liking material:', error);
      // Fallback: update local state
      setMaterials(prev => prev.map(material => 
        (material._id === materialId || material.id === materialId)
          ? { ...material, likeCount: (material.likeCount || 0) + 1 }
          : material
      ));
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
          (material._id === materialId || material.id === materialId)
            ? { ...material, unlikeCount: (material.unlikeCount || 0) + 1 }
            : material
        ));
      }
    } catch (error) {
      console.error('Error unliking material:', error);
      // Fallback: update local state
      setMaterials(prev => prev.map(material => 
        (material._id === materialId || material.id === materialId)
          ? { ...material, unlikeCount: (material.unlikeCount || 0) + 1 }
          : material
      ));
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
      setMaterials(prev => prev.map(material => 
        (material._id === materialId || material.id === materialId)
          ? { ...material, downloadCount: (material.downloadCount || 0) + 1 }
          : material
      ));
    } catch (error) {
      console.error('Error downloading file:', error);
      // Simulate download for demo purposes
      alert('Download functionality would work here with a real file URL');
    }
  };

  const handleDownloadAll = async (materialId, fileUrls) => {
    try {
      // Track download
      await fetch(`http://localhost:5001/api/study-materials/${materialId}/download`, {
        method: 'POST'
      });
      
      console.log('Downloading all files:', fileUrls);
      
      // Download all files
      for (let i = 0; i < fileUrls.length; i++) {
        const fileUrl = fileUrls[i];
        console.log(`Downloading file ${i + 1}/${fileUrls.length}:`, fileUrl);
        
        try {
          const response = await fetch(`http://localhost:5001${fileUrl}`);
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileUrl.split('/').pop();
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Small delay between downloads to prevent browser blocking
            if (i < fileUrls.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } else {
            console.error(`Failed to download file: ${fileUrl}`);
          }
        } catch (fileError) {
          console.error(`Error downloading file ${fileUrl}:`, fileError);
        }
      }
      
      console.log('All files downloaded successfully');
      
      // Update download count locally
      setMaterials(prev => prev.map(material => 
        (material._id === materialId || material.id === materialId)
          ? { ...material, downloadCount: (material.downloadCount || 0) + 1 }
          : material
      ));
    } catch (error) {
      console.error('Error downloading files:', error);
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

  const currentMaterials = materials;

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Study Materials</h1>
        
        {/* Filters */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 mb-6">
          <div className="px-4 py-4">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {/* Sort Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200 hover:border-gray-300 text-sm"
                  >
                    <option value="top">Top Rated</option>
                    <option value="recent">Recently Uploaded</option>
                  </select>
                </div>
                
                {/* Campus Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campus
                  </label>
                  <select
                    value={filters.campus}
                    onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
                    className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200 hover:border-gray-300 text-sm"
                    disabled={systemDataLoading}
                  >
                    <option value="">{systemDataLoading ? "Loading..." : "All Campuses"}</option>
                    {systemData.campuses.map((campus) => (
                      <option key={campus._id} value={campus.name}>
                        {campus.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Course Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course
                  </label>
                  <select
                    value={filters.course}
                    onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                    className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200 hover:border-gray-300 text-sm"
                    disabled={systemDataLoading}
                  >
                    <option value="">{systemDataLoading ? "Loading..." : "All Courses"}</option>
                    {systemData.courses.map((course) => (
                      <option key={course._id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Year Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200 hover:border-gray-300 text-sm"
                    disabled={systemDataLoading}
                  >
                    <option value="">{systemDataLoading ? "Loading..." : "All Years"}</option>
                    {systemData.years.map((year) => (
                      <option key={year._id} value={year.year}>
                        {year.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Semester Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                    className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200 hover:border-gray-300 text-sm"
                    disabled={systemDataLoading}
                  >
                    <option value="">{systemDataLoading ? "Loading..." : "All Semesters"}</option>
                    {systemData.semesters.map((semester) => (
                      <option key={semester._id} value={semester.semester}>
                        {semester.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Subject Filter */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200 hover:border-gray-300 text-sm"
                    disabled={systemDataLoading}
                  >
                    <option value="">{systemDataLoading ? "Loading..." : "All Subjects"}</option>
                    {systemData.subjects.map((subject) => (
                      <option key={subject._id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Clear All Filters Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({ campus: "", course: "", year: "", semester: "", subject: "", sortBy: "top" })}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
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
                  {filters.sortBy === "recent" && (
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
                    onClick={() => {
                      if (material.fileUrls && material.fileUrls.length > 0) {
                        handleDownloadAll(material._id || material.id, material.fileUrls);
                      } else if (material.fileUrl) {
                        handleDownload(material._id || material.id, material.fileUrl);
                      }
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                  >
                    <FaDownload className="inline mr-1" />
                    {material.fileUrls && material.fileUrls.length > 0 
                      ? `Download All (${material.fileUrls.length})` 
                      : 'Download'
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
      </div>
    </>
  );
};

export default MaterialsPage;