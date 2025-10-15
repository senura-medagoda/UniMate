import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  MoreVertical,
  AlertCircle,
  Loader2,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  BookOpen,
  Building,
  UserCheck
} from 'lucide-react';
import api from '../../../lib/axios';

const SA_HeroStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/students');
        setStudents(response.data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle delete student
  const handleDeleteStudent = async (studentId, studentName) => {
    setStudentToDelete({ id: studentId, name: studentName });
    setShowDeleteModal(true);
  };

  const confirmDeleteStudent = async () => {
    if (studentToDelete) {
      try {
        setActionLoading(studentToDelete.id);
        await api.delete(`/students/${studentToDelete.id}`);
        setStudents(students.filter(student => student._id !== studentToDelete.id));
        setShowDeleteModal(false);
        setStudentToDelete(null);
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Failed to delete student. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const cancelDeleteStudent = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  // Handle view student details
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
  };

  // Handle authenticated document viewing
  const handleViewDocument = async (documentUrl) => {
    try {
      setDocumentLoading(true);
      
      // Get the authentication token
      const token = localStorage.getItem('saToken');
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      // Create a blob URL with authentication
      const response = await fetch(documentUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Open the document in a new tab
      window.open(blobUrl, '_blank');
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000);
      
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Failed to load document. Please try downloading it instead.');
    } finally {
      setDocumentLoading(false);
    }
  };

  // Handle verify student
  const handleVerifyStudent = async (studentEmail, studentName) => {
    try {
      setActionLoading(studentEmail);
      await api.put(`/students/verify/${encodeURIComponent(studentEmail)}`);
      
      // Update the student status in the local state
      setStudents(students.map(student => 
        student.s_email === studentEmail 
          ? { ...student, s_status: 'Verified' }
          : student
      ));
    } catch (err) {
      console.error('Error verifying student:', err);
      alert('Failed to verify student. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reject student
  const handleRejectStudent = async (studentEmail, studentName) => {
    try {
      setActionLoading(studentEmail);
      await api.put(`/students/reject/${encodeURIComponent(studentEmail)}`);
      
      // Update the student status in the local state
      setStudents(students.map(student => 
        student.s_email === studentEmail 
          ? { ...student, s_status: 'Rejected' }
          : student
      ));
    } catch (err) {
      console.error('Error rejecting student:', err);
      alert('Failed to reject student. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.s_fname} ${student.s_lname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         student.s_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.s_uniID.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map database status to filter values
    let studentStatus = 'unverified';
    if (student.s_status === 'Unverified') studentStatus = 'unverified';
    else if (student.s_status === 'Verified') studentStatus = 'verified';
    else if (student.s_status === 'Rejected') studentStatus = 'rejected';
    else if (student.s_status === 'Pending') studentStatus = 'pending';
    
    const matchesFilter = filterStatus === 'all' || studentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50 border-green-200'
      case 'unverified': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />
      case 'unverified': return <AlertCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  };

  const stats = {
    total: students.length,
    verified: students.filter(s => s.s_status === 'Verified').length,
    unverified: students.filter(s => s.s_status === 'Unverified').length,
    pending: students.filter(s => s.s_status === 'Pending').length,
    rejected: students.filter(s => s.s_status === 'Rejected').length
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
              Student <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Management</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Verify student registrations, manage user accounts, and oversee the student verification process.
            </p>
          </div>
          <motion.div
            className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <GraduationCap className="w-6 h-6 text-orange-600" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Students</div>
              <div className="font-semibold text-gray-900">{stats.total}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <GraduationCap className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Students</h3>
            <p className="text-xs text-gray-500">All registered users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <CheckCircle className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.verified}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Verified</h3>
            <p className="text-xs text-gray-500">Approved students</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.unverified}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Unverified</h3>
            <p className="text-xs text-gray-500">Not yet verified</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending</h3>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <XCircle className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.rejected}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Rejected</h3>
            <p className="text-xs text-gray-500">Not approved</p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unverified">Unverified</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#fc944c' }} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Students...</h3>
            <p className="text-gray-600">Please wait while we fetch the student data.</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-red-200 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Students</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Students Table */}
        {!loading && !error && (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <GraduationCap className="w-6 h-6" style={{ color: '#fc944c' }} />
                Student List ({filteredStudents.length})
              </h2>
            </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student, index) => {
                  // Map database status to display status
                  let displayStatus = 'unverified';
                  if (student.s_status === 'Unverified') displayStatus = 'unverified';
                  else if (student.s_status === 'Verified') displayStatus = 'verified';
                  else if (student.s_status === 'Rejected') displayStatus = 'rejected';
                  else if (student.s_status === 'Pending') displayStatus = 'pending';
                  
                  return (
                    <motion.tr 
                      key={student._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.s_fname} {student.s_lname}</div>
                            <div className="text-sm text-gray-500">{student.s_email}</div>
                            <div className="text-xs text-gray-400">ID: {student.s_uniID}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{student.s_uni}</div>
                        <div className="text-sm text-gray-500">{student.s_phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(displayStatus)}`}>
                          {getStatusIcon(displayStatus)}
                          {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-200"
                            title="View Student Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(displayStatus === 'unverified' || displayStatus === 'pending') && (
                            <>
                              <button
                                onClick={() => handleVerifyStudent(student.s_email, `${student.s_fname} ${student.s_lname}`)}
                                disabled={actionLoading === student.s_email}
                                className="p-2 text-green-600 hover:text-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={displayStatus === 'pending' ? "Approve Student" : "Verify Student"}
                              >
                                {actionLoading === student.s_email ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleRejectStudent(student.s_email, `${student.s_fname} ${student.s_lname}`)}
                                disabled={actionLoading === student.s_email}
                                className="p-2 text-red-600 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject Student"
                              >
                                {actionLoading === student.s_email ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteStudent(student._id, `${student.s_fname} ${student.s_lname}`)}
                            disabled={actionLoading === student._id}
                            className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Student"
                          >
                            {actionLoading === student._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Student</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <strong>{studentToDelete?.name}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelDeleteStudent}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteStudent}
                    disabled={actionLoading === studentToDelete?.id}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {actionLoading === studentToDelete?.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Student'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Student Details Modal */}
        {showStudentModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedStudent.s_fname} {selectedStudent.s_lname}
                      </h2>
                      <p className="text-sm text-gray-500">Student Details</p>
                    </div>
                  </div>
                  <button
                    onClick={closeStudentModal}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-orange-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-600">{selectedStudent.s_email}</p>
                        </div>
                      </div>
                      {selectedStudent.s_phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Phone</p>
                            <p className="text-sm text-gray-600">{selectedStudent.s_phone}</p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.s_NIC && (
                        <div className="flex items-center gap-3">
                          <IdCard className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">NIC</p>
                            <p className="text-sm text-gray-600">{selectedStudent.s_NIC}</p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.s_gender && (
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Gender</p>
                            <p className="text-sm text-gray-600">{selectedStudent.s_gender}</p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.s_dob && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedStudent.s_dob).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.s_homeaddress && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Home Address</p>
                            <p className="text-sm text-gray-600">{selectedStudent.s_homeaddress}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-orange-600" />
                      Academic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">University</p>
                          <p className="text-sm text-gray-600">{selectedStudent.s_uni}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <IdCard className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Student ID</p>
                          <p className="text-sm text-gray-600">{selectedStudent.s_uniID}</p>
                        </div>
                      </div>
                      {selectedStudent.s_faculty && (
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Faculty</p>
                            <p className="text-sm text-gray-600">{selectedStudent.s_faculty}</p>
                          </div>
                        </div>
                      )}
                      {selectedStudent.s_studyprogram && (
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Study Program</p>
                            <p className="text-sm text-gray-600">{selectedStudent.s_studyprogram}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status and Registration Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(selectedStudent.s_status === 'Unverified' ? 'unverified' : selectedStudent.s_status === 'Verified' ? 'verified' : selectedStudent.s_status === 'Rejected' ? 'rejected' : 'pending')}`}>
                        {getStatusIcon(selectedStudent.s_status === 'Unverified' ? 'unverified' : selectedStudent.s_status === 'Verified' ? 'verified' : selectedStudent.s_status === 'Rejected' ? 'rejected' : 'pending')}
                        {selectedStudent.s_status}
                      </span>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Registration Date</p>
                      <p className="text-sm text-gray-600 mt-2">
                        {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-600 mt-2">
                        {selectedStudent.updatedAt ? new Date(selectedStudent.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ID Document */}
                {selectedStudent.s_id_document && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">ID Document</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {(() => {
                        const documentUrl = selectedStudent.s_id_document;
                        const isPDF = documentUrl.toLowerCase().includes('.pdf') || documentUrl.toLowerCase().includes('pdf');
                        const isImage = documentUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);
                        
                        if (isPDF) {
                          return (
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 text-center">
                                <div className="flex flex-col items-center space-y-3">
                                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">PDF Document</p>
                                    <p className="text-xs text-gray-500">Click to view or download</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={() => handleViewDocument(documentUrl)}
                                  disabled={documentLoading}
                                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {documentLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      View PDF
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleViewDocument(documentUrl)}
                                  disabled={documentLoading}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {documentLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      Download
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        } else if (isImage) {
                          return (
                            <img 
                              src={documentUrl} 
                              alt="Student ID Document" 
                              className="max-w-full h-auto rounded-lg shadow-sm"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          );
                        } else {
                          // Fallback for unknown file types
                          return (
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 text-center">
                                <div className="flex flex-col items-center space-y-3">
                                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Document</p>
                                    <p className="text-xs text-gray-500">Click to view or download</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={() => handleViewDocument(documentUrl)}
                                  disabled={documentLoading}
                                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {documentLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      View Document
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleViewDocument(documentUrl)}
                                  disabled={documentLoading}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {documentLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      Download
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        }
                      })()}
                      {/* Fallback for image loading errors */}
                      <div style={{ display: 'none' }} className="text-center text-gray-500">
                        <p>Document image not available</p>
                        <button 
                          onClick={() => handleViewDocument(selectedStudent.s_id_document)}
                          className="text-orange-600 hover:text-orange-700 underline bg-transparent border-none cursor-pointer"
                        >
                          View Document
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeStudentModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SA_HeroStudents;