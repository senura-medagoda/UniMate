import React, { useState } from 'react'
import { motion } from 'framer-motion'
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

function HM_HeroApplicants() {
  const [selectedJob, setSelectedJob] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [jobs] = useState([
    { id: 'all', title: 'All Positions' },
    { id: 1, title: 'Software Developer Intern', department: 'Computer Science' },
    { id: 2, title: 'Research Assistant - Biology', department: 'Biology Department' },
    { id: 3, title: 'Campus Tour Guide', department: 'Admissions Office' }
  ]);

  const [applicants] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Software Developer Intern',
      status: 'new',
      appliedDate: '2023-10-20',
      resume: 'sarah_johnson_resume.pdf',
      coverLetter: true,
      skills: ['JavaScript', 'React', 'Python'],
      match: 92,
      notes: 'Strong portfolio, previous internship experience',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      university: 'University of Technology',
      gpa: '3.8',
      year: 'Senior'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Software Developer Intern',
      status: 'reviewed',
      appliedDate: '2023-10-19',
      resume: 'michael_chen_resume.pdf',
      coverLetter: true,
      skills: ['Java', 'Spring Boot', 'SQL'],
      match: 87,
      notes: 'Good academic record, needs technical interview',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
      university: 'State University',
      gpa: '3.6',
      year: 'Junior'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      position: 'Research Assistant - Biology',
      status: 'interview',
      appliedDate: '2023-10-18',
      resume: 'emma_rodriguez_resume.pdf',
      coverLetter: false,
      skills: ['Lab Techniques', 'Data Analysis', 'PCR'],
      match: 95,
      notes: 'Perfect match, has previous research experience',
      email: 'emma.rodriguez@email.com',
      phone: '(555) 345-6789',
      university: 'Research Institute',
      gpa: '3.9',
      year: 'Graduate'
    },
    {
      id: 4,
      name: 'James Wilson',
      position: 'Campus Tour Guide',
      status: 'offer',
      appliedDate: '2023-10-17',
      resume: 'james_wilson_resume.pdf',
      coverLetter: true,
      skills: ['Public Speaking', 'Leadership', 'Communication'],
      match: 89,
      notes: 'Excellent communication skills, offered position',
      email: 'james.wilson@email.com',
      phone: '(555) 456-7890',
      university: 'Community College',
      gpa: '3.7',
      year: 'Sophomore'
    },
    {
      id: 5,
      name: 'Lisa Park',
      position: 'Research Assistant - Biology',
      status: 'rejected',
      appliedDate: '2023-10-16',
      resume: 'lisa_park_resume.pdf',
      coverLetter: true,
      skills: ['Chemistry', 'Lab Safety', 'Research'],
      match: 78,
      notes: 'Good candidate but lacks specific lab experience',
      email: 'lisa.park@email.com',
      phone: '(555) 567-8901',
      university: 'Tech University',
      gpa: '3.5',
      year: 'Junior'
    }
  ]);

  const getStatusConfig = (status) => {
    const configs = {
      new: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'New'
      },
      reviewed: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: <Eye className="w-4 h-4" />,
        text: 'Reviewed'
      },
      interview: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: <Calendar className="w-4 h-4" />,
        text: 'Interview'
      },
      offer: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Offer'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: <XCircle className="w-4 h-4" />,
        text: 'Rejected'
      }
    };
    return configs[status] || configs.new;
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-600 bg-green-100';
    if (match >= 80) return 'text-yellow-600 bg-yellow-100';
    if (match >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesJob = selectedJob === 'all' || applicant.position === jobs.find(j => j.id === selectedJob)?.title;
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  const statusCounts = {
    new: applicants.filter(a => a.status === 'new').length,
    reviewed: applicants.filter(a => a.status === 'reviewed').length,
    interview: applicants.filter(a => a.status === 'interview').length,
    offer: applicants.filter(a => a.status === 'offer').length,
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
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(applicant.match)}`}>
                    {applicant.match}% Match
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
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">GPA: {applicant.gpa}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Applied: {applicant.appliedDate}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
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
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Profile
                </button>
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
                {applicant.coverLetter && (
                  <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Cover Letter
                  </button>
                )}
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-2 px-3 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-1"
                    style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </button>
                  <button className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1">
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
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { key: 'new', label: 'New', count: statusCounts.new, color: 'bg-blue-500' },
            { key: 'reviewed', label: 'Reviewed', count: statusCounts.reviewed, color: 'bg-yellow-500' },
            { key: 'interview', label: 'Interview', count: statusCounts.interview, color: 'bg-purple-500' },
            { key: 'offer', label: 'Offer', count: statusCounts.offer, color: 'bg-green-500' },
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
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
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
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No applicants found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredApplicants.map(renderApplicantCard)
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default HM_HeroApplicants;