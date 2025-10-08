import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaClock, FaCheck, FaTimes, FaDownload, FaEye, FaTrash, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const MyRequests = ({ user, setUser }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/requests/user/student1`); // TODO: Get from auth context
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/requests/${requestId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchMyRequests();
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setShowEditModal(true);
  };

  const handleUpdateRequest = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/requests/${editingRequest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        fetchMyRequests();
        setShowEditModal(false);
        setEditingRequest(null);
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
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
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Material Requests</h1>
          <p className="text-gray-600">Track your study material requests and see which ones have been fulfilled</p>
        </div>

        {/* Create New Request Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/RequestSM')}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center mx-auto"
          >
            <FaBook className="mr-2" />
            Create New Request
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No requests yet</h3>
              <p className="text-gray-500 mb-4">Start by creating your first study material request</p>
              <button
                onClick={() => navigate('/RequestSM')}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                Create Request
              </button>
            </div>
          ) : (
            requests.map((request) => (
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
                      <div>
                        <strong>Subject:</strong> {request.subject}
                      </div>
                      <div>
                        <strong>Campus:</strong> {request.campus}
                      </div>
                      <div>
                        <strong>Course:</strong> {request.course}
                      </div>
                      <div>
                        <strong>Year/Sem:</strong> {request.year}/{request.semester}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-orange-600" />
                        Requested {formatDate(request.createdAt)}
                      </div>
                      {request.expiresAt && (
                        <div className="flex items-center">
                          <FaExclamationTriangle className="mr-2 text-orange-600" />
                          Expires {formatDate(request.expiresAt)}
                        </div>
                      )}
                    </div>

                    {/* Fulfilled Material Info */}
                    {request.status === 'fulfilled' && request.fulfilledMaterial && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-green-800 mb-2">✅ Request Fulfilled!</h4>
                            <p className="text-green-700 text-sm">
                              Your request has been fulfilled by {request.fulfilledBy}
                            </p>
                            <p className="text-green-700 text-sm">
                              Fulfilled on {formatDate(request.fulfilledAt)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/BrowseSM?search=${request.title}`)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center text-sm"
                            >
                              <FaEye className="mr-2" />
                              View Material
                            </button>
                            <button
                              onClick={() => navigate(`/BrowseSM?search=${request.title}`)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                            >
                              <FaDownload className="mr-2" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleEdit(request)}
                          className="text-blue-500 hover:text-blue-700 p-2"
                          title="Edit Request"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Delete Request"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRequest && (
        <EditRequestModal
          request={editingRequest}
          onClose={() => {
            setShowEditModal(false);
            setEditingRequest(null);
          }}
          onUpdate={handleUpdateRequest}
        />
      )}
      </div>
    </>
  );
};

// Edit Request Modal Component
const EditRequestModal = ({ request, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: request.title,
    description: request.description,
    urgency: request.urgency
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Request
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
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
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="low">Low - Can wait</option>
                <option value="normal">Normal - Within a week</option>
                <option value="high">High - Need within 2-3 days</option>
                <option value="urgent">Urgent - Need immediately</option>
              </select>
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
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Update Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
