import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function ApplicantProfilePopup({ isOpen, onClose, applicant }) {
  if (!isOpen || !applicant) return null;

  // Debug: Log the applicant data to see what we're receiving
  console.log('ApplicantProfilePopup: Received applicant data:', applicant);
  
  // Debug: Show what fields are available
  console.log('Available fields:', Object.keys(applicant));
  console.log('Student data:', {
    studentName: applicant.studentName,
    studentEmail: applicant.studentEmail,
    studentPhone: applicant.studentPhone,
    studentHomeAddress: applicant.studentHomeAddress,
    studentUni: applicant.studentUni,
    studentFaculty: applicant.studentFaculty,
    studentStudyProgram: applicant.studentStudyProgram,
    studentFirstName: applicant.studentFirstName,
    studentLastName: applicant.studentLastName,
    studentGender: applicant.studentGender,
    studentDob: applicant.studentDob,
    studentStatus: applicant.studentStatus
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Verified': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Verified'
      },
      'Unverified': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'Unverified'
      }
    };
    return configs[status] || configs.Unverified;
  };

  const statusConfig = getStatusConfig(applicant.studentStatus);

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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {applicant.studentName?.split(' ').map(n => n[0]).join('') || '??'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {applicant.studentName || 'Unknown Student'}
                    </h2>
                    <p className="text-gray-600">{applicant.position || 'Unknown Position'}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                  {statusConfig.icon}
                  {statusConfig.text}
                </span>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">
                        {applicant.studentFirstName && applicant.studentLastName 
                          ? `${applicant.studentFirstName} ${applicant.studentLastName}`
                          : applicant.studentName || '-'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{applicant.studentEmail || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{applicant.studentPhone || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Home Address</p>
                      <p className="font-medium text-gray-900">{applicant.studentHomeAddress || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">{formatDate(applicant.studentDob)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium text-gray-900">{applicant.studentGender || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">University</p>
                      <p className="font-medium text-gray-900">{applicant.studentUni || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Faculty</p>
                      <p className="font-medium text-gray-900">{applicant.studentFaculty || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Study Program</p>
                      <p className="font-medium text-gray-900">{applicant.studentStudyProgram || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Verification Status</p>
                      <p className="font-medium text-gray-900">{applicant.studentStatus || 'Unverified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Information */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Application Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Applied Position</p>
                      <p className="font-medium text-gray-900">{applicant.position || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Applied Date</p>
                      <p className="font-medium text-gray-900">{applicant.appliedDate || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Application Status</p>
                      <p className="font-medium text-gray-900 capitalize">{applicant.status || 'Pending'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Match Score</p>
                      <p className="font-medium text-gray-900">{applicant.match || 0}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {applicant.notes && (
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Notes
                  </h3>
                  <p className="text-gray-700 bg-white p-4 rounded-lg border">
                    {applicant.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (applicant.resume) {
                      const resumeUrl = `http://localhost:5001/uploads/${applicant.resume}`;
                      window.open(resumeUrl, '_blank');
                    }
                  }}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
                >
                  Download Resume
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ApplicantProfilePopup;
