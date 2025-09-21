import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const AdminDash = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected, removed
  const [selectedListing, setSelectedListing] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [removalReason, setRemovalReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [detailsListing, setDetailsListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchListings();
  }, [navigate]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      
      const response = await axios.get('http://localhost:5001/api/boarding-places/admin/all', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const sorted = (response.data || []).slice().sort((a, b) => {
        const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bd - ad; // newest first
      });
      setListings(sorted);
    } catch (error) {
      console.error('Error fetching listings:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listingId) => {
    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      
      await axios.put(`http://localhost:5001/api/boarding-places/admin/${listingId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      await fetchListings();
      alert('Listing approved successfully!');
    } catch (error) {
      console.error('Error approving listing:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to approve listing');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminHide = async (listingId) => {
    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      await axios.put(`http://localhost:5001/api/boarding-places/admin/${listingId}/hide`, {}, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      await fetchListings();
      alert('Listing hidden from admin dashboard.');
    } catch (error) {
      console.error('Error hiding listing:', error);
      alert('Failed to hide listing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 3) {
      alert('Please provide a rejection reason (minimum 3 characters)');
      return;
    }

    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      // Double confirmation
      const confirm1 = window.confirm('Are you sure you want to reject this listing?');
      if (!confirm1) { setActionLoading(false); return; }
      const confirm2 = window.confirm('This action cannot be undone. Confirm reject?');
      if (!confirm2) { setActionLoading(false); return; }
      
      await axios.put(`http://localhost:5001/api/boarding-places/admin/${selectedListing._id}/reject`, {
        rejectionReason: rejectionReason.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      await fetchListings();
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedListing(null);
      alert('Listing rejected successfully!');
    } catch (error) {
      console.error('Error rejecting listing:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to reject listing');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!removalReason.trim() || removalReason.trim().length < 3) {
      alert('Please provide a removal reason (minimum 3 characters)');
      return;
    }

    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      // Double confirmation
      const confirm1 = window.confirm('Are you sure you want to remove this listing?');
      if (!confirm1) { setActionLoading(false); return; }
      const confirm2 = window.confirm('This action cannot be undone. Confirm removal?');
      if (!confirm2) { setActionLoading(false); return; }
      
      await axios.put(`http://localhost:5001/api/boarding-places/admin/${selectedListing._id}/remove`, {
        removalReason: removalReason.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      await fetchListings();
      setShowRemoveModal(false);
      setRemovalReason('');
      setSelectedListing(null);
      alert('Listing removed successfully!');
    } catch (error) {
      console.error('Error removing listing:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to remove listing');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'removed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'removed': return 'Removed';
      default: return 'Unknown';
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.status === filter;
  });

  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    rejected: listings.filter(l => l.status === 'rejected').length,
    removed: listings.filter(l => l.status === 'removed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Accommodation Admin</h1>
              <p className="mt-2 text-gray-600">Review and manage boarding place listings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Listings</p>
                <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Removed</p>
                <p className="text-2xl font-semibold text-gray-600">{stats.removed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Listings', count: stats.total },
                { key: 'pending', label: 'Pending Review', count: stats.pending },
                { key: 'approved', label: 'Approved', count: stats.approved },
                { key: 'rejected', label: 'Rejected', count: stats.rejected },
                { key: 'removed', label: 'Removed', count: stats.removed }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col">
              {/* Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                    {getStatusText(listing.status)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Rs. {listing.price.toLocaleString()}/month
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {listing.ownerId?.fullName || 'Unknown Owner'}
                  </div>
                </div>

                {/* Admin Review Info */}
                {listing.adminReview?.reviewedAt && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Reviewed by {listing.adminReview.reviewedBy} on{' '}
                      {new Date(listing.adminReview.reviewedAt).toLocaleDateString()}
                    </p>
                    {listing.adminReview.rejectionReason && (
                      <p className="text-sm text-red-600">
                        <strong>Rejection Reason:</strong> {listing.adminReview.rejectionReason}
                      </p>
                    )}
                    {listing.adminReview.removalReason && (
                      <p className="text-sm text-red-600">
                        <strong>Removal Reason:</strong> {listing.adminReview.removalReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons - Always at bottom */}
                <div className="mt-auto space-y-3">
                  {/* Primary Actions Row */}
                  <div className="flex gap-2">
                    {listing.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(listing._id)}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {actionLoading ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowRejectModal(true);
                          }}
                          disabled={actionLoading}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </>
                    )}
                    {listing.status === 'approved' && (
                      <button
                        onClick={() => {
                          setSelectedListing(listing);
                          setShowRemoveModal(true);
                        }}
                        disabled={actionLoading}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    )}
                    {listing.status === 'rejected' && (
                      <div className="flex-1">
                        <span className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 cursor-not-allowed">
                          Rejected
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Secondary Actions Row */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetailsListing(listing)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                    {(listing.status === 'approved' || listing.status === 'rejected' || listing.status === 'removed') && (
                      <button
                        onClick={() => handleAdminHide(listing._id)}
                        disabled={actionLoading}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hide from Admin
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'No boarding places have been submitted yet.' : `No ${filter} listings found.`}
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Listing</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for rejecting "{selectedListing?.title}"
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason (minimum 3 characters)..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
                minLength={3}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedListing(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading || rejectionReason.trim().length < 3}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Remove Listing</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for removing "{selectedListing?.title}"
              </p>
              <textarea
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                placeholder="Enter removal reason (minimum 3 characters)..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
                minLength={3}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setRemovalReason('');
                    setSelectedListing(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  disabled={actionLoading || removalReason.trim().length < 3}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {detailsListing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[680px] max-w-[95%] shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-900">Listing Details</h3>
                <button onClick={() => setDetailsListing(null)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img
                    src={detailsListing.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={detailsListing.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <p className="mt-2 text-sm text-gray-500">Owner: {detailsListing.ownerId?.fullName || 'Unknown'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{detailsListing.title}</p>
                  <p className="text-sm text-gray-700">{detailsListing.description}</p>
                  <p className="text-sm text-gray-600">📍 {detailsListing.location}</p>
                  <p className="text-sm text-gray-600">Price: Rs. {detailsListing.price?.toLocaleString()}/month</p>
                  <p className="text-sm text-gray-600">Contact: {detailsListing.contactNumber}</p>
                  <p className="text-sm text-gray-600">Status: {getStatusText(detailsListing.status)}</p>
                  {detailsListing.adminReview?.reviewedAt && (
                    <div className="bg-gray-50 rounded p-2 text-sm">
                      <p>Reviewed by {detailsListing.adminReview.reviewedBy} on {new Date(detailsListing.adminReview.reviewedAt).toLocaleDateString()}</p>
                      {detailsListing.adminReview.rejectionReason && <p className="text-red-600">Rejection: {detailsListing.adminReview.rejectionReason}</p>}
                      {detailsListing.adminReview.removalReason && <p className="text-red-600">Removal: {detailsListing.adminReview.removalReason}</p>}
                    </div>
                  )}
                  {Array.isArray(detailsListing.amenities) && detailsListing.amenities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Amenities</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {detailsListing.amenities.map((a, i) => (
                          <span key={i} className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setDetailsListing(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDash;