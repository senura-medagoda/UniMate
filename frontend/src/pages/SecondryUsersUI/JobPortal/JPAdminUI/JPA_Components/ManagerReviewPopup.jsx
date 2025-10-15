import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar, 
  FileText, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  AlertCircle,
  Eye
} from 'lucide-react';

const ManagerReviewPopup = ({ isOpen, onClose, manager, onVerify, onReject, actionLoading }) => {
  if (!manager) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleDownloadDocument = () => {
    if (manager.proof_document) {
      // Create a download link for the proof document
      const link = document.createElement('a');
      link.href = `http://localhost:5001/uploads/${manager.proof_document}`;
      link.download = manager.proof_document_original_name || 'proof-document.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {getInitials(manager.hm_fname, manager.hm_lname)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {manager.hm_fname} {manager.hm_lname}
                    </h2>
                    <p className="text-orange-100">
                      {manager.position || 'Position not specified'} • {manager.hm_company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column - Personal Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{manager.hm_email}</p>
                        </div>
                      </div>
                      {manager.hm_phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{manager.hm_phone}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Registered</p>
                          <p className="font-medium text-gray-900">{formatDate(manager.createdAt)}</p>
                        </div>
                      </div>
                      {manager.lastLogin && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Last Login</p>
                            <p className="font-medium text-gray-900">{formatDate(manager.lastLogin)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-orange-600" />
                      Company Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Company Name</p>
                          <p className="font-medium text-gray-900">{manager.hm_company}</p>
                        </div>
                      </div>
                      {manager.hm_company_address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Company Address</p>
                            <p className="font-medium text-gray-900">{manager.hm_company_address}</p>
                          </div>
                        </div>
                      )}
                      {manager.department && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Department</p>
                            <p className="font-medium text-gray-900">{manager.department}</p>
                          </div>
                        </div>
                      )}
                      {manager.position && (
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Position</p>
                            <p className="font-medium text-gray-900">{manager.position}</p>
                          </div>
                        </div>
                      )}
                      {manager.hm_workID && (
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Work ID</p>
                            <p className="font-medium text-gray-900">{manager.hm_workID}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Proof Document */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      Proof Document (Service Letter)
                    </h3>
                    
                    {manager.proof_document ? (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {manager.proof_document_original_name || 'proof-document.pdf'}
                                </p>
                                <p className="text-sm text-gray-500">PDF Document</p>
                              </div>
                            </div>
                            <button
                              onClick={handleDownloadDocument}
                              className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-blue-800">Document Preview</p>
                              <p className="text-sm text-blue-700 mt-1">
                                Click the download button to view the complete service letter document.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800">No Document Uploaded</p>
                            <p className="text-sm text-red-700 mt-1">
                              This hiring manager has not uploaded a proof document.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      Verification Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          manager.hm_status === 'Unverified' ? 'bg-yellow-500' :
                          manager.hm_status === 'Verified' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-sm text-gray-600">Current Status</p>
                          <p className="font-medium text-gray-900">{manager.hm_status}</p>
                        </div>
                      </div>
                      {manager.loginCount !== undefined && (
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Login Count</p>
                            <p className="font-medium text-gray-900">{manager.loginCount || 0}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Review all information carefully before making a decision
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => onReject(manager._id)}
                    disabled={actionLoading[manager._id]}
                    className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => onVerify(manager._id)}
                    disabled={actionLoading[manager._id]}
                    className="px-6 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ManagerReviewPopup;
