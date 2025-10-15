import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/M_ShopContext';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const M_MyRequests = ({ user, setUser }) => {
  const { navigate } = useContext(ShopContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const studentToken = localStorage.getItem('studentToken');
      
      if (!studentToken) {
        toast.error('Please log in to view your requests');
        navigate('/M_home');
        return;
      }

      const userId = user?._id || user?.s_id || user?.id;
      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        navigate('/M_home');
        return;
      }

      const response = await axios.get(`http://localhost:5001/api/resell/user-requests/${userId}`, {
        headers: { token: studentToken }
      });

      if (response.data.success) {
        setRequests(response.data.requests);
        if (response.data.requests.length > 0) {
          toast.success(`Found ${response.data.requests.length} requests`);
        }
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

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: "bg-gradient-to-r from-yellow-400 to-orange-400",
        icon: "⏳",
        border: "border-yellow-300",
        lightBg: "from-yellow-50 to-orange-50"
      },
      approved: {
        bg: "bg-gradient-to-r from-orange-500 to-orange-600",
        icon: "✓",
        border: "border-orange-300",
        lightBg: "from-orange-50 to-yellow-50"
      },
      rejected: {
        bg: "bg-gradient-to-r from-orange-400 to-yellow-400",
        icon: "✕",
        border: "border-orange-300",
        lightBg: "from-orange-50 to-yellow-50"
      }
    };
    return configs[status] || configs.pending;
  };

  const getStatusMessage = (status, adminNotes) => {
    switch (status) {
      case 'pending':
        return 'Your request is under review. We will notify you once it\'s processed.';
      case 'approved':
        return 'Your request has been approved! Your item is now listed in the marketplace.';
      case 'rejected':
        return adminNotes ? `Reason: ${adminNotes}` : 'Your request was rejected.';
      default:
        return 'Unknown status';
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const studentToken = localStorage.getItem('studentToken');
      const userId = user?._id || user?.s_id || user?.id;
      
      if (!studentToken || !userId) {
        toast.error('Please log in to delete requests');
        return;
      }

      const response = await axios.delete(`http://localhost:5001/api/resell/user-requests/${requestId}`, {
        data: { userId },
        headers: { token: studentToken }
      });

      if (response.data.success) {
        toast.success('Request deleted successfully!');
        fetchMyRequests(); // Refresh the list
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

  const confirmDelete = (request) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const stats = [
    { key: 'all', label: 'Total', count: requests.length, icon: '📋', color: 'from-orange-400 to-yellow-500' },
    { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length, icon: '⏳', color: 'from-yellow-400 to-orange-400' },
    { key: 'approved', label: 'Approved', count: requests.filter(r => r.status === 'approved').length, icon: '✓', color: 'from-orange-500 to-yellow-400' },
    { key: 'rejected', label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length, icon: '✕', color: 'from-orange-400 to-yellow-300' }
  ];

  return (
    <div>
      <MarketPlace_Navbar user={user} setUser={setUser} />
      
      <div className='min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 relative overflow-hidden'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
          <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
          <div className='absolute top-40 left-1/2 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
        </div>

        <div className='relative flex-1 p-6 pt-24 max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <h1 className='text-5xl font-bold bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent mb-3 animate-fade-in'>
              My Resell Requests
            </h1>
            <p className='text-orange-800 text-lg'>Track and manage your marketplace submissions</p>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
            {stats.map((stat, index) => (
              <button
                key={stat.key}
                onClick={() => setFilter(stat.key)}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
                  filter === stat.key 
                    ? 'bg-white shadow-xl ring-2 ring-orange-400' 
                    : 'bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className='relative z-10'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-3xl'>{stat.icon}</span>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.count}
                    </div>
                  </div>
                  <div className='text-sm font-medium text-orange-700'>{stat.label}</div>
                </div>
                {filter === stat.key && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`}></div>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className='flex flex-col justify-center items-center py-20'>
              <div className='relative w-16 h-16 mb-4'>
                <div className='absolute inset-0 rounded-full border-4 border-yellow-200'></div>
                <div className='absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin'></div>
              </div>
              <p className='text-orange-700 font-medium'>Loading your requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className='text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100'>
              <div className='mb-6 animate-bounce'>
                <div className='w-24 h-24 mx-auto bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center'>
                  <span className='text-5xl'>📭</span>
                </div>
              </div>
              <h3 className='text-2xl font-bold text-orange-900 mb-3'>
                No {filter === 'all' ? '' : filter} requests found
              </h3>
              <p className='text-orange-700 mb-8 text-lg max-w-md mx-auto'>
                {filter === 'all' 
                  ? "Ready to start selling? Submit your first item today!" 
                  : `You don't have any ${filter} requests at the moment.`
                }
              </p>
              <button
                onClick={() => navigate('/M_collection')}
                className='group px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
              >
                <span className='flex items-center gap-2'>
                  Submit Your First Request
                  <span className='group-hover:translate-x-1 transition-transform'>→</span>
                </span>
              </button>
            </div>
          ) : (
            <div className='space-y-6'>
              {filteredRequests.map((request, index) => {
                const statusConfig = getStatusConfig(request.status);
                const isExpanded = expandedCard === request._id;
                
                return (
                  <div
                    key={request._id}
                    className='group bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100 overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1'
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Status Banner */}
                    <div className={`${statusConfig.bg} px-6 py-3 flex items-center justify-between text-white`}>
                      <div className='flex items-center gap-3'>
                        <span className='text-2xl'>{statusConfig.icon}</span>
                        <div>
                          <div className='font-bold text-lg capitalize'>{request.status}</div>
                          <div className='text-sm opacity-90'>{formatDate(request.date)}</div>
                        </div>
                      </div>
                      <div className='text-2xl font-bold'>Rs. {request.price}</div>
                    </div>

                    <div className='p-6'>
                      <div className='flex gap-6'>
                        {/* Images Section */}
                        {request.images && request.images.length > 0 && (
                          <div className='flex-shrink-0'>
                            <div className='relative w-40 h-40 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300'>
                              <img
                                src={request.images[0]}
                                alt={request.itemName}
                                className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                              />
                              {request.images.length > 1 && (
                                <div className='absolute bottom-2 right-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
                                  +{request.images.length - 1}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Content Section */}
                        <div className='flex-1'>
                          <h3 className='text-2xl font-bold text-orange-900 mb-4 group-hover:text-orange-600 transition-colors'>
                            {request.itemName}
                          </h3>

                          <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div className='bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100'>
                              <div className='text-xs font-medium text-orange-600 mb-1'>Category</div>
                              <div className='font-semibold text-orange-900'>{request.category}</div>
                            </div>
                            <div className='bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100'>
                              <div className='text-xs font-medium text-orange-600 mb-1'>Subcategory</div>
                              <div className='font-semibold text-orange-900'>{request.subCategory}</div>
                            </div>
                            <div className='bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100'>
                              <div className='text-xs font-medium text-orange-600 mb-1'>Condition</div>
                              <div className='font-semibold text-orange-900'>{request.condition}</div>
                            </div>
                            <div className='bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100'>
                              <div className='text-xs font-medium text-orange-600 mb-1'>Status</div>
                              <div className='font-semibold text-orange-900 capitalize'>{request.status}</div>
                            </div>
                          </div>

                          {/* Description Toggle */}
                          <button
                            onClick={() => setExpandedCard(isExpanded ? null : request._id)}
                            className='w-full text-left mb-4'
                          >
                            <div className='bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200 hover:border-orange-300 transition-all duration-300'>
                              <div className='flex items-center justify-between'>
                                <span className='text-sm font-medium text-orange-800'>Description & Details</span>
                                <span className={`transform transition-transform duration-300 text-orange-600 ${isExpanded ? 'rotate-180' : ''}`}>
                                  ▼
                                </span>
                              </div>
                              {isExpanded && (
                                <div className='mt-3 pt-3 border-t border-orange-200'>
                                  <p className='text-orange-900 mb-4'>{request.description}</p>
                                  <div className={`bg-gradient-to-r ${statusConfig.lightBg} rounded-xl p-4 border-l-4 ${statusConfig.border}`}>
                                    <div className='text-sm font-medium text-orange-800 mb-1'>Status Message</div>
                                    <p className='text-orange-900'>{getStatusMessage(request.status, request.adminNotes)}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>

                          {/* Action Buttons */}
                          <div className='flex gap-3 justify-end'>
                            <button
                              onClick={() => confirmDelete(request)}
                              className='group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700'
                            >
                              <FaTrash className='text-sm' />
                              <span>Delete Request</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && requestToDelete && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform animate-fade-in'>
            <div className='text-center mb-6'>
              <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center'>
                <FaExclamationTriangle className='text-2xl text-red-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Delete Resell Request</h3>
              <p className='text-gray-600'>
                Are you sure you want to delete your request for <strong>"{requestToDelete.itemName}"</strong>?
              </p>
              {requestToDelete.status === 'approved' && (
                <p className='text-sm text-orange-600 mt-2 font-medium bg-orange-50 p-2 rounded-lg'>
                  ⚠️ This request is approved and your item is listed in the marketplace. Deleting it will remove the listing as well.
                </p>
              )}
              <p className='text-sm text-red-600 mt-2 font-medium'>
                This action cannot be undone.
              </p>
            </div>
            
            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRequestToDelete(null);
                }}
                className='flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRequest(requestToDelete._id)}
                className='flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105'
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default M_MyRequests;