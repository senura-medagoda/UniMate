import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../lib/axios';

const JobDetailsPopup = ({ jobId, isOpen, onClose, user, onApplicationSuccess }) => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null
  });
  const [isVerified, setIsVerified] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  // Fetch job details when popup opens
  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetails();
      fetchCurrentUserData();
      checkApplicationStatus();
    }
  }, [isOpen, jobId]);

  // Fetch current user data to get updated verification status
  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      if (!token) return;

      const response = await api.get('/stdlogin/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        // Update the user object with fresh data from backend
        const updatedUser = { ...user, ...response.data };
        console.log('Updated user data from backend:', updatedUser);
        checkVerificationStatus(updatedUser);
      }
    } catch (error) {
      console.error('Error fetching current user data:', error);
      // Fallback to checking with existing user object
      checkVerificationStatus();
    }
  };

  // Check if user has already applied for this job
  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      if (!token || !user) return;

      console.log('Checking application status for job:', jobId);
      
      const response = await api.get(`/job-applications/${jobId}/check-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setHasApplied(response.data.hasApplied);
        setApplicationStatus(response.data.application);
        console.log('Application status:', response.data.hasApplied ? 'Already applied' : 'Not applied');
      }
    } catch (error) {
      console.error('Error checking application status:', error);
      // Don't show error to user, just assume not applied
      setHasApplied(false);
    }
  };

  // Check student verification status
  const checkVerificationStatus = (userToCheck = user) => {
    console.log('=== VERIFICATION DEBUG ===');
    console.log('User object:', userToCheck);
    console.log('User s_status:', userToCheck?.s_status);
    console.log('User s_status type:', typeof userToCheck?.s_status);
    console.log('Is s_status === "Verified"?', userToCheck?.s_status === 'Verified');
    console.log('========================');
    
    // If user object doesn't have s_status, try to get it from localStorage or fetch from backend
    if (userToCheck && userToCheck.s_status === undefined) {
      console.log('⚠️ User object missing s_status field - this might be an old cached user');
      // Try to get from localStorage first
      const savedUser = localStorage.getItem('studentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.s_status) {
            console.log('Found s_status in localStorage:', parsedUser.s_status);
            userToCheck = { ...userToCheck, s_status: parsedUser.s_status };
          }
        } catch (error) {
          console.error('Error parsing saved user:', error);
        }
      }
    }
    
    if (userToCheck && userToCheck.s_status === 'Verified') {
      setIsVerified(true);
      console.log('✅ Student is verified - setting isVerified to true');
    } else {
      setIsVerified(false);
      console.log('❌ Student is not verified - setting isVerified to false, status:', userToCheck?.s_status);
    }
  };

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('studentToken');
      const response = await api.get(`/job/${jobId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setJob(response.data.data);
      } else {
        setError('Failed to fetch job details');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    console.log('=== APPLY BUTTON CLICKED ===');
    console.log('User:', user);
    console.log('Is Verified:', isVerified);
    console.log('Has Applied:', hasApplied);
    console.log('Resume:', applicationData.resume);
    console.log('Job ID:', jobId);
    
    if (!user) {
      alert('Please log in to apply for jobs');
      return;
    }

    if (hasApplied) {
      alert('You have already applied for this job');
      return;
    }

    if (!isVerified) {
      alert('Only verified students can apply for jobs. Please complete your verification process first.');
      return;
    }

    if (!applicationData.resume) {
      alert('Resume is required to apply for this job');
      return;
    }

    try {
      setApplying(true);
      setError(null);

      const token = localStorage.getItem('studentToken');
      console.log('Token available:', !!token);
      
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('studentId', user.id || user._id);
      formData.append('studentName', user.name || user.fullName);
      formData.append('studentEmail', user.email);
      formData.append('studentPhone', user.phone || '');
      formData.append('coverLetter', applicationData.coverLetter);
      
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      console.log('Making API call to:', `/job-applications/${jobId}/apply`);
      const response = await api.post(`/job-applications/${jobId}/apply`, formData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('API Response:', response.data);

      if (response.data.success) {
        alert('Application submitted successfully!');
        // Update application status
        setHasApplied(true);
        setApplicationStatus(response.data.data);
        onApplicationSuccess && onApplicationSuccess();
        onClose();
        // Redirect to jobs page after successful application
        navigate('/jobs');
      } else {
        setError(response.data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit application');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      setApplicationData(prev => ({ ...prev, resume: file }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading job details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchJobDetails}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : job ? (
            <div className="space-y-6">
              {/* Job Header */}
              <div className="border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium">{job.department}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>{job.compensation || 'Not specified'}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {job.jobtype}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    Apply by: {formatDate(job.deadline)}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Responsibilities</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.responsibilities}</p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Requirements</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Benefits</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.benefits}</p>
                  </div>
                </div>
              )}

              {/* Application Form */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Apply for this Position</h3>
                
                {/* Already Applied Status */}
                {hasApplied && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-green-800 font-medium">Application Submitted</p>
                        <p className="text-green-700 text-sm">You have already applied for this job. Your application is being reviewed.</p>
                        {applicationStatus && (
                          <p className="text-green-600 text-xs mt-1">
                            Applied on: {new Date(applicationStatus.appliedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Verification Status */}
                {!isVerified && !hasApplied && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="text-yellow-800 font-medium">Verification Required</p>
                        <p className="text-yellow-700 text-sm">Only verified students can apply for jobs. Please complete your verification process first.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Application Form - Only show if not already applied */}
                {!hasApplied && (
                  <div className="space-y-4">
                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter (Optional)
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        rows={4}
                        placeholder="Tell us why you're interested in this position..."
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                      />
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                          !applicationData.resume ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: PDF, DOC, DOCX (Max 5MB) - <span className="text-red-500">Required</span>
                      </p>
                      {!applicationData.resume && (
                        <p className="text-xs text-red-500 mt-1">Please upload your resume to apply for this job</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={applying || loading || !isVerified || !applicationData.resume || hasApplied}
            className={`px-6 py-2 text-white font-semibold rounded-lg transition-all duration-200 transform shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              !isVerified || !applicationData.resume || hasApplied ? 'bg-gray-400' : 'hover:scale-105'
            }`}
            style={!isVerified || !applicationData.resume || hasApplied ? {} : { background: 'linear-gradient(to right, #fc944c, #f97316)' }}
          >
            {applying ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Applying...
              </div>
            ) : hasApplied ? (
              'Already Applied'
            ) : !isVerified ? (
              'Verification Required'
            ) : !applicationData.resume ? (
              'Resume Required'
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPopup;
