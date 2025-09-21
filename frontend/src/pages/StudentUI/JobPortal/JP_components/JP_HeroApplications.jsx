import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Filter,
  Search,
  ArrowRight,
  AlertCircle
} from 'lucide-react'

function JP_HeroApplications() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Sample applications data
  const applications = [
    {
      id: 1,
      jobTitle: 'Software Developer Intern',
      company: 'Tech Solutions Inc.',
      status: 'pending',
      appliedDate: '2024-01-15',
      deadline: '2024-01-30',
      location: 'Remote',
      salary: '$20/hr',
      description: 'Full-stack development internship focusing on React and Node.js',
      lastUpdated: '2 days ago',
      notes: 'Application under review by HR team'
    },
    {
      id: 2,
      jobTitle: 'Campus Tour Guide',
      company: 'University Admissions',
      status: 'in-progress',
      appliedDate: '2024-01-10',
      deadline: '2024-01-25',
      location: 'Main Campus',
      salary: '$15/hr',
      description: 'Lead campus tours for prospective students and families',
      lastUpdated: '1 day ago',
      notes: 'Interview scheduled for next week'
    },
    {
      id: 3,
      jobTitle: 'Research Assistant - Biology',
      company: 'Biology Department',
      status: 'approved',
      appliedDate: '2024-01-05',
      deadline: '2024-01-20',
      location: 'Science Building',
      salary: '$18/hr',
      description: 'Assist with ongoing research projects in molecular biology',
      lastUpdated: '3 days ago',
      notes: 'Congratulations! You got the position'
    },
    {
      id: 4,
      jobTitle: 'Social Media Assistant',
      company: 'Marketing Department',
      status: 'rejected',
      appliedDate: '2024-01-01',
      deadline: '2024-01-15',
      location: 'Remote',
      salary: '$16/hr',
      description: 'Create content for university social media channels',
      lastUpdated: '5 days ago',
      notes: 'Position filled by another candidate'
    },
    {
      id: 5,
      jobTitle: 'Math Tutor',
      company: 'Student Success Center',
      status: 'pending',
      appliedDate: '2024-01-12',
      deadline: '2024-01-28',
      location: 'Learning Commons',
      salary: '$14/hr',
      description: 'Tutor students in introductory math courses',
      lastUpdated: '1 day ago',
      notes: 'Application received, review in progress'
    },
    {
      id: 6,
      jobTitle: 'Cafeteria Staff',
      company: 'Food Services',
      status: 'in-progress',
      appliedDate: '2024-01-08',
      deadline: '2024-01-22',
      location: 'Student Union',
      salary: '$12/hr',
      description: 'Serve food and maintain cleanliness in dining facilities',
      lastUpdated: '4 hours ago',
      notes: 'Background check in progress'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'in-progress': return <Eye className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'in-progress': return 'In Progress'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return 'Unknown'
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    'in-progress': applications.filter(app => app.status === 'in-progress').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
            My Job{' '}
            <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Applications
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Track and manage all your job applications in one place. Stay updated on your application status and never miss an opportunity.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-8"
        >
          {[
            { label: 'Total', count: statusCounts.all, color: 'bg-gray-500', icon: FileText },
            { label: 'Pending', count: statusCounts.pending, color: 'bg-yellow-500', icon: Clock },
            { label: 'In Progress', count: statusCounts['in-progress'], color: 'bg-blue-500', icon: Eye },
            { label: 'Approved', count: statusCounts.approved, color: 'bg-green-500', icon: CheckCircle },
            { label: 'Rejected', count: statusCounts.rejected, color: 'bg-red-500', icon: XCircle }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${stat.color} mb-3`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{stat.count}</div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-4 sm:space-y-6"
        >
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                            {application.jobTitle}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{application.company}</span>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {getStatusText(application.status)}
                        </div>
                      </div>
                      
                      {/* Job Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">{application.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">{application.salary}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">Applied {application.appliedDate}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {application.description}
                      </p>
                      
                      {/* Notes */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Status Update:</span> {application.notes}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Last updated: {application.lastUpdated}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                      <button className="flex items-center justify-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200" style={{ backgroundColor: '#fc944c' }}>
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to apply for more jobs?</h3>
            <p className="text-gray-600 mb-6">Explore new opportunities and expand your career prospects.</p>
            <button className="inline-flex items-center gap-2 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}>
              Browse Available Jobs
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default JP_HeroApplications