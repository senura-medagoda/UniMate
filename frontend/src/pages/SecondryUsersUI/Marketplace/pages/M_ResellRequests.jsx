import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import M_SIdebar from '../components/M_SIdebar';
import Admin_Navbar from '../components/Admin_Navbar';

const M_ResellRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false); // Review modal
  const [showDetails, setShowDetails] = useState(false); // Details modal
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchRequests();
  }, []);

  // Show loading toast when component mounts
  useEffect(() => {
    if (loading) {
      toast.info('🔄 Loading resell requests...', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [loading]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/resell/admin/requests', {
        headers: { token: adminToken }
      });
      
      if (response.data.success) {
        setRequests(response.data.requests);
        toast.success(`📋 Loaded ${response.data.requests.length} resell requests`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(`❌ ${response.data.message || 'Failed to fetch requests'}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('❌ Network error: Failed to load requests. Please refresh the page.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5001/api/resell/admin/${action}`,
        {
          requestId: selectedRequest._id,
          adminNotes
        },
        { headers: { token: adminToken } }
      );

      if (response.data.success) {
        const actionText = action === 'approve' ? 'approved' : 'rejected';
        toast.success(`✅ Request ${actionText} successfully! The seller will be notified.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowModal(false);
        setSelectedRequest(null);
        setAdminNotes('');
        fetchRequests(); // Refresh the list
      } else {
        toast.error(`❌ Failed to ${action} request: ${response.data.message || 'Unknown error'}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`❌ Network error: Failed to ${action} request. Please try again.`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex">
        <M_SIdebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Navbar />
      <div className="flex">
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <M_SIdebar />
        </div>
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Resell Requests</h1>
            <p className="text-gray-600 mt-2">Manage user resell requests</p>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resell requests</h3>
              <p className="text-gray-500">All requests have been processed</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td
                          className="px-6 py-4 cursor-pointer"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetails(true);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {request.images && request.images.length > 0 ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={request.images[0]}
                                  alt={request.itemName}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 
                                    002 2h12a2 2 0 002-2V5a2 2 
                                    0 00-2-2H4zm12 12H4l4-8 3 6 
                                    2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {request.itemName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {request.category} • {request.subCategory}
                              </div>
                              <div className="text-sm text-gray-500">
                                Condition: {request.condition}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{request.userName}</div>
                          <div className="text-sm text-gray-500">{request.userEmail}</div>
                          <div className="text-sm text-gray-500">{request.contactNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-semibold text-orange-600">
                            Rs {request.price}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(request.date)}
                        </td>
                        <td className="px-6 py-4">
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                              >
                                Review
                              </button>
                            </div>
                          )}
                          {request.status !== 'pending' && (
                            <div className="text-sm text-gray-500">
                              {request.adminNotes && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Note: {request.adminNotes}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full shadow-lg overflow-hidden relative">
            <button
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
              onClick={() => {
                setShowDetails(false);
                setSelectedRequest(null);
              }}
            >
              ✕
            </button>

            <div className="h-80 bg-gray-100 flex items-center justify-center">
              {selectedRequest.images && selectedRequest.images.length > 0 ? (
                <img
                  src={selectedRequest.images[0]}
                  alt={selectedRequest.itemName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedRequest.itemName}
              </h2>
              <p className="text-gray-600">{selectedRequest.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-orange-600">
                  Rs {selectedRequest.price}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100">
                  {selectedRequest.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div><span className="text-gray-500">Category: </span>{selectedRequest.category}</div>
                <div><span className="text-gray-500">Type: </span>{selectedRequest.subCategory}</div>
                <div className="col-span-2"><span className="text-gray-500">Seller: </span>{selectedRequest.userName}</div>
                <div className="col-span-2"><span className="text-gray-500">Email: </span>{selectedRequest.userEmail}</div>
                <div className="col-span-2"><span className="text-gray-500">Contact: </span>{selectedRequest.contactNumber}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Review Request</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setAdminNotes('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">{selectedRequest.itemName}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedRequest.description}</p>
              <div className="text-sm text-gray-600">
                <div>Price: Rs {selectedRequest.price}</div>
                <div>Category: {selectedRequest.category} • {selectedRequest.subCategory}</div>
                <div>Condition: {selectedRequest.condition}</div>
                <div>Seller: {selectedRequest.userName} ({selectedRequest.userEmail})</div>
                <div>Contact: {selectedRequest.contactNumber}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes about your decision..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAction('reject')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={() => handleAction('approve')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default M_ResellRequests;
