import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Phone,
  Calendar,
  Mail,
  Building,
  User,
  AlertCircle,
  Search,
  Filter,
  Shield,
  UserCheck,
  Loader2
} from 'lucide-react';
import { useJPAuth } from '@/context/JPAuthContext';
import ManagerReviewPopup from './ManagerReviewPopup';

const JPA_HeroManagers = () => {
  const [activeTab, setActiveTab] = useState('Unverified');
  const [searchTerm, setSearchTerm] = useState('');
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedManager, setSelectedManager] = useState(null);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  
  const { makeAuthenticatedRequest } = useJPAuth();

  // Fetch all hiring managers for JP Admin
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await makeAuthenticatedRequest('http://localhost:5001/api/hm/admin/all');
        const result = await response.json();
        
        if (response.ok && result.success) {
          setManagers(result.data);
        } else {
          setError(result.message || 'Failed to fetch hiring managers');
        }
      } catch (err) {
        console.error('Error fetching managers:', err);
        setError(err.message || 'Failed to fetch hiring managers');
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [makeAuthenticatedRequest]);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Categorize managers by status
  const unverifiedManagers = managers.filter(manager => manager.hm_status === 'Unverified');
  const verifiedManagers = managers.filter(manager => manager.hm_status === 'Verified');
  const rejectedManagers = managers.filter(manager => manager.hm_status === 'Rejected');

  const handleVerify = async (managerId) => {
    try {
      setActionLoading(prev => ({ ...prev, [managerId]: 'verify' }));
      
      const response = await makeAuthenticatedRequest(`http://localhost:5001/api/hm/admin/${managerId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Verified' })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update the manager in the local state
        setManagers(prev => prev.map(manager => 
          manager._id === managerId ? { ...manager, hm_status: 'Verified' } : manager
        ));
        alert('Hiring Manager verified successfully!');
      } else {
        alert(result.message || 'Failed to verify hiring manager');
      }
    } catch (error) {
      console.error('Error verifying manager:', error);
      alert('Failed to verify hiring manager. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [managerId]: null }));
    }
  };

  const handleReject = async (managerId) => {
    try {
      setActionLoading(prev => ({ ...prev, [managerId]: 'reject' }));
      
      const response = await makeAuthenticatedRequest(`http://localhost:5001/api/hm/admin/${managerId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Rejected' })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update the manager in the local state
        setManagers(prev => prev.map(manager => 
          manager._id === managerId ? { ...manager, hm_status: 'Rejected' } : manager
        ));
        alert('Hiring Manager rejected successfully!');
      } else {
        alert(result.message || 'Failed to reject hiring manager');
      }
    } catch (error) {
      console.error('Error rejecting manager:', error);
      alert('Failed to reject hiring manager. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [managerId]: null }));
    }
  };

  const handleDelete = async (managerId) => {
    if (!window.confirm('Are you sure you want to delete this hiring manager? This action cannot be undone.')) {
      return;
    }
    
    try {
      setActionLoading(prev => ({ ...prev, [managerId]: 'delete' }));
      
      const response = await makeAuthenticatedRequest(`http://localhost:5001/api/hm/admin/${managerId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Remove the manager from the local state
        setManagers(prev => prev.filter(manager => manager._id !== managerId));
        alert('Hiring Manager deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete hiring manager');
      }
    } catch (error) {
      console.error('Error deleting manager:', error);
      alert('Failed to delete hiring manager. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [managerId]: null }));
    }
  };


  const handleReview = (manager) => {
    setSelectedManager(manager);
    setIsReviewPopupOpen(true);
  };

  const handleCloseReview = () => {
    setSelectedManager(null);
    setIsReviewPopupOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Unverified': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const renderManagerCard = (manager, type) => (
    <motion.div 
      key={manager._id} 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-gray-200">
              <span className="text-orange-600 font-bold text-lg">
                {getInitials(manager.hm_fname, manager.hm_lname)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {manager.hm_fname} {manager.hm_lname}
              </h3>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span className="font-medium">{manager.position || 'Position not specified'}</span>
                <span className="text-gray-400">•</span>
                <span>{manager.hm_company}</span>
              </p>
              <p className="text-blue-600 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {manager.hm_email}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            {manager.hm_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{manager.hm_phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span><strong>Registered:</strong> {formatDate(manager.createdAt)}</span>
            </div>
            {manager.lastLogin && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span><strong>Last Login:</strong> {formatDate(manager.lastLogin)}</span>
              </div>
            )}
            {manager.department && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span><strong>Department:</strong> {manager.department}</span>
              </div>
            )}
            {manager.hm_workID && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span><strong>Work ID:</strong> {manager.hm_workID}</span>
              </div>
            )}
          </div>

          {manager.reason && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-sm text-red-800">Reason: </strong>
                  <span className="text-sm text-red-700">{manager.reason}</span>
                </div>
              </div>
            </div>
          )}

          {type === 'verified' && (
            <div className="flex gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg flex-1">
                <div className="text-2xl font-bold text-green-600">{manager.activeJobs}</div>
                <div className="text-xs text-green-800">Active Jobs</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg flex-1">
                <div className="text-2xl font-bold text-blue-600">{manager.jobsPosted}</div>
                <div className="text-xs text-blue-800">Total Jobs</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-3 mb-4 lg:mb-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(manager.hm_status)}`}>
            {manager.hm_status === 'Unverified' && <Clock className="w-4 h-4 mr-1" />}
            {manager.hm_status === 'Verified' && <CheckCircle className="w-4 h-4 mr-1" />}
            {manager.hm_status === 'Rejected' && <XCircle className="w-4 h-4 mr-1" />}
            {manager.hm_status}
          </span>
          {type === 'Verified' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <UserCheck className="w-4 h-4 mr-1" />
              {manager.loginCount || 0} logins
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {type === 'Unverified' && (
          <>
            <motion.button
              onClick={() => handleReview(manager)}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              Review
            </motion.button>
            <motion.button
              onClick={() => handleReject(manager._id)}
              disabled={actionLoading[manager._id]}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[manager._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[manager._id] ? 1 : 0.98 }}
            >
              {actionLoading[manager._id] === 'reject' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject
            </motion.button>
            <motion.button
              onClick={() => handleVerify(manager._id)}
              disabled={actionLoading[manager._id]}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[manager._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[manager._id] ? 1 : 0.98 }}
            >
              {actionLoading[manager._id] === 'verify' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Verify
            </motion.button>
            <motion.button
              onClick={() => handleDelete(manager._id)}
              disabled={actionLoading[manager._id]}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[manager._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[manager._id] ? 1 : 0.98 }}
            >
              {actionLoading[manager._id] === 'delete' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </motion.button>
          </>
        )}
        {type === 'Verified' && (
          <>
            <motion.button
              onClick={() => handleDelete(manager._id)}
              disabled={actionLoading[manager._id]}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[manager._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[manager._id] ? 1 : 0.98 }}
            >
              {actionLoading[manager._id] === 'delete' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </motion.button>
          </>
        )}
        {type === 'Rejected' && (
          <>
            <motion.button
              onClick={() => handleDelete(manager._id)}
              disabled={actionLoading[manager._id]}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[manager._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[manager._id] ? 1 : 0.98 }}
            >
              {actionLoading[manager._id] === 'delete' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Permanently
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );

  const getCurrentManagers = () => {
    switch (activeTab) {
      case 'Unverified': return unverifiedManagers;
      case 'Verified': return verifiedManagers;
      case 'Rejected': return rejectedManagers;
      default: return [];
    }
  };

  const filteredManagers = getCurrentManagers().filter(manager =>
    `${manager.hm_fname} ${manager.hm_lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.hm_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.hm_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (manager.position && manager.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Manager <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Management</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Review, verify, and manage all hiring managers on the platform. Ensure only qualified professionals can post jobs.
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-yellow-100 mx-auto mb-4 w-fit">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : unverifiedManagers.length}</div>
            <div className="text-gray-600 font-medium">Pending Verification</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-green-100 mx-auto mb-4 w-fit">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : verifiedManagers.length}</div>
            <div className="text-gray-600 font-medium">Verified Managers</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-red-100 mx-auto mb-4 w-fit">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : rejectedManagers.length}</div>
            <div className="text-gray-600 font-medium">Rejected</div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search managers by name, email, company, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'Unverified', label: 'Unverified', icon: <Clock className="w-4 h-4" />, count: unverifiedManagers.length },
              { key: 'Verified', label: 'Verified', icon: <CheckCircle className="w-4 h-4" />, count: verifiedManagers.length },
              { key: 'Rejected', label: 'Rejected', icon: <XCircle className="w-4 h-4" />, count: rejectedManagers.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.key ? 'bg-orange-200 text-orange-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {activeTab === 'Unverified' && <Clock className="w-6 h-6 text-yellow-600" />}
              {activeTab === 'Verified' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {activeTab === 'Rejected' && <XCircle className="w-6 h-6 text-red-600" />}
              {activeTab === 'Unverified' && 'Managers Pending Verification'}
              {activeTab === 'Verified' && 'Verified Hiring Managers'}
              {activeTab === 'Rejected' && 'Rejected Managers'}
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-blue-100 w-fit mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading managers...</h3>
                <p className="text-gray-600">Please wait while we fetch the hiring managers</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-red-100 w-fit mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading managers</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredManagers.length > 0 ? (
              filteredManagers.map(manager => renderManagerCard(manager, activeTab))
            ) : (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No managers found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : `No ${activeTab} managers at the moment`}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Manager Review Popup */}
      <ManagerReviewPopup
        isOpen={isReviewPopupOpen}
        onClose={handleCloseReview}
        manager={selectedManager}
        onVerify={handleVerify}
        onReject={handleReject}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default JPA_HeroManagers;