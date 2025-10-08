import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  RotateCcw, 
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
  UserX
} from 'lucide-react';

const JPA_HeroManagers = () => {
  const [activeTab, setActiveTab] = useState('unverified');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - unverified managers
  const unverifiedManagers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@techinnovate.com',
      company: 'Tech Innovate Inc.',
      position: 'HR Manager',
      registeredDate: '2024-01-15',
      status: 'unverified',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      avatar: 'https://placehold.co/400x400?text=SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@datasolutions.com',
      company: 'Data Solutions LLC',
      position: 'Recruitment Lead',
      registeredDate: '2024-01-14',
      status: 'unverified',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      avatar: 'https://placehold.co/400x400?text=MC'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@creativehub.com',
      company: 'Creative Hub Studios',
      position: 'Talent Acquisition',
      registeredDate: '2024-01-13',
      status: 'unverified',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      avatar: 'https://placehold.co/400x400?text=ED'
    }
  ];

  // Sample data - verified managers
  const verifiedManagers = [
    {
      id: 101,
      name: 'John Smith',
      email: 'john@webtech.com',
      company: 'Web Technologies',
      position: 'Senior HR Director',
      registeredDate: '2024-01-05',
      verifiedDate: '2024-01-08',
      status: 'verified',
      phone: '+1 (555) 111-2233',
      location: 'Seattle, WA',
      jobsPosted: 12,
      activeJobs: 5,
      avatar: 'https://placehold.co/400x400?text=JS'
    },
    {
      id: 102,
      name: 'Lisa Wong',
      email: 'lisa@cloudservices.com',
      company: 'Cloud Services Inc.',
      position: 'HR Manager',
      registeredDate: '2024-01-02',
      verifiedDate: '2024-01-04',
      status: 'verified',
      phone: '+1 (555) 444-5566',
      location: 'Boston, MA',
      jobsPosted: 8,
      activeJobs: 3,
      avatar: 'https://placehold.co/400x400?text=LW'
    }
  ];

  // Sample data - rejected managers
  const rejectedManagers = [
    {
      id: 201,
      name: 'Robert Brown',
      email: 'robert@questionable.com',
      company: 'Questionable Enterprises',
      position: 'Recruiter',
      registeredDate: '2024-01-10',
      rejectedDate: '2024-01-12',
      status: 'rejected',
      phone: '+1 (555) 777-8888',
      location: 'Miami, FL',
      reason: 'Invalid company information',
      avatar: 'https://placehold.co/400x400?text=RB'
    }
  ];

  // Sample data - archived managers
  const archivedManagers = [
    {
      id: 301,
      name: 'Jennifer Lee',
      email: 'jennifer@oldtech.com',
      company: 'Old Tech Solutions',
      position: 'HR Director',
      registeredDate: '2023-11-15',
      archivedDate: '2024-01-01',
      status: 'archived',
      phone: '+1 (555) 999-0000',
      location: 'Chicago, IL',
      reason: 'Account inactive for 6 months',
      avatar: 'https://placehold.co/400x400?text=JL'
    }
  ];

  const handleVerify = (managerId) => {
    console.log('Verifying manager:', managerId);
    // API call to verify manager
  };

  const handleReject = (managerId) => {
    console.log('Rejecting manager:', managerId);
    // API call to reject manager
  };

  const handleEdit = (managerId) => {
    console.log('Editing manager:', managerId);
    // Navigate to edit page
  };

  const handleDelete = (managerId) => {
    console.log('Deleting manager:', managerId);
    // API call to delete manager
  };

  const handleRestore = (managerId) => {
    console.log('Restoring manager:', managerId);
    // API call to restore manager
  };

  const handleViewDetails = (managerId) => {
    console.log('Viewing details for manager:', managerId);
    // Navigate to details page
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unverified': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const renderManagerCard = (manager, type) => (
    <motion.div 
      key={manager.id} 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src={manager.avatar} 
                alt={manager.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{manager.name}</h3>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span className="font-medium">{manager.position}</span>
                <span className="text-gray-400">•</span>
                <span>{manager.company}</span>
              </p>
              <p className="text-blue-600 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {manager.email}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{manager.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{manager.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span><strong>Registered:</strong> {manager.registeredDate}</span>
            </div>
            {manager.verifiedDate && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span><strong>Verified:</strong> {manager.verifiedDate}</span>
              </div>
            )}
            {manager.rejectedDate && (
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span><strong>Rejected:</strong> {manager.rejectedDate}</span>
              </div>
            )}
            {manager.archivedDate && (
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-gray-600" />
                <span><strong>Archived:</strong> {manager.archivedDate}</span>
              </div>
            )}
            {type === 'verified' && (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span><strong>Total Jobs:</strong> {manager.jobsPosted}</span>
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
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(manager.status)}`}>
            {manager.status === 'unverified' && <Clock className="w-4 h-4 mr-1" />}
            {manager.status === 'verified' && <CheckCircle className="w-4 h-4 mr-1" />}
            {manager.status === 'rejected' && <XCircle className="w-4 h-4 mr-1" />}
            {manager.status === 'archived' && <UserX className="w-4 h-4 mr-1" />}
            {manager.status}
          </span>
          {type === 'verified' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <UserCheck className="w-4 h-4 mr-1" />
              {manager.activeJobs} active jobs
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {type === 'unverified' && (
          <>
            <motion.button
              onClick={() => handleReject(manager.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </motion.button>
            <motion.button
              onClick={() => handleVerify(manager.id)}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle className="w-4 h-4" />
              Verify
            </motion.button>
            <motion.button
              onClick={() => handleViewDetails(manager.id)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              View Details
            </motion.button>
          </>
        )}
        {type === 'verified' && (
          <>
            <motion.button
              onClick={() => handleEdit(manager.id)}
              className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>
            <motion.button
              onClick={() => handleDelete(manager.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
            <motion.button
              onClick={() => handleViewDetails(manager.id)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              View Profile
            </motion.button>
          </>
        )}
        {type === 'rejected' && (
          <>
            <motion.button
              onClick={() => handleDelete(manager.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Delete Permanently
            </motion.button>
            <motion.button
              onClick={() => handleViewDetails(manager.id)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              View Details
            </motion.button>
          </>
        )}
        {type === 'archived' && (
          <>
            <motion.button
              onClick={() => handleRestore(manager.id)}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              Restore
            </motion.button>
            <motion.button
              onClick={() => handleDelete(manager.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
            <motion.button
              onClick={() => handleViewDetails(manager.id)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              View History
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );

  const getCurrentManagers = () => {
    switch (activeTab) {
      case 'unverified': return unverifiedManagers;
      case 'verified': return verifiedManagers;
      case 'rejected': return rejectedManagers;
      case 'archived': return archivedManagers;
      default: return [];
    }
  };

  const filteredManagers = getCurrentManagers().filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.position.toLowerCase().includes(searchTerm.toLowerCase())
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
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-yellow-100 mx-auto mb-4 w-fit">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{unverifiedManagers.length}</div>
            <div className="text-gray-600 font-medium">Pending Verification</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-green-100 mx-auto mb-4 w-fit">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{verifiedManagers.length}</div>
            <div className="text-gray-600 font-medium">Verified Managers</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-red-100 mx-auto mb-4 w-fit">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{rejectedManagers.length}</div>
            <div className="text-gray-600 font-medium">Rejected</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-gray-100 mx-auto mb-4 w-fit">
              <UserX className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{archivedManagers.length}</div>
            <div className="text-gray-600 font-medium">Archived</div>
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
              { key: 'unverified', label: 'Unverified', icon: <Clock className="w-4 h-4" />, count: unverifiedManagers.length },
              { key: 'verified', label: 'Verified', icon: <CheckCircle className="w-4 h-4" />, count: verifiedManagers.length },
              { key: 'rejected', label: 'Rejected', icon: <XCircle className="w-4 h-4" />, count: rejectedManagers.length },
              { key: 'archived', label: 'Archived', icon: <UserX className="w-4 h-4" />, count: archivedManagers.length }
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
              {activeTab === 'unverified' && <Clock className="w-6 h-6 text-yellow-600" />}
              {activeTab === 'verified' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {activeTab === 'rejected' && <XCircle className="w-6 h-6 text-red-600" />}
              {activeTab === 'archived' && <UserX className="w-6 h-6 text-gray-600" />}
              {activeTab === 'unverified' && 'Managers Pending Verification'}
              {activeTab === 'verified' && 'Verified Hiring Managers'}
              {activeTab === 'rejected' && 'Rejected Managers'}
              {activeTab === 'archived' && 'Archived Managers'}
            </h2>
          </div>
          
          <div className="p-6">
            {filteredManagers.length > 0 ? (
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
    </div>
  );
};

export default JPA_HeroManagers;