// SM - Requested Study Materials Component
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaUpload,
  FaClock,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCalendarAlt,
  FaUser,
  FaSearch,
  FaBell,
  FaArrowLeft,
  FaFile,
  FaTimes,
} from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const RequestedSM = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({
    campus: "",
    course: "",
    subject: "",
    urgency: "",
    status: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
    fetchRequests();
    fetchSystemData();
  }, [location.state]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/study-materials/requests"
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        setFilteredRequests(data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = requests.filter((request) => {
      const matchesSearch =
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCampus = !filters.campus || request.campus === filters.campus;
      const matchesCourse = !filters.course || request.course === filters.course;
      const matchesSubject =
        !filters.subject || request.subject === filters.subject;
      const matchesUrgency =
        !filters.urgency || request.urgency === filters.urgency;
      const matchesStatus =
        !filters.status || request.status === filters.status;

      return (
        matchesSearch &&
        matchesCampus &&
        matchesCourse &&
        matchesSubject &&
        matchesUrgency &&
        matchesStatus
      );
    });

    setFilteredRequests(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, requests]);

  const handleUploadClick = (request) => {
    setSelectedRequest(request);
    setShowUploadModal(true);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "fulfilled":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaBell className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Study Material Requests
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Help fellow students by fulfilling their material requests
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-center flex items-center justify-center">
              <FaBell className="mr-2" />
              {successMessage}
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests by title, description, or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Campus Filter */}
              <div>
                <select
                  name="campus"
                  value={filters.campus}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              <div>
                <select
                  name="course"
                  value={filters.course}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

              {/* Subject Filter */}
              <div>
                <select
                  name="subject"
                  value={filters.subject}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

              {/* Urgency Filter */}
              <div>
                <select
                  name="urgency"
                  value={filters.urgency}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Urgency Levels</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No requests found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {request.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(
                            request.urgency
                          )}`}
                        >
                          {request.urgency}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{request.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-orange-600" />
                          {request.campus}
                        </div>
                        <div className="flex items-center">
                          <FaGraduationCap className="mr-2 text-orange-600" />
                          {request.course}
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-orange-600" />
                          Year {request.year}, Sem {request.semester}
                        </div>
                        <div className="flex items-center">
                          <FaBook className="mr-2 text-orange-600" />
                          {request.subject}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-orange-600" />
                          Requested by {request.requestedBy}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-orange-600" />
                          {formatDate(request.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleUploadClick(request)}
                          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center"
                        >
                          <FaUpload className="mr-2" />
                          Upload Material
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && selectedRequest && (
          <UploadModal
            request={selectedRequest}
            onClose={() => {
              setShowUploadModal(false);
              setSelectedRequest(null);
            }}
            onSuccess={() => {
              fetchRequests();
              setShowUploadModal(false);
              setSelectedRequest(null);
            }}
          />
        )}
      </div>
    </>
  );
};

// Upload Modal Component
const UploadModal = ({ request, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: request.title,
    description: `Material uploaded in response to request: ${request.title}`,
    subject: request.subject,
    campus: request.campus,
    course: request.course,
    year: request.year,
    semester: request.semester,
    keywords: [],
    files: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log('Files selected for request upload:', selectedFiles);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles],
    }));
    // Clear the input so the same files can be selected again
    e.target.value = '';
  };

  const addFiles = (newFiles) => {
    setFormData(prev => {
      // Filter out duplicates based on file name and size
      const existingFiles = prev.files.map(f => `${f.name}-${f.size}`);
      const uniqueNewFiles = newFiles.filter(file => 
        !existingFiles.includes(`${file.name}-${file.size}`)
      );
      return { ...prev, files: [...prev.files, ...uniqueNewFiles] };
    });
  };

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  const clearAllFiles = () => {
    setFormData(prev => ({
      ...prev,
      files: []
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    console.log('Files dropped for request upload:', droppedFiles);
    addFiles(droppedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError("Title is required");
        setLoading(false);
        return;
      }
      if (!formData.subject.trim()) {
        setError("Subject is required");
        setLoading(false);
        return;
      }
      if (formData.files.length === 0) {
        setError("Please select at least one file");
        setLoading(false);
        return;
      }

      console.log('=== REQUEST UPLOAD DEBUG START ===');
      console.log('Files to upload:', formData.files);
      console.log('Number of files:', formData.files.length);

      const uploadFormData = new FormData();
      
      // Append all files
      formData.files.forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, 'Size:', file.size);
        uploadFormData.append(`file${index}`, file);
      });
      uploadFormData.append("fileCount", formData.files.length);
      
      // Append other form data
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("subject", formData.subject);
      uploadFormData.append("campus", formData.campus);
      uploadFormData.append("course", formData.course);
      uploadFormData.append("year", formData.year);
      uploadFormData.append("semester", formData.semester);
      uploadFormData.append("keywords", JSON.stringify(formData.keywords));
      uploadFormData.append("fulfilledRequest", request._id);
      // uploadedBy will be set by the backend from the authenticated user

      // Get authentication token
      const token = localStorage.getItem('studentToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5001/api/study-materials/upload",
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData,
        }
      );

      if (response.ok) {
        const result = await response.json();

        await fetch(
          `http://localhost:5001/api/study-materials/requests/${request._id}/fulfill`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fulfilledBy: "student1",
              fulfilledMaterial: result._id,
            }),
          }
        );

        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to upload material");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Upload Material for Request
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-orange-800 mb-2">Request Details:</h3>
            <p className="text-orange-700 text-sm">{request.title}</p>
            <p className="text-orange-700 text-sm">{request.description}</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Files * (Multiple files allowed)
                </label>
                
                {/* File Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
                    isDragOver 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.pptx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="request-file-upload"
                    multiple
                  />
                  <label htmlFor="request-file-upload" className="cursor-pointer">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaUpload className="text-xl text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {isDragOver 
                        ? "Drop files here to upload multiple files" 
                        : formData.files.length > 0 
                          ? `${formData.files.length} file${formData.files.length > 1 ? 's' : ''} selected` 
                          : "Click to upload files (multiple files allowed)"
                      }
                    </p>
                    {formData.files.length > 0 ? (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ {formData.files.length} file{formData.files.length > 1 ? 's' : ''} ready for upload
                      </p>
                    ) : (
                      <p className="text-xs text-red-600 font-medium">
                        ⚠ Please select at least one file to upload
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, JPG, PNG, DOCX, PPTX
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      💡 Tip: Hold Ctrl/Cmd to select multiple files or drag & drop files here
                    </p>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Button clicked, triggering file input');
                          const fileInput = document.getElementById('request-file-upload');
                          if (fileInput) {
                            fileInput.value = '';
                            fileInput.click();
                          }
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Select Multiple Files
                      </button>
                    </div>
                  </label>
                </div>
                
                {/* Selected Files List */}
                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                      <button
                        type="button"
                        onClick={clearAllFiles}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center">
                            <FaFile className="text-orange-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Material"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestedSM;
