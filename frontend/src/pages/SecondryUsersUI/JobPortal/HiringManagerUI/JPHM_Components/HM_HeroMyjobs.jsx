import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Eye, 
  Edit, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  TrendingUp
} from 'lucide-react';

function HM_HeroMyjobs() {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');

  // dummy data -- Temp
  const [jobs] = useState({
    current: [
      {
        id: 1,
        title: 'Software Developer Intern',
        department: 'Computer Science',
        applications: 24,
        views: 156,
        datePosted: '2023-10-15',
        status: 'active',
        deadline: '2023-11-15',
        location: 'Main Campus',
        salary: '$20/hr',
        type: 'Internship'
      },
      {
        id: 2,
        title: 'Research Assistant - Biology',
        department: 'Biology Department',
        applications: 18,
        views: 132,
        datePosted: '2023-10-10',
        status: 'active',
        deadline: '2023-11-10',
        location: 'Science Building',
        salary: '$18/hr',
        type: 'Research'
      },
      {
        id: 3,
        title: 'Campus Tour Guide',
        department: 'Admissions Office',
        applications: 32,
        views: 245,
        datePosted: '2023-10-05',
        status: 'active',
        deadline: '2023-11-05',
        location: 'Main Campus',
        salary: '$15/hr',
        type: 'Part-Time'
      }
    ],
    pending: [
      {
        id: 4,
        title: 'IT Support Specialist',
        department: 'IT Services',
        applications: 0,
        views: 42,
        datePosted: '2023-10-20',
        status: 'pending',
        deadline: '2023-11-20',
        location: 'Tech Building',
        salary: '$22/hr',
        type: 'Full-Time'
      },
      {
        id: 5,
        title: 'Social Media Coordinator',
        department: 'Marketing',
        applications: 0,
        views: 28,
        datePosted: '2023-10-18',
        status: 'pending',
        deadline: '2023-11-18',
        location: 'Remote',
        salary: '$16/hr',
        type: 'Part-Time'
      }
    ],
    previous: [
      {
        id: 6,
        title: 'Library Assistant',
        department: 'Library Services',
        applications: 15,
        views: 89,
        datePosted: '2023-09-15',
        status: 'closed',
        deadline: '2023-10-15',
        location: 'Main Library',
        salary: '$14/hr',
        type: 'Work-Study',
        hired: '2'
      },
      {
        id: 7,
        title: 'Lab Technician',
        department: 'Chemistry',
        applications: 22,
        views: 156,
        datePosted: '2023-09-01',
        status: 'closed',
        deadline: '2023-10-01',
        location: 'Chemistry Lab',
        salary: '$19/hr',
        type: 'Research',
        hired: '1'
      }
    ]
  });

  const handleNewJob = () => {
    // In a real app, this would navigate to a job creation form
    console.log('Creating new job...');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Active'
      },
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: <Clock className="w-4 h-4" />,
        text: 'Pending'
      },
      closed: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: <XCircle className="w-4 h-4" />,
        text: 'Closed'
      }
    };

    const config = statusConfig[status] || statusConfig.closed;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getJobTypeColor = (type) => {
    const typeColors = {
      'Internship': 'bg-blue-100 text-blue-800',
      'Research': 'bg-purple-100 text-purple-800',
      'Part-Time': 'bg-green-100 text-green-800',
      'Full-Time': 'bg-orange-100 text-orange-800',
      'Work-Study': 'bg-indigo-100 text-indigo-800'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  const renderJobCard = (job) => (
    <motion.div 
      key={job.id} 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              {getStatusBadge(job.status)}
            </div>
            <p className="text-gray-600 mb-2">{job.department}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getJobTypeColor(job.type)}`}>
              {job.type}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-900">{job.applications}</span>
            <span className="text-gray-600">Applications</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-900">{job.views}</span>
            <span className="text-gray-600">Views</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Posted: {job.datePosted}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Deadline: {job.deadline}</span>
          </div>
          {job.hired && (
            <div className="col-span-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-green-600">{job.hired}</span>
              <span className="text-gray-600">Candidates Hired</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button 
            className="flex-1 py-2 px-4 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            style={{ 
              background: job.status === 'active' 
                ? 'linear-gradient(to right, #fc944c, #f97316)' 
                : job.status === 'pending' 
                ? 'linear-gradient(to right, #f59e0b, #d97706)'
                : 'linear-gradient(to right, #6b7280, #4b5563)'
            }}
          >
            {job.status === 'active' ? (
              <>
                <Edit className="w-4 h-4" />
                Manage
              </>
            ) : job.status === 'pending' ? (
              <>
                <Edit className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Reopen
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const filteredJobs = jobs[activeTab].filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabCounts = {
    current: jobs.current.length,
    pending: jobs.pending.length,
    previous: jobs.previous.length
  };

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
              My <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Job Listings</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage your current, pending, and previous job postings. Track applications and optimize your recruitment process.
            </p>
          </div>
          <motion.button
            onClick={handleNewJob}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <Link to="/addnewjob" className="flex items-center gap-2">
              Add New Job
            </Link>
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { key: 'current', label: 'Current Jobs', icon: <Briefcase className="w-4 h-4" /> },
            { key: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
            { key: 'previous', label: 'Previous', icon: <TrendingUp className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={{
                background: activeTab === tab.key 
                  ? 'linear-gradient(to right, #fc944c, #f97316)' 
                  : 'transparent'
              }}
            >
              {tab.icon}
              {tab.label}
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map(renderJobCard)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {activeTab === 'current' && 'No active job listings'}
                {activeTab === 'pending' && 'No pending job listings'}
                {activeTab === 'previous' && 'No previous job listings'}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'current' && 'Get started by creating your first job posting'}
                {activeTab === 'pending' && 'All your job postings have been approved'}
                {activeTab === 'previous' && 'No completed job postings yet'}
              </p>
              {activeTab === 'current' && (
                <button 
                  onClick={handleNewJob}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create New Job
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default HM_HeroMyjobs;