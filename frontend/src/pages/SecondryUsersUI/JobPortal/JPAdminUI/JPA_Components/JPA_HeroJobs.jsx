import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';

const JPA_HeroJobs = () => {
  const [activeTab, setActiveTab] = useState('unreviewed');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - unreviewed jobs
  const unreviewedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Solutions Inc.',
      location: 'New York, NY',
      salary: '$90,000 - $120,000',
      postedDate: '2024-01-15',
      status: 'pending',
      postedBy: 'john@techsolutions.com',
      description: 'We are looking for a senior React developer to join our team...'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'Creative Studio',
      location: 'San Francisco, CA',
      salary: '$70,000 - $90,000',
      postedDate: '2024-01-14',
      status: 'pending',
      postedBy: 'sarah@creative.com',
      description: 'Join our design team to create beautiful user experiences...'
    },
    {
      id: 3,
      title: 'Backend Engineer',
      company: 'Data Systems LLC',
      location: 'Austin, TX',
      salary: '$85,000 - $110,000',
      postedDate: '2024-01-13',
      status: 'pending',
      postedBy: 'mike@datasystems.com',
      description: 'Looking for a backend engineer to work on our data platform...'
    }
  ];

  // Sample data - live jobs
  const liveJobs = [
    {
      id: 101,
      title: 'Frontend Developer',
      company: 'Web Innovations',
      location: 'Remote',
      salary: '$80,000 - $100,000',
      postedDate: '2024-01-10',
      expiresDate: '2024-02-10',
      status: 'live',
      applications: 24,
      description: 'Remote frontend developer position with flexible hours...'
    },
    {
      id: 102,
      title: 'DevOps Engineer',
      company: 'Cloud Services',
      location: 'Seattle, WA',
      salary: '$100,000 - $130,000',
      postedDate: '2024-01-08',
      expiresDate: '2024-02-08',
      status: 'live',
      applications: 18,
      description: 'DevOps engineer to manage our cloud infrastructure...'
    }
  ];

  // Sample data - old jobs
  const oldJobs = [
    {
      id: 201,
      title: 'Junior Developer',
      company: 'Startup Co',
      location: 'Boston, MA',
      salary: '$60,000 - $75,000',
      postedDate: '2023-12-01',
      expiredDate: '2023-12-31',
      status: 'expired',
      applications: 15,
      description: 'Entry-level developer position for recent graduates...'
    },
    {
      id: 202,
      title: 'Product Manager',
      company: 'Tech Growth',
      location: 'Chicago, IL',
      salary: '$95,000 - $120,000',
      postedDate: '2023-11-20',
      expiredDate: '2023-12-20',
      status: 'expired',
      applications: 32,
      description: 'Product manager to lead our product development team...'
    }
  ];

  const handleApprove = (jobId) => {
    console.log('Approving job:', jobId);
    // API call to approve job
  };

  const handleReject = (jobId) => {
    console.log('Rejecting job:', jobId);
    // API call to reject job
  };

  const handleEdit = (jobId) => {
    console.log('Editing job:', jobId);
    // Navigate to edit page
  };

  const handleDelete = (jobId) => {
    console.log('Deleting job:', jobId);
    // API call to delete job
  };

  const handleRepost = (jobId) => {
    console.log('Reposting job:', jobId);
    // API call to repost job
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'live': return 'bg-green-100 text-green-800 border-green-200'
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const renderJobCard = (job, type) => (
    <motion.div 
      key={job.id} 
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
                <span className="font-medium">{job.company}</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              </p>
              <p className="text-green-600 font-semibold mb-2 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-3 mb-4 lg:mb-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
            {job.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
            {job.status === 'live' && <CheckCircle className="w-4 h-4 mr-1" />}
            {job.status === 'expired' && <XCircle className="w-4 h-4 mr-1" />}
            {job.status}
          </span>
          {type === 'live' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <Users className="w-4 h-4 mr-1" />
              {job.applications} applications
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span><strong>Posted:</strong> {job.postedDate}</span>
        </div>
        {job.expiresDate && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span><strong>Expires:</strong> {job.expiresDate}</span>
          </div>
        )}
        {job.expiredDate && (
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span><strong>Expired:</strong> {job.expiredDate}</span>
          </div>
        )}
        {job.postedBy && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span><strong>Posted by:</strong> {job.postedBy}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {type === 'unreviewed' && (
          <>
            <motion.button
              onClick={() => handleReject(job.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </motion.button>
            <motion.button
              onClick={() => handleApprove(job.id)}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </motion.button>
            <motion.button
              onClick={() => handleEdit(job.id)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>
          </>
        )}
        {type === 'live' && (
          <>
            <motion.button
              onClick={() => handleEdit(job.id)}
              className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>
            <motion.button
              onClick={() => handleDelete(job.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
          </>
        )}
        {type === 'old' && (
          <>
            <motion.button
              onClick={() => handleRepost(job.id)}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              Repost
            </motion.button>
            <motion.button
              onClick={() => handleDelete(job.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
            <motion.button
              onClick={() => handleEdit(job.id)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              View Details
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );

  const getCurrentJobs = () => {
    switch (activeTab) {
      case 'unreviewed': return unreviewedJobs;
      case 'live': return liveJobs;
      case 'old': return oldJobs;
      default: return [];
    }
  };

  const filteredJobs = getCurrentJobs().filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="text-3xl font-bold text-gray-900 mb-2">{unreviewedJobs.length}</div>
            <div className="text-gray-600 font-medium">Pending Review</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-green-100 mx-auto mb-4 w-fit">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{liveJobs.length}</div>
            <div className="text-gray-600 font-medium">Live Listings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-gray-100 mx-auto mb-4 w-fit">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{oldJobs.length}</div>
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
              { key: 'unreviewed', label: 'Pending Review', icon: <Clock className="w-4 h-4" />, count: unreviewedJobs.length },
              { key: 'live', label: 'Live Listings', icon: <CheckCircle className="w-4 h-4" />, count: liveJobs.length },
              { key: 'old', label: 'Archived', icon: <Briefcase className="w-4 h-4" />, count: oldJobs.length }
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
              {activeTab === 'unreviewed' && <Clock className="w-6 h-6 text-yellow-600" />}
              {activeTab === 'live' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {activeTab === 'old' && <Briefcase className="w-6 h-6 text-gray-600" />}
              {activeTab === 'unreviewed' && 'Jobs Pending Review'}
              {activeTab === 'live' && 'Live Job Listings'}
              {activeTab === 'old' && 'Archived Job Listings'}
            </h2>
          </div>
          
          <div className="p-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => renderJobCard(job, activeTab))
            ) : (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : `No ${activeTab} jobs at the moment`}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JPA_HeroJobs;