import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  RotateCcw, 
  Eye,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Users,
  AlertCircle,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { useJPAuth } from '@/context/JPAuthContext';

const JPA_HeroJobs = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  
  const { makeAuthenticatedRequest } = useJPAuth();

  // Fetch all jobs for JP Admin
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('JPA_HeroJobs: Fetching jobs...');
        const response = await makeAuthenticatedRequest('http://localhost:5001/api/job/admin/all');
        console.log('JPA_HeroJobs: Response status:', response.status);
        
        const result = await response.json();
        console.log('JPA_HeroJobs: Response data:', result);
        
        if (response.ok && result.success) {
          console.log('JPA_HeroJobs: Setting jobs:', result.data);
          setJobs(result.data);
          
          // If no jobs found, show a helpful message
          if (result.data.length === 0) {
            console.log('JPA_HeroJobs: No jobs found in database');
          }
        } else {
          console.error('JPA_HeroJobs: API error:', result.message);
          setError(result.message || 'Failed to fetch jobs');
        }
      } catch (err) {
        console.error('JPA_HeroJobs: Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [makeAuthenticatedRequest]);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to check if deadline has passed
  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  // Categorize jobs by status
  const pendingJobs = jobs.filter(job => job.status === 'pending');
  const liveJobs = jobs.filter(job => job.status === 'live');
  const archivedJobs = jobs.filter(job => job.status === 'archived' || job.status === 'rejected');
  
  // Debug logging
  console.log('JPA_HeroJobs: Total jobs:', jobs.length);
  console.log('JPA_HeroJobs: Pending jobs:', pendingJobs.length);
  console.log('JPA_HeroJobs: Live jobs:', liveJobs.length);
  console.log('JPA_HeroJobs: Archived jobs:', archivedJobs.length);
  console.log('JPA_HeroJobs: All jobs:', jobs);

  const handleApprove = async (jobId) => {
    try {
      setActionLoading(prev => ({ ...prev, [jobId]: 'approve' }));
      
      const response = await makeAuthenticatedRequest(`http://localhost:5001/api/job/admin/${jobId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'live' })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update the job in the local state
        setJobs(prev => prev.map(job => 
          job._id === jobId ? { ...job, status: 'live' } : job
        ));
        alert('Job approved successfully!');
      } else {
        alert(result.message || 'Failed to approve job');
      }
    } catch (error) {
      console.error('Error approving job:', error);
      alert('Failed to approve job. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [jobId]: null }));
    }
  };

  const handleReject = async (jobId) => {
    try {
      setActionLoading(prev => ({ ...prev, [jobId]: 'reject' }));
      
      const response = await makeAuthenticatedRequest(`http://localhost:5001/api/job/admin/${jobId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'rejected' })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update the job in the local state
        setJobs(prev => prev.map(job => 
          job._id === jobId ? { ...job, status: 'rejected' } : job
        ));
        alert('Job rejected successfully!');
      } else {
        alert(result.message || 'Failed to reject job');
      }
    } catch (error) {
      console.error('Error rejecting job:', error);
      alert('Failed to reject job. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [jobId]: null }));
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    
    try {
      setActionLoading(prev => ({ ...prev, [jobId]: 'delete' }));
      
      const response = await makeAuthenticatedRequest(`http://localhost:5001/api/job/admin/${jobId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Remove the job from the local state
        setJobs(prev => prev.filter(job => job._id !== jobId));
        alert('Job deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [jobId]: null }));
    }
  };

  const handleRepost = async (jobId) => {
    try {
      setActionLoading(prev => ({ ...prev, [jobId]: 'repost' }));
      
      const response = await makeAuthenticatedRequest(`http://localhost:5001/api/job/admin/${jobId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'live' })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update the job in the local state
        setJobs(prev => prev.map(job => 
          job._id === jobId ? { ...job, status: 'live' } : job
        ));
        alert('Job reposted successfully!');
      } else {
        alert(result.message || 'Failed to repost job');
      }
    } catch (error) {
      console.error('Error reposting job:', error);
      alert('Failed to repost job. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [jobId]: null }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'live': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const renderJobCard = (job, type) => (
    <motion.div 
      key={job._id} 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-3">
            <div className="p-3 rounded-xl bg-orange-100">
              <Briefcase className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <span className="font-medium">{job.department}</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              </p>
              <p className="text-green-600 font-semibold mb-2 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.compensation || 'Not specified'}
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-3 mb-4 lg:mb-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
            {job.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
            {job.status === 'live' && <CheckCircle className="w-4 h-4 mr-1" />}
            {job.status === 'rejected' && <XCircle className="w-4 h-4 mr-1" />}
            {job.status === 'archived' && <XCircle className="w-4 h-4 mr-1" />}
            {job.status}
          </span>
          {type === 'live' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <Users className="w-4 h-4 mr-1" />
              0 applications
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span><strong>Posted:</strong> {formatDate(job.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span><strong>Deadline:</strong> {formatDate(job.deadline)}</span>
        </div>
        {job.postedby && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span><strong>Posted by:</strong> {job.postedby}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span><strong>Type:</strong> {job.jobtype}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {type === 'pending' && (
          <>
            <motion.button
              onClick={() => handleReject(job._id)}
              disabled={actionLoading[job._id]}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[job._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[job._id] ? 1 : 0.98 }}
            >
              {actionLoading[job._id] === 'reject' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject
            </motion.button>
            <motion.button
              onClick={() => handleApprove(job._id)}
              disabled={actionLoading[job._id]}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[job._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[job._id] ? 1 : 0.98 }}
            >
              {actionLoading[job._id] === 'approve' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Approve
            </motion.button>
            <motion.button
              onClick={() => handleDelete(job._id)}
              disabled={actionLoading[job._id]}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[job._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[job._id] ? 1 : 0.98 }}
            >
              {actionLoading[job._id] === 'delete' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </motion.button>
          </>
        )}
        {type === 'live' && (
          <>
            <motion.button
              onClick={() => handleDelete(job._id)}
              disabled={actionLoading[job._id]}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[job._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[job._id] ? 1 : 0.98 }}
            >
              {actionLoading[job._id] === 'delete' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </motion.button>
          </>
        )}
        {type === 'archived' && (
          <>
            <motion.button
              onClick={() => handleRepost(job._id)}
              disabled={actionLoading[job._id]}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: actionLoading[job._id] ? 1 : 1.02 }}
              whileTap={{ scale: actionLoading[job._id] ? 1 : 0.98 }}
            >
              {actionLoading[job._id] === 'repost' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              Repost
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );

  const getCurrentJobs = () => {
    switch (activeTab) {
      case 'pending': return pendingJobs;
      case 'live': return liveJobs;
      case 'archived': return archivedJobs;
      default: return [];
    }
  };

  const filteredJobs = getCurrentJobs().filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.postedby.toLowerCase().includes(searchTerm.toLowerCase())
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
              Job <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Management</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Review, manage, and monitor all job listings on the platform. Approve pending jobs and oversee the entire job posting process.
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
            <div className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : pendingJobs.length}</div>
            <div className="text-gray-600 font-medium">Pending Review</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-green-100 mx-auto mb-4 w-fit">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : liveJobs.length}</div>
            <div className="text-gray-600 font-medium">Live Listings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-gray-100 mx-auto mb-4 w-fit">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{loading ? '...' : archivedJobs.length}</div>
            <div className="text-gray-600 font-medium">Archived Jobs</div>
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
                placeholder="Search jobs by title, company, or location..."
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
              { key: 'pending', label: 'Pending Review', icon: <Clock className="w-4 h-4" />, count: pendingJobs.length },
              { key: 'live', label: 'Live Listings', icon: <CheckCircle className="w-4 h-4" />, count: liveJobs.length },
              { key: 'archived', label: 'Archived', icon: <Briefcase className="w-4 h-4" />, count: archivedJobs.length }
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
              {activeTab === 'pending' && <Clock className="w-6 h-6 text-yellow-600" />}
              {activeTab === 'live' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {activeTab === 'archived' && <Briefcase className="w-6 h-6 text-gray-600" />}
              {activeTab === 'pending' && 'Jobs Pending Review'}
              {activeTab === 'live' && 'Live Job Listings'}
              {activeTab === 'archived' && 'Archived Job Listings'}
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-blue-100 w-fit mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading jobs...</h3>
                <p className="text-gray-600">Please wait while we fetch the job listings</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-red-100 w-fit mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading jobs</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => renderJobCard(job, activeTab))
            ) : (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 
                   jobs.length === 0 ? 
                   'No jobs have been posted yet. Hiring Managers need to create job postings first.' :
                   `No ${activeTab} jobs at the moment`}
                </p>
                {jobs.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-blue-800 text-sm">
                      <strong>Tip:</strong> To see jobs here, Hiring Managers need to create job postings through their dashboard.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JPA_HeroJobs;