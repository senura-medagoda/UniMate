import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import { useHMAuth } from '@/context/HMAuthContext';
import { 
  Plus, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  AlertCircle,
  UserCheck,
  Building2,
  Users,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import JobViewPopup from './JobViewPopup';
import JobEditPopup from './JobEditPopup';
import DeleteConfirmationPopup from './DeleteConfirmationPopup';

function HM_HeroMyjobs({ user }) {
  const navigate = useNavigate();
  const { hm, token, makeAuthenticatedRequest } = useHMAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Popup states
  const [viewPopup, setViewPopup] = useState({ isOpen: false, job: null });
  const [editPopup, setEditPopup] = useState({ isOpen: false, job: null });
  const [deletePopup, setDeletePopup] = useState({ isOpen: false, job: null });

  // Job categories - using useMemo to keep stable reference
  const categories = React.useMemo(() => [
    { id: 'all', label: 'All Jobs', icon: Briefcase, count: 0 },
    { id: 'pending', label: 'Pending', icon: Clock, count: 0 },
    { id: 'live', label: 'Live', icon: CheckCircle, count: 0 },
    { id: 'rejected', label: 'Rejected', icon: XCircle, count: 0 },
    { id: 'archived', label: 'Archived', icon: Archive, count: 0 }
  ], []);

  // Fetch jobs from API
  const fetchJobs = async () => {
    if (!token || !hm) {
      setError('Please log in to view your jobs');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await makeAuthenticatedRequest('http://localhost:5001/api/job/my-jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setJobs(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token, hm]);

  // Filter jobs based on category and search term
  const filteredJobs = jobs.filter(job => {
    const matchesCategory = activeCategory === 'all' || job.status === activeCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate category counts based on current jobs
  const categoryCounts = React.useMemo(() => {
    return {
      all: jobs.length,
      pending: jobs.filter(job => job.status === 'pending').length,
      live: jobs.filter(job => job.status === 'live').length,
      rejected: jobs.filter(job => job.status === 'rejected').length,
      archived: jobs.filter(job => job.status === 'archived').length
    };
  }, [jobs]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'live':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle job actions
  const handleJobAction = (job, action) => {
    switch (action) {
      case 'view':
        setViewPopup({ isOpen: true, job });
        break;
      case 'edit':
        setEditPopup({ isOpen: true, job });
        break;
      case 'delete':
        setDeletePopup({ isOpen: true, job });
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  // Handle popup close
  const handleClosePopup = (popupType) => {
    switch (popupType) {
      case 'view':
        setViewPopup({ isOpen: false, job: null });
        break;
      case 'edit':
        setEditPopup({ isOpen: false, job: null });
        break;
      case 'delete':
        setDeletePopup({ isOpen: false, job: null });
        break;
    }
  };

  // Handle job update
  const handleJobUpdate = (updatedJob) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job._id === updatedJob._id ? updatedJob : job
      )
    );
  };

  // Handle job deletion
  const handleJobDelete = () => {
    setJobs(prevJobs => 
      prevJobs.filter(job => job._id !== deletePopup.job._id)
    );
  };

  // If HM is not verified, show waiting message
  if (hm && hm.hm_status === 'Unverified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              My <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Job Listings</span>
            </h1>
            <p className="text-lg text-gray-600 mt-2">Manage your job postings</p>
          </motion.div>

          {/* Verification Pending Message */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Verification Pending</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Your account is currently under review. Once verified by our admin team, you'll be able to view and manage your job listings.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Verification Status: Unverified</span>
              </div>
              <p className="text-yellow-700 text-sm">
                Please wait for admin approval. You'll receive an email notification once your account is verified.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              My <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Job Listings</span>
            </h1>
            <p className="text-lg text-gray-600 mt-2">Manage your job postings and track applications</p>
          </div>
          
          <motion.button
            onClick={() => navigate('/addnewjob')}
            className="px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
            style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Create New Job
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{categoryCounts.all}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Live Jobs</p>
                <p className="text-3xl font-bold text-green-600">{categoryCounts.live}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{categoryCounts.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Archived</p>
                <p className="text-3xl font-bold text-gray-600">{categoryCounts.archived}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Archive className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, department, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeCategory === category.id
                        ? 'text-white'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={{
                      background: activeCategory === category.id 
                        ? 'linear-gradient(to right, #fc944c, #f97316)' 
                        : undefined
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeCategory === category.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {categoryCounts[category.id] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Jobs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your job listings...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Jobs</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchJobs}
                className="px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200"
                style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {activeCategory === 'all' ? 'No Jobs Found' : `No ${activeCategory} Jobs`}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeCategory === 'all' 
                  ? "You haven't created any job listings yet. Create your first job posting to get started."
                  : `You don't have any ${activeCategory} jobs at the moment.`
                }
              </p>
              {activeCategory === 'all' && (
                <button
                  onClick={() => navigate('/addnewjob')}
                  className="px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
                  style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Job
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Job Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1 capitalize">{job.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.compensation || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(job.deadline)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                      {job.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Posted: {formatDate(job.createdAt)}</span>
                      <span>Type: {job.jobtype}</span>
                    </div>

                    {/* Action Buttons - Always at bottom */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleJobAction(job, 'view')}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => job.status !== 'rejected' && handleJobAction(job, 'edit')}
                        disabled={job.status === 'rejected'}
                        className={`flex-1 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                          job.status === 'rejected'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleJobAction(job, 'delete')}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Popup Components */}
        <JobViewPopup
          job={viewPopup.job}
          isOpen={viewPopup.isOpen}
          onClose={() => handleClosePopup('view')}
        />

        <JobEditPopup
          job={editPopup.job}
          isOpen={editPopup.isOpen}
          onClose={() => handleClosePopup('edit')}
          onSave={handleJobUpdate}
          makeAuthenticatedRequest={makeAuthenticatedRequest}
        />

        <DeleteConfirmationPopup
          job={deletePopup.job}
          isOpen={deletePopup.isOpen}
          onClose={() => handleClosePopup('delete')}
          onConfirm={handleJobDelete}
          makeAuthenticatedRequest={makeAuthenticatedRequest}
        />
      </div>
    </div>
  );
}

export default HM_HeroMyjobs;