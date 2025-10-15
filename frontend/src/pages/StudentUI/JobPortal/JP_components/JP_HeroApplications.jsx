import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
  AlertCircle,
  Trash2
} from 'lucide-react'
import api from '../../../../lib/axios'
import JobDetailsPopup from './JobDetailsPopup'

function JP_HeroApplications({ user }) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('studentToken')
        
        if (!token) {
          setError('Please log in to view your applications')
          setLoading(false)
          return
        }

        console.log('Fetching student applications...')
        const response = await api.get('/job-applications/student/my-applications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.data.success) {
          console.log('Applications fetched successfully:', response.data.data)
          setApplications(response.data.data)
          setError(null)
        } else {
          setError('Failed to fetch applications')
        }
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError('Failed to fetch applications. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // Handle View Details button click
  const handleViewDetails = (jobId) => {
    console.log('Viewing details for job:', jobId)
    setSelectedJobId(jobId)
    setIsPopupOpen(true)
  }

  // Handle popup close
  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedJobId(null)
  }

  // Handle application success (when user applies from popup)
  const handleApplicationSuccess = () => {
    console.log('Application submitted successfully from popup')
    // Refresh applications list
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('studentToken')
        if (!token) return

        const response = await api.get('/job-applications/student/my-applications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.data.success) {
          setApplications(response.data.data)
        }
      } catch (err) {
        console.error('Error refreshing applications:', err)
      }
    }
    fetchApplications()
  }

  // Handle delete application
  const handleDeleteApplication = (application) => {
    setApplicationToDelete(application)
    setDeleteConfirmOpen(true)
  }

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return

    try {
      setDeleting(true)
      const token = localStorage.getItem('studentToken')
      
      if (!token) {
        alert('Please log in to delete applications')
        return
      }

      console.log('Deleting application:', applicationToDelete.id)
      const response = await api.delete(`/job-applications/${applicationToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        alert('Application deleted successfully!')
        // Remove the deleted application from the list
        setApplications(prev => prev.filter(app => app._id !== applicationToDelete.id))
        setDeleteConfirmOpen(false)
        setApplicationToDelete(null)
      } else {
        alert('Failed to delete application. Please try again.')
      }
    } catch (err) {
      console.error('Error deleting application:', err)
      alert('Failed to delete application. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  // Handle delete cancel
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false)
    setApplicationToDelete(null)
  }

  // Transform backend data to frontend format
  const transformApplication = (app) => {
    return {
      id: app._id,
      jobId: app.jobId?._id, // Add jobId for popup
      jobTitle: app.jobId?.title || 'Unknown Job',
      company: app.jobId?.department || 'Unknown Department',
      status: app.status,
      appliedDate: new Date(app.appliedAt).toLocaleDateString(),
      deadline: app.jobId?.deadline ? new Date(app.jobId.deadline).toLocaleDateString() : 'N/A',
      location: app.jobId?.location || 'Unknown Location',
      salary: app.jobId?.compensation ? `$${app.jobId.compensation}/hr` : 'Not specified',
      description: app.jobId?.desc || 'No description available',
      lastUpdated: new Date(app.updatedAt).toLocaleDateString(),
      notes: app.hiringManagerNotes || 'No updates yet',
      coverLetter: app.coverLetter || '',
      resume: app.resume || '',
      studentName: app.studentName || '',
      studentEmail: app.studentEmail || ''
    }
  }

  // Sample applications data (fallback)
  const sampleApplications = [
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
      case 'hired': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'in-progress': return <Eye className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'hired': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'approved': return 'Approved'
      case 'hired': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return 'Unknown'
    }
  }

  // Transform applications for display
  const transformedApplications = applications.map(transformApplication)

  const filteredApplications = transformedApplications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         app.status === statusFilter || 
                         (statusFilter === 'approved' && app.status === 'hired')
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: transformedApplications.length,
    pending: transformedApplications.filter(app => app.status === 'pending').length,
    approved: transformedApplications.filter(app => app.status === 'approved' || app.status === 'hired').length,
    rejected: transformedApplications.filter(app => app.status === 'rejected').length
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

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error Loading Applications</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8"
          >
          {[
            { label: 'Total', count: statusCounts.all, color: 'bg-gray-500', icon: FileText },
            { label: 'Pending', count: statusCounts.pending, color: 'bg-yellow-500', icon: Clock },
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
        )}

        {/* Search and Filter Section */}
        {!loading && !error && (
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </motion.div>
        )}

        {/* Applications List */}
        {!loading && !error && (
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
                      <button 
                        onClick={() => handleViewDetails(application.jobId)}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200 hover:opacity-90" 
                        style={{ backgroundColor: '#fc944c' }}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button 
                        onClick={() => handleDeleteApplication(application)}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200 hover:opacity-90 bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
        )}

        {/* Quick Actions */}
        {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to apply for more jobs?</h3>
            <p className="text-gray-600 mb-6">Explore new opportunities and expand your career prospects.</p>
            <button 
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center gap-2 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl" 
              style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
            >
              Browse Available Jobs
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
        )}

        {/* Delete Confirmation Popup */}
        {deleteConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Application
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete your application for{' '}
                  <span className="font-medium">{applicationToDelete?.jobTitle}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleCancelDelete}
                    disabled={deleting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                  >
                    {deleting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      'Delete Application'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Job Details Popup */}
        <JobDetailsPopup
          jobId={selectedJobId}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          user={user}
          onApplicationSuccess={handleApplicationSuccess}
        />
      </div>
    </div>
  )
}

export default JP_HeroApplications