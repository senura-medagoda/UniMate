import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './context/AdminAuthContext';
import { toast } from 'react-toastify';
import AdminNavbar from './components/AdminNavbar';
import { Star, StarIcon } from 'lucide-react';

const ShopsManagement = () => {
  const { hasPermission } = useAdminAuth();
  // Using react-toastify instead of custom toast context
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingShopId, setRejectingShopId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [shopToRate, setShopToRate] = useState(null);
  const [adminRating, setAdminRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [newShop, setNewShop] = useState({
    vendorId: '',
    shopName: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    category: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchShops();
    fetchVendors();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`http://localhost:5001/api/food-admin/shops?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setShops(data.data.shops);
        setTotalPages(data.data.totalPages);
      } else {
        toast.error('Failed to load shops');
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/food-admin/vendors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Vendors API response:', data);
        // The API returns { success: true, data: { vendors: [...], ... } }
        const vendorsArray = Array.isArray(data.data?.vendors) ? data.data.vendors : [];
        setVendors(vendorsArray);
      } else {
        console.error('Failed to load vendors');
        setVendors([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]); // Set empty array on error
    }
  };

  const toggleShopStatus = async (shopId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/shops/${shopId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        toast.success(`Shop ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchShops();
      } else {
        toast.error('Failed to update shop status');
      }
    } catch (error) {
      console.error('Error updating shop status:', error);
      toast.error('Failed to update shop status');
    }
  };

  const viewShopDetails = async (shopId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/shops/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedShop(data.data);
        setShowModal(true);
      } else {
        toast.error('Failed to load shop details');
      }
    } catch (error) {
      console.error('Error fetching shop details:', error);
      toast.error('Failed to load shop details');
    }
  };

  const approveShop = async (shopId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/shops/${shopId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Shop approved successfully');
        fetchShops();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to approve shop');
      }
    } catch (error) {
      console.error('Error approving shop:', error);
      toast.error('Failed to approve shop');
    }
  };

  const rejectShop = async (shopId, reason) => {
    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/shops/${shopId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason: reason })
      });

      if (response.ok) {
        toast.success('Shop rejected successfully');
        setShowRejectModal(false);
        setRejectReason('');
        setRejectingShopId(null);
        fetchShops();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to reject shop');
      }
    } catch (error) {
      console.error('Error rejecting shop:', error);
      toast.error('Failed to reject shop');
    }
  };

  const deleteShop = async (shopId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/shops/${shopId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Shop deleted successfully');
        fetchShops();
        setShowDeleteModal(false);
        setShopToDelete(null);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete shop');
      }
    } catch (error) {
      console.error('Error deleting shop:', error);
      toast.error('Failed to delete shop');
    }
  };

  const addShop = async () => {
    // Validate form before submission
    if (!validateShopForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Sending shop data:', newShop);
      
      const response = await fetch('http://localhost:5001/api/food-admin/shops', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newShop)
      });
      
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        toast.success('Shop added successfully');
        fetchShops();
        setShowAddModal(false);
        setNewShop({
          vendorId: '',
          shopName: '',
          description: '',
          address: '',
          phone: '',
          email: '',
          openingHours: '',
          category: ''
        });
        setValidationErrors({});
      } else {
        toast.error(responseData.message || 'Failed to add shop');
      }
    } catch (error) {
      console.error('Error adding shop:', error);
      toast.error('Failed to add shop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateShopForm = () => {
    const errors = {};
    
    if (!newShop.vendorId) {
      errors.vendorId = 'Vendor is required';
    }
    if (!newShop.shopName.trim()) {
      errors.shopName = 'Shop Name is required';
    }
    if (!newShop.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!newShop.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!newShop.phone.trim()) {
      errors.phone = 'Phone is required';
    }
    if (!newShop.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newShop.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setNewShop(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDeleteClick = (shop) => {
    setShopToDelete(shop);
    setShowDeleteModal(true);
  };

  const handleRejectClick = (shopId) => {
    setRejectingShopId(shopId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectShop(rejectingShopId, rejectReason);
  };

  const handleRateShop = (shop) => {
    setShopToRate(shop);
    setAdminRating(shop.averageRating || 0);
    setRatingComment('');
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (adminRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      console.log('Submitting rating:', {
        shopId: shopToRate._id,
        rating: adminRating,
        comment: ratingComment,
        adminToken: localStorage.getItem('adminToken') ? 'Present' : 'Missing'
      });

      const response = await fetch(`http://localhost:5001/api/food-admin/shops/${shopToRate._id}/rate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: adminRating,
          comment: ratingComment
        })
      });

      console.log('Rating response status:', response.status);
      
      const responseData = await response.json();
      console.log('Rating response data:', responseData);

      if (response.ok) {
        toast.success('Shop rating updated successfully');
        fetchShops();
        setShowRatingModal(false);
        setShopToRate(null);
        setAdminRating(0);
        setRatingComment('');
      } else {
        toast.error(responseData.message || 'Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error('Failed to update rating');
    }
  };


  if (!hasPermission('manage_shops')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage shops.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shops Management</h1>
            <p className="text-gray-600 mt-2">Manage and monitor all food shops on the platform</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Shop</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Shops</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shops Cards */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {shops.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏪</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
                  <p className="text-gray-500">No shops match your current filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shops.map((shop) => (
                    <div key={shop._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                              {shop.logo ? (
                                <img
                                  src={shop.logo.startsWith('http') ? shop.logo : `http://localhost:5001${shop.logo}`}
                                  alt={shop.businessName}
                                  className="w-16 h-16 rounded-xl object-cover"
                                />
                              ) : (
                                <span className="text-white text-2xl">🏪</span>
                              )}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                              shop.isActive ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                shop.isActive ? 'bg-green-100' : 'bg-red-100'
                              }`}></div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {shop.businessName}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {shop.description}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                shop.isOpen 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {shop.isOpen ? '🟢 Open' : '🔴 Closed'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        {/* Shop Information */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{shop.vendorId?.businessName || shop.vendorId?.ownerName || 'N/A'}</p>
                              <p className="text-xs text-gray-500">Vendor</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{shop.address?.city || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{shop.address?.street || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {shop.averageRating ? shop.averageRating.toFixed(1) : '0.0'} ({shop.totalReviews || 0} reviews)
                              </p>
                              <p className="text-xs text-gray-500">Rating</p>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="space-y-3 mb-6">
                          <div className="flex flex-wrap gap-2">
                            {/* Approval Status */}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              shop.approvalStatus === 'approved' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : shop.approvalStatus === 'rejected'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {shop.approvalStatus === 'approved' ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Approved
                                </>
                              ) : shop.approvalStatus === 'rejected' ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Rejected
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Pending
                                </>
                              )}
                            </span>
                            {/* Active Status */}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              shop.isActive 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                shop.isActive ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              {shop.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {/* Open/Closed Status */}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              shop.isOpen 
                                ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {shop.isOpen ? 'Open' : 'Closed'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          {/* Approval Buttons for Pending Shops */}
                          {shop.approvalStatus === 'pending' && (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => approveShop(shop._id)}
                                className="flex-1 min-w-[100px] bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-medium">Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectClick(shop._id)}
                                className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-sm font-medium">Reject</span>
                              </button>
                            </div>
                          )}
                          
                          {/* Regular Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => viewShopDetails(shop._id)}
                              className="flex-1 min-w-[120px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-blue-200 hover:border-blue-300"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span className="text-sm font-medium">View Details</span>
                            </button>
                            
                            <button
                              onClick={() => handleRateShop(shop)}
                              className="flex-1 min-w-[120px] bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-yellow-200 hover:border-yellow-300"
                            >
                              <Star className="w-4 h-4" />
                              <span className="text-sm font-medium">Rate Shop</span>
                            </button>
                            
                            <button
                              onClick={() => handleDeleteClick(shop)}
                              className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v2m0 0V7m0 2H9m6 0h-6" />
                              </svg>
                              <span className="text-sm font-medium">Remove</span>
                            </button>
                            
                            {shop.approvalStatus === 'approved' && (
                              <button
                                onClick={() => toggleShopStatus(shop._id, shop.isActive)}
                                className={`flex-1 min-w-[120px] font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border shadow-sm hover:shadow-md ${
                                  shop.isActive 
                                    ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300' 
                                    : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300'
                                }`}
                              >
                                {shop.isActive ? (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                    </svg>
                                    <span className="text-sm font-medium">Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm font-medium">Activate</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex items-center justify-between border border-gray-100">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                        <span className="font-semibold text-gray-900">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                        >
                          Next
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Shop Details Modal */}
      {showModal && selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shop Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Shop Header */}
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-orange-100 rounded-lg flex items-center justify-center">
                    {selectedShop.logo ? (
                      <img
                        src={selectedShop.logo.startsWith('http') ? selectedShop.logo : `http://localhost:5001${selectedShop.logo}`}
                        alt={selectedShop.businessName}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-orange-600 text-3xl">🏪</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedShop.businessName}</h3>
                    <p className="text-gray-600 mt-1">{selectedShop.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="ml-1 text-sm text-gray-900">
                          {selectedShop.averageRating ? selectedShop.averageRating.toFixed(1) : '0.0'}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({selectedShop.totalReviews || 0} reviews)
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedShop.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedShop.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedShop.isOpen 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedShop.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedShop.contactInfo?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedShop.contactInfo?.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900">
                          {selectedShop.address?.street || 'N/A'}, {selectedShop.address?.city || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Business Details</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Delivery Radius</label>
                        <p className="text-gray-900">{selectedShop.deliveryRadius || 0} km</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Minimum Order</label>
                        <p className="text-gray-900">Rs. {selectedShop.minimumOrderAmount || 0}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Delivery Fee</label>
                        <p className="text-gray-900">Rs. {selectedShop.deliveryFee || 0}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Preparation Time</label>
                        <p className="text-gray-900">{selectedShop.preparationTime || 0} minutes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor Information */}
                {selectedShop.vendorId && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Vendor Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Vendor Name</label>
                          <p className="text-gray-900">{selectedShop.vendorId.businessName || selectedShop.vendorId.ownerName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{selectedShop.vendorId.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{selectedShop.vendorId.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedShop.vendorId.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedShop.vendorId.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Shop Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Reject Shop</h2>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setRejectingShopId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  placeholder="Please provide a reason for rejecting this shop..."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setRejectingShopId(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Reject Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Shop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Shop</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setValidationErrors({});
                    setNewShop({
                      vendorId: '',
                      shopName: '',
                      description: '',
                      address: '',
                      phone: '',
                      email: '',
                      openingHours: '',
                      category: ''
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                  <select
                    value={newShop.vendorId}
                    onChange={(e) => handleInputChange('vendorId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.vendorId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a vendor</option>
                    {Array.isArray(vendors) && vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.businessName || vendor.ownerName} ({vendor.email})
                      </option>
                    ))}
                  </select>
                  {validationErrors.vendorId && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.vendorId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
                  <input
                    type="text"
                    value={newShop.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.shopName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter shop name"
                    disabled={isSubmitting}
                  />
                  {validationErrors.shopName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.shopName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={newShop.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter shop description"
                    rows="3"
                    disabled={isSubmitting}
                  />
                  {validationErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <textarea
                    value={newShop.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter shop address"
                    rows="2"
                    disabled={isSubmitting}
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={newShop.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newShop.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newShop.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Select category</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Bakery">Bakery</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setValidationErrors({});
                    setNewShop({
                      vendorId: '',
                      shopName: '',
                      description: '',
                      address: '',
                      phone: '',
                      email: '',
                      openingHours: '',
                      category: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={addShop}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Adding Shop...</span>
                    </>
                  ) : (
                    <span>Add Shop</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Shop Modal */}
      {showDeleteModal && shopToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Shop</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete <strong>{shopToDelete.shopName}</strong>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setShopToDelete(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteShop(shopToDelete._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Delete Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && shopToRate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Rate Shop</h2>
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setShopToRate(null);
                    setAdminRating(0);
                    setRatingComment('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{shopToRate.businessName}</h3>
                <p className="text-gray-600 text-sm">{shopToRate.description}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating (1-5 stars)
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setAdminRating(star)}
                      className={`p-1 transition-colors duration-200 ${
                        star <= adminRating 
                          ? 'text-yellow-400 hover:text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {adminRating === 0 ? 'Select a rating' : 
                   adminRating === 1 ? 'Poor' :
                   adminRating === 2 ? 'Fair' :
                   adminRating === 3 ? 'Good' :
                   adminRating === 4 ? 'Very Good' : 'Excellent'}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add a comment about this shop..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setShopToRate(null);
                    setAdminRating(0);
                    setRatingComment('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopsManagement;
