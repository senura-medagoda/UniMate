import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBook, FaUpload, FaClock, FaMapMarkerAlt, FaGraduationCap, FaCalendarAlt, FaUser, FaFilter, FaSearch, FaBell } from "react-icons/fa";

const RequestedSM = () => {
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
    status: ""
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Show success message if coming from RequestSM
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
    fetchRequests();
  }, [location.state]);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/study-materials/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        setFilteredRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = requests.filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCampus = !filters.campus || request.campus === filters.campus;
      const matchesCourse = !filters.course || request.course === filters.course;
      const matchesSubject = !filters.subject || request.subject === filters.subject;
      const matchesUrgency = !filters.urgency || request.urgency === filters.urgency;
      const matchesStatus = !filters.status || request.status === filters.status;

      return matchesSearch && matchesCampus && matchesCourse && matchesSubject && matchesUrgency && matchesStatus;
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
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Study Material Requests</h1>
          <p className="text-gray-600">Help fellow students by fulfilling their material requests</p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            <FaBell className="inline mr-2" />
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
              >
                <option value="">All Campuses</option>
                <option value="Malabe">Malabe</option>
                <option value="Kandy">Kandy</option>
                <option value="Matara">Matara</option>
                <option value="Jaffna">Jaffna</option>
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <select
                name="course"
                value={filters.course}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Courses</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Programming">Programming</option>
                <option value="OOP">Object-Oriented Programming</option>
                <option value="DSA">Data Structures & Algorithms</option>
                <option value="Database">Database Management</option>
                <option value="Networking">Computer Networking</option>
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
              <h3 className="text-xl font-medium text-gray-600 mb-2">No requests found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{request.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
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
                    {request.status === 'pending' && (
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
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const uploadFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'keywords') {
          uploadFormData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'file') {
          if (formData[key]) {
            uploadFormData.append(key, formData[key]);
          }
        } else {
          uploadFormData.append(key, formData[key]);
        }
      });

      // Add request reference
      uploadFormData.append('fulfilledRequest', request._id);
      uploadFormData.append('uploadedBy', 'student1'); // TODO: Get from auth context

      const response = await fetch('http://localhost:5001/api/study-materials/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update request status to fulfilled
        await fetch(`http://localhost:5001/api/study-materials/requests/${request._id}/fulfill`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            fulfilledBy: 'student1',
            fulfilledMaterial: result._id
          })
        });

        // TODO: Send notification and email to requested student
        
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload material');
      }
    } catch (error) {
      setError('Network error. Please try again.');
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File *
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  required
                />
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
                {loading ? 'Uploading...' : 'Upload Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestedSM;
