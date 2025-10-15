import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useHMAuth } from '@/context/HMAuthContext'
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Star,
  User,
  GraduationCap,
  Award,
  ArrowRight,
  Users,
  TrendingUp,
  Target
} from 'lucide-react'
import ApplicantProfilePopup from './ApplicantProfilePopup'
import CoverLetterPopup from './CoverLetterPopup'

function HM_HeroApplicants({ user }) {
  const { hm, token, makeAuthenticatedRequest } = useHMAuth();
  const [selectedJob, setSelectedJob] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isCoverLetterPopupOpen, setIsCoverLetterPopupOpen] = useState(false);

  const [jobs, setJobs] = useState([
    { id: 'all', title: 'All Positions' }
  ]);

  const [applicants, setApplicants] = useState([]);

  // Fetch HM's jobs
  const fetchJobs = async () => {
    try {
      const response = await makeAuthenticatedRequest('http://localhost:5001/api/job/my-jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const jobsList = [
            { id: 'all', title: 'All Positions' },
            ...result.data.map(job => ({
              id: job._id,
              title: job.title,
              department: job.department
            }))
          ];
          setJobs(jobsList);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus, notes = '') => {
    try {
      const response = await makeAuthenticatedRequest(`http://localhost:5001/api/job-applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          notes: notes
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update the local state
          setApplicants(prevApplicants => 
            prevApplicants.map(applicant => 
              applicant.id === applicationId 
                ? { ...applicant, status: newStatus, notes: notes }
                : applicant
            )
          );
          console.log('Application status updated successfully');
        } else {
          console.error('Failed to update application status:', result.message);
        }
      } else {
        console.error('Failed to update application status');
      }
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  // Handle opening profile popup
  const handleViewProfile = (applicant) => {
    setSelectedApplicant(applicant);
    setIsProfilePopupOpen(true);
  };

  // Handle closing profile popup
  const handleCloseProfile = () => {
    setIsProfilePopupOpen(false);
    setSelectedApplicant(null);
  };

  // Handle opening cover letter popup
  const handleViewCoverLetter = (applicant) => {
    setSelectedApplicant(applicant);
    setIsCoverLetterPopupOpen(true);
  };

  // Handle closing cover letter popup
  const handleCloseCoverLetter = () => {
    setIsCoverLetterPopupOpen(false);
    setSelectedApplicant(null);
  };

  // Fetch applicants data on component mount
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!token || !hm) {
        console.log('HM_HeroApplicants: No token or HM data available');
        console.log('Token available:', !!token);
        console.log('HM data available:', !!hm);
        setError('Please log in to view applicants');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch jobs first
        await fetchJobs();
        
        console.log('HM_HeroApplicants: Fetching applicants for HM:', hm.hm_email);
        console.log('HM_HeroApplicants: Token available:', !!token);
        console.log('HM_HeroApplicants: Making request to: http://localhost:5001/api/job-applications/hm-applicants');

        const response = await makeAuthenticatedRequest('http://localhost:5001/api/job-applications/hm-applicants', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('HM_HeroApplicants: Response status:', response.status);
        const result = await response.json();
        console.log('HM_HeroApplicants: Response result:', result);
        
        // Debug: Log the first application to see the data structure
        if (result.data && result.data.length > 0) {
          console.log('HM_HeroApplicants: First application data structure:', result.data[0]);
          console.log('HM_HeroApplicants: StudentId data:', result.data[0].studentId);
        }
        
        if (response.ok && result.success) {
          // Check if there are any applications
          if (result.data && result.data.length > 0) {
            // Transform the data to match the expected format
            const transformedApplicants = result.data.map(app => ({
              id: app._id,
              name: app.studentName,
              email: app.studentEmail,
              phone: app.studentPhone || 'N/A',
              position: app.jobId?.title || 'Unknown Position',
              department: app.jobId?.department || 'Unknown Department',
              appliedDate: new Date(app.appliedAt).toLocaleDateString(),
              status: app.status,
              location: app.jobId?.location || 'Remote',
              resume: app.resume,
              coverLetter: app.coverLetter,
              notes: app.notes,
              reviewedAt: app.reviewedAt,
              reviewedBy: app.reviewedBy,
              // Student profile details - from populated studentId
              studentName: app.studentName,
              studentEmail: app.studentEmail,
              studentPhone: app.studentPhone,
              studentHomeAddress: app.studentId?.s_homeaddress || '123 Main Street, Colombo, Sri Lanka',
              studentUni: app.studentId?.s_uni || 'University of Colombo',
              studentFaculty: app.studentId?.s_faculty || 'Faculty of Science',
              studentStudyProgram: app.studentId?.s_studyprogram || 'Computer Science',
              studentFirstName: app.studentId?.s_fname || app.studentName?.split(' ')[0] || 'John',
              studentLastName: app.studentId?.s_lname || app.studentName?.split(' ')[1] || 'Doe',
              studentGender: app.studentId?.s_gender || 'Male',
              studentDob: app.studentId?.s_dob || '2000-01-01',
              studentStatus: app.studentId?.s_status || 'Verified'
            }));
            
            setApplicants(transformedApplicants);
            console.log('HM_HeroApplicants: Successfully loaded', transformedApplicants.length, 'applicants');
          } else {
            // No applications found
            console.log('No applications found for this hiring manager');
            setApplicants([]);
          }
        } else {
          setError(result.message || 'Failed to fetch applicants');
        }

        setLoading(false);
      } catch (err) {
        console.error('HM_HeroApplicants: Error fetching applicants:', err);
        setError(err.message || 'Failed to fetch applicants');
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [token, hm, makeAuthenticatedRequest]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: <Clock className="w-4 h-4" />,
        text: 'Pending'
      },
      shortlisted: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: <Star className="w-4 h-4" />,
        text: 'Shortlisted'
      },
      hired: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Approved'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: <XCircle className="w-4 h-4" />,
        text: 'Rejected'
      }
    };
    return configs[status] || configs.pending;
  };


  const filteredApplicants = applicants.filter(applicant => {
    const matchesJob = selectedJob === 'all' || applicant.position === jobs.find(j => j.id === selectedJob)?.title;
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  const statusCounts = {
    pending: applicants.filter(a => a.status === 'pending').length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
    hired: applicants.filter(a => a.status === 'hired').length,
    rejected: applicants.filter(a => a.status === 'rejected').length
  };

  const renderApplicantCard = (applicant, index) => {
    const statusConfig = getStatusConfig(applicant.status);
    
    return (
      <motion.div
        key={applicant.id}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        whileHover={{ y: -2 }}
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left Column - Basic Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {applicant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{applicant.name}</h3>
                    <p className="text-gray-600">{applicant.position}</p>
                    <p className="text-sm text-gray-500">{applicant.university} • {applicant.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                    {statusConfig.icon}
                    {statusConfig.text}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{applicant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{applicant.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Applied: {applicant.appliedDate}</span>
                </div>
              </div>


              {/* Notes */}
              {applicant.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{applicant.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Actions */}
            <div className="lg:w-48 flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleViewProfile(applicant)}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Profile
                </button>
                <button 
                  onClick={() => {
                    if (applicant.resume) {
                      const resumeUrl = `http://localhost:5001/uploads/${applicant.resume}`;
                      window.open(resumeUrl, '_blank');
                    }
                  }}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
                <button 
                  onClick={() => handleViewCoverLetter(applicant)}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Cover Letter
                  </button>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateApplicationStatus(applicant.id, 'hired', 'Application accepted')}
                    className="flex-1 py-2 px-3 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-1"
                    style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </button>
                  <button 
                    onClick={() => updateApplicationStatus(applicant.id, 'rejected', 'Application rejected')}
                    className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading applicants...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Applicants</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200"
                style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Applications</span> Management
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Review and manage applicants for your positions. Find the best candidates for your team.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{applicants.length}</div>
              <div className="text-sm text-gray-600">Total Applicants</div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { key: 'pending', label: 'Pending', count: statusCounts.pending, color: 'bg-blue-500' },
            { key: 'shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted, color: 'bg-purple-500' },
            { key: 'hired', label: 'Approved', count: statusCounts.hired, color: 'bg-green-500' },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected, color: 'bg-red-500' }
          ].map((stat) => (
            <div key={stat.key} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Job Filter */}
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="hired">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Applicants List */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {applicants.length === 0 ? 'No Applicants Yet' : 'No applicants found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {applicants.length === 0 
                  ? 'You haven\'t received any job applications yet. Start by posting your first job to attract qualified candidates.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {applicants.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/addnewjob'}
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Target className="w-5 h-5" />
                  Post Your First Job
                </motion.button>
              )}
            </div>
          ) : (
            filteredApplicants.map(renderApplicantCard)
          )}
        </motion.div>
      </div>
      
      {/* Profile Popup */}
      <ApplicantProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={handleCloseProfile}
        applicant={selectedApplicant}
      />
      
      {/* Cover Letter Popup */}
      <CoverLetterPopup
        isOpen={isCoverLetterPopupOpen}
        onClose={handleCloseCoverLetter}
        applicant={selectedApplicant}
      />
    </div>
  );
}

export default HM_HeroApplicants;