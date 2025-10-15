import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import M_SIdebar from '../components/M_SIdebar';
import Admin_Navbar from '../components/Admin_Navbar';

const M_ResellRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageList, setImageList] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showImageModal) {
        if (e.key === 'Escape') {
          closeImageModal();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showImageModal, currentImageIndex, imageList]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5001/api/resell/admin/requests', {
        headers: { token }
      });
      
      if (response.data.success) {
        setRequests(response.data.requests);
      } else {
        toast.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:5001/api/resell/admin/approve', {
        requestId,
        adminNote: adminNote || 'Approved by admin'
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Request approved successfully!');
        fetchRequests();
        setShowModal(false);
        setAdminNote('');
      } else {
        toast.error(response.data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    if (!adminNote.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:5001/api/resell/admin/reject', {
        requestId,
        adminNote
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Request rejected');
        fetchRequests();
        setShowModal(false);
        setAdminNote('');
      } else {
        toast.error(response.data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setAdminNote('');
  };

  const openImageModal = (image, images, index) => {
    setSelectedImage(image);
    setImageList(images);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % imageList.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(imageList[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? imageList.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(imageList[prevIndex]);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
    setImageList([]);
    setCurrentImageIndex(0);
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`http://localhost:5001/api/resell/admin/delete-request/${requestId}`, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Request deleted successfully!');
        fetchRequests();
        setShowDeleteModal(false);
        setRequestToDelete(null);
      } else {
        toast.error(response.data.message || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const openDeleteModal = (request) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex flex-col">
        <Admin_Navbar />
        <div className="flex flex-1">
          <div className="w-64 bg-white shadow-lg border-r border-gray-100">
        <M_SIdebar />
          </div>
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Navbar at the very top */}
      <Admin_Navbar />

      <div className="flex">
        {/* Fixed Sidebar */}
        <M_SIdebar />

        {/* Main Content with left margin for fixed sidebar */}
        <div className="flex-1 lg:ml-64 p-8">
          {/* Header with animation */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                  Resell Requests
                </h1>
                <p className="text-gray-600 text-lg">Review and manage resell requests from users</p>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold">{requests.length}</div>
                  <div className="text-sm opacity-90">Total Requests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Filter Tabs */}
          <div className="mb-8 animate-slide-up">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-2">
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All', count: requests.length, icon: '📋', color: 'gray' },
                  { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length, icon: '⏳', color: 'yellow' },
                  { key: 'approved', label: 'Approved', count: requests.filter(r => r.status === 'approved').length, icon: '✅', color: 'green' },
                  { key: 'rejected', label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length, icon: '❌', color: 'red' }
                ].map((tab, index) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      filter === tab.key
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/25'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        filter === tab.key 
                          ? 'bg-white/20 text-white' 
                          : `bg-${tab.color}-100 text-${tab.color}-700`
                      }`}>
                        {tab.count}
                      </span>
                    </span>
                    {filter === tab.key && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modern Requests List */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            {filteredRequests.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
                <div className="animate-bounce mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500">No resell requests match your current filter.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredRequests.map((request, index) => (
                  <div 
                    key={request._id} 
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {request.itemName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)} animate-pulse`}>
                              {request.status.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">{request.description}</p>
                        
                        {/* Images Gallery */}
                        {request.images && request.images.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-blue-600">📸</span>
                              <span className="font-semibold text-gray-700">Images ({request.images.length})</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {request.images.map((image, imgIndex) => (
                                <div 
                                  key={imgIndex}
                                  className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                  onClick={() => openImageModal(image, request.images, imgIndex)}
                                >
                                  <img
                                    src={image}
                                    alt={`${request.itemName} ${imgIndex + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                      </svg>
                              </div>
                              </div>
                              </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Price</div>
                            <div className="text-2xl font-bold text-orange-600">Rs. {request.price}</div>
                          </div>
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Category</div>
                            <div className="font-semibold text-gray-900">{request.category}</div>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Status</div>
                            <div className="font-semibold text-gray-900 capitalize">{request.status}</div>
                            </div>
                                </div>

                        {request.adminNote && (
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-400">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-amber-600">💬</span>
                              <span className="font-semibold text-amber-800">Admin Note</span>
                            </div>
                            <p className="text-amber-700">{request.adminNote}</p>
            </div>
          )}
      </div>

                      <div className="flex items-center gap-3 ml-6">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => openModal(request)}
                            className="group/btn relative px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                          >
                            <span className="flex items-center gap-2">
                              <span>Review</span>
                              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                          </button>
                        )}
                        {request.status === 'rejected' && (
                          <button
                            onClick={() => openDeleteModal(request)}
                            className="group/btn relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                          >
                            <span className="flex items-center gap-2">
                              <span>Delete</span>
                              <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                          </button>
                        )}
                      </div>
                    </div>
              </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Review Request</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{selectedRequest.itemName}</h3>
              <p className="text-gray-600 mb-4">{selectedRequest.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Price:</span>
                  <p className="font-medium">Rs. {selectedRequest.price}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Category:</span>
                  <p className="font-medium">{selectedRequest.category}</p>
            </div>
              </div>

              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500 block mb-2">Images:</span>
                  <div className="flex gap-2 flex-wrap">
                    {selectedRequest.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedRequest.itemName} ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Note
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note for the user..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedRequest._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Image Counter */}
              {imageList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {imageList.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {imageList.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
                {imageList.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setSelectedImage(image);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'border-blue-500 shadow-lg shadow-blue-500/25'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && requestToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Request</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this rejected request? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="font-semibold text-gray-900">{requestToDelete.itemName}</p>
                <p className="text-sm text-gray-600">Rs. {requestToDelete.price}</p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteRequest(requestToDelete._id)}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg shadow-red-500/25"
                >
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default M_ResellRequests;