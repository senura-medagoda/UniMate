import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './context/AdminAuthContext';
import { useToast } from '@/context/ToastContext';
import AdminNavbar from './components/AdminNavbar';

const VendorsManagement = () => {
  const { hasPermission } = useAdminAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`http://localhost:5001/api/food-admin/vendors?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVendors(data.data.vendors);
        setTotalPages(data.data.totalPages);
      } else {
        toastError('Failed to load vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toastError('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const toggleVendorStatus = async (vendorId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/vendors/${vendorId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        toastSuccess(`Vendor ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchVendors();
      } else {
        toastError('Failed to update vendor status');
      }
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toastError('Failed to update vendor status');
    }
  };

  const viewVendorDetails = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/vendors/${vendorId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedVendor(data.data);
        setShowModal(true);
      } else {
        toastError('Failed to load vendor details');
      }
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toastError('Failed to load vendor details');
    }
  };

  const approveVendor = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/vendors/${vendorId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toastSuccess('Vendor approved successfully');
        fetchVendors(); // Refresh the list
      } else {
        const error = await response.json();
        toastError(error.message || 'Failed to approve vendor');
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
      toastError('Failed to approve vendor');
    }
  };

  const rejectVendor = async (vendorId) => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) return;

    try {
      const response = await fetch(`http://localhost:5001/api/food-admin/vendors/${vendorId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason })
      });

      if (response.ok) {
        toastSuccess('Vendor rejected successfully');
        fetchVendors(); // Refresh the list
      } else {
        const error = await response.json();
        toastError(error.message || 'Failed to reject vendor');
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toastError('Failed to reject vendor');
    }
  };

  if (!hasPermission('manage_vendors')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage vendors.</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendors Management</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all food vendors on the platform</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search vendors..."
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
                <option value="all">All Vendors</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

         {/* Vendors List */}
         <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
           {loading ? (
             <div className="flex items-center justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
             </div>
           ) : (
             <>
               {vendors.length === 0 ? (
                 <div className="text-center py-12">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                   </div>
                   <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
                   <p className="text-gray-500">No vendors match your current filters.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-gray-100">
                   {vendors.map((vendor) => (
                     <div key={vendor._id} className="p-6 hover:bg-gray-50 transition-colors duration-200 group">
                       <div className="flex items-center justify-between">
                         {/* Left Section - Vendor Info */}
                         <div className="flex items-center space-x-4 flex-1 min-w-0">
                           {/* Avatar */}
                           <div className="relative flex-shrink-0">
                             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                               <span className="text-white font-bold text-lg">
                                 {vendor.ownerName?.charAt(0) || 'V'}
                               </span>
                             </div>
                             <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                               vendor.isActive ? 'bg-green-500' : 'bg-red-500'
                             }`}></div>
                           </div>

                           {/* Vendor Details */}
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center space-x-3 mb-2">
                               <h3 className="text-lg font-semibold text-gray-900 truncate">
                                 {vendor.businessName || vendor.ownerName}
                               </h3>
                               <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                 vendor.businessLicense 
                                   ? 'bg-emerald-100 text-emerald-800' 
                                   : 'bg-amber-100 text-amber-800'
                               }`}>
                                 {vendor.businessLicense ? 'Licensed' : 'Unlicensed'}
                               </span>
                             </div>
                             <p className="text-sm text-gray-600 mb-2">{vendor.ownerName}</p>
                             
                             {/* Contact Info */}
                             <div className="flex items-center space-x-6 text-sm text-gray-500">
                               <div className="flex items-center space-x-1">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                 </svg>
                                 <span className="truncate max-w-48">{vendor.email}</span>
                               </div>
                               <div className="flex items-center space-x-1">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                 </svg>
                                 <span>{vendor.phone}</span>
                               </div>
                               <div className="flex items-center space-x-1">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                 </svg>
                                 <span>{new Date(vendor.createdAt).toLocaleDateString()}</span>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Middle Section - Status Badges */}
                         <div className="flex flex-col items-center space-y-2 mx-6">
                           <div className="flex space-x-2">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                               vendor.isActive 
                                 ? 'bg-green-100 text-green-800 border border-green-200' 
                                 : 'bg-red-100 text-red-800 border border-red-200'
                             }`}>
                               <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                 vendor.isActive ? 'bg-green-500' : 'bg-red-500'
                               }`}></div>
                               {vendor.isActive ? 'Active' : 'Inactive'}
                             </span>
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                               vendor.isVerified 
                                 ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                                 : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                             }`}>
                               {vendor.isVerified ? 'Verified' : 'Unverified'}
                             </span>
                           </div>
                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                             vendor.approvalStatus === 'approved' 
                               ? 'bg-green-100 text-green-800 border border-green-200' 
                               : vendor.approvalStatus === 'rejected'
                               ? 'bg-red-100 text-red-800 border border-red-200'
                               : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                           }`}>
                             {vendor.approvalStatus === 'approved' ? (
                               <>
                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                 </svg>
                                 Account Approved
                               </>
                             ) : vendor.approvalStatus === 'rejected' ? (
                               <>
                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                 </svg>
                                 Account Rejected
                               </>
                             ) : (
                               <>
                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                                 Pending Approval
                               </>
                             )}
                           </span>
                         </div>

                         {/* Right Section - Action Buttons */}
                         <div className="flex items-center space-x-3 flex-shrink-0">
                           <button
                             onClick={() => viewVendorDetails(vendor._id)}
                             className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                             </svg>
                             <span className="hidden sm:inline">View</span>
                           </button>
                           
                           <button
                             onClick={() => toggleVendorStatus(vendor._id, vendor.isActive)}
                             className={`font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                               vendor.isActive 
                                 ? 'bg-red-50 hover:bg-red-100 text-red-700' 
                                 : 'bg-green-50 hover:bg-green-100 text-green-700'
                             }`}
                           >
                             {vendor.isActive ? (
                               <>
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                 </svg>
                                 <span className="hidden sm:inline">Deactivate</span>
                               </>
                             ) : (
                               <>
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                 </svg>
                                 <span className="hidden sm:inline">Activate</span>
                               </>
                             )}
                           </button>

                           {vendor.approvalStatus === 'pending' && (
                             <>
                               <button
                                 onClick={() => approveVendor(vendor._id)}
                                 className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                               >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                 </svg>
                                 <span className="hidden sm:inline">Approve</span>
                               </button>
                               <button
                                 onClick={() => rejectVendor(vendor._id)}
                                 className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                               >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                 </svg>
                                 <span className="hidden sm:inline">Reject</span>
                               </button>
                             </>
                           )}
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

      {/* Vendor Details Modal */}
      {showModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vendor Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Name</label>
                        <p className="text-gray-900">{selectedVendor.vendor.businessName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Owner Name</label>
                        <p className="text-gray-900">{selectedVendor.vendor.ownerName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedVendor.vendor.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedVendor.vendor.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Verification</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedVendor.vendor.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedVendor.vendor.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Verification</label>
                        <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedVendor.vendor.isVerified 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedVendor.vendor.isVerified ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business License</label>
                        <p className="text-gray-900">{selectedVendor.vendor.businessLicense || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900">{selectedVendor.vendor.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedVendor.shops && selectedVendor.shops.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shops ({selectedVendor.shops.length})</h3>
                    <div className="space-y-3">
                      {selectedVendor.shops.map((shop, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{shop.businessName}</h4>
                              <p className="text-sm text-gray-500">{shop.description}</p>
                              <p className="text-sm text-gray-500">{shop.address?.street}, {shop.address?.city}</p>
                              {shop.shopLicense && (
                                <div className="flex items-center space-x-1 text-sm text-orange-600 font-mono mt-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span>License: {shop.shopLicense}</span>
                                </div>
                              )}
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              shop.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {shop.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsManagement;


