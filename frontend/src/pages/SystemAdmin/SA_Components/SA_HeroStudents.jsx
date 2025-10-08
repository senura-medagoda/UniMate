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
  Trash2
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
                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-200"
                            title="View Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {displayStatus === 'unverified' && (
                            <>
                              <button
                                onClick={() => handleVerifyStudent(student.s_email, `${student.s_fname} ${student.s_lname}`)}
                                disabled={actionLoading === student.s_email}
                                className="p-2 text-green-600 hover:text-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Verify Student"
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
      </div>
    </div>
  );
};

export default SA_HeroStudents;