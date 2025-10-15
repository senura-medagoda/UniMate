import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useHMAuth } from '@/context/HMAuthContext'
import { 
  Edit, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2,
  Linkedin,
  Settings,
  Shield,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  Target,
  CheckCircle
} from 'lucide-react'

function HM_HeroProfile({ user }) {
  const { hm, token, makeAuthenticatedRequest } = useHMAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    workID: '',
    nic: '',
    department: '',
    position: '',
    bio: '',
    linkedin: '',
    status: '',
    lastLogin: '',
    loginCount: 0,
    createdAt: '',
    updatedAt: ''
  });

  const [stats, setStats] = useState({
    jobsPosted: 0,
    applicantsReviewed: 0,
    hiringRate: '0%',
    activePositions: 0
  });

  // Fetch profile statistics
  const fetchStats = async () => {
    try {
      console.log('HM_HeroProfile: Fetching statistics for HM:', hm.hm_email);
      
      const response = await makeAuthenticatedRequest('http://localhost:5001/api/hm/profile/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log('HM_HeroProfile: Statistics response:', result);
      
      if (response.ok && result.success) {
        setStats(result.data);
        console.log('HM_HeroProfile: Successfully loaded statistics data');
      } else {
        console.error('HM_HeroProfile: Failed to fetch statistics:', result.message);
      }
    } catch (err) {
      console.error('HM_HeroProfile: Error fetching statistics:', err);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !hm) {
        console.log('HM_HeroProfile: No token or HM data available');
        console.log('Token available:', !!token);
        console.log('HM data available:', !!hm);
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('HM_HeroProfile: Fetching profile for HM:', hm.hm_email);
        console.log('HM_HeroProfile: Token available:', !!token);
        console.log('HM_HeroProfile: Making request to: http://localhost:5001/api/hm/profile');

        const response = await makeAuthenticatedRequest('http://localhost:5001/api/hm/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('HM_HeroProfile: Response status:', response.status);
        const result = await response.json();
        console.log('HM_HeroProfile: Response result:', result);
        
        if (response.ok && result.success) {
          setProfileData(result.data.hm);
          console.log('HM_HeroProfile: Successfully loaded profile data');
          
          // Fetch statistics after profile data is loaded
          await fetchStats();
        } else {
          setError(result.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('HM_HeroProfile: Error fetching profile:', err);
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, hm, makeAuthenticatedRequest]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Saving profile:', { bio: profileData.bio, linkedin: profileData.linkedin });

      const response = await makeAuthenticatedRequest('http://localhost:5001/api/hm/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bio: profileData.bio,
          linkedin: profileData.linkedin
        })
      });

      const result = await response.json();
      console.log('Save profile response:', result);

      if (response.ok && result.success) {
        // Update the profile data with the response
        setProfileData(prev => ({
          ...prev,
          bio: result.data.hm.bio,
          linkedin: result.data.hm.linkedin,
          updatedAt: result.data.hm.updatedAt
        }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        setError(result.message || 'Failed to update profile');
        alert('Failed to update profile: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to update profile');
      alert('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Helper functions for displaying data
  const getDisplayValue = (value, fallback = '—') => {
    return value && value.trim() !== '' ? value : fallback;
  };

  const getFullName = () => {
    const firstName = getDisplayValue(profileData.firstName);
    const lastName = getDisplayValue(profileData.lastName);
    if (firstName === '—' && lastName === '—') return '—';
    return `${firstName} ${lastName}`.trim();
  };

  const getInitials = () => {
    const firstName = profileData.firstName || '';
    const lastName = profileData.lastName || '';
    if (!firstName && !lastName) return 'HM';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '—';
    }
  };



  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading profile...</p>
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
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
              <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profile</span> Settings
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage your personal and professional information. Keep your profile updated for better recruitment results.
            </p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <motion.button 
                  onClick={handleCancel} 
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </motion.button>
                <motion.button 
                  onClick={handleSave} 
                  className="px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                  style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </>
            ) : (
              <motion.button 
                onClick={() => setIsEditing(true)} 
                className="px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Card */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4">
                  {getInitials()}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{getFullName()}</h2>
                <p className="text-gray-600 mb-1">{getDisplayValue(profileData.position, 'Hiring Manager')}</p>
                <p className="text-gray-500 text-sm mb-6">{getDisplayValue(profileData.department)}</p>
                
                <div className="w-full h-px bg-gray-200 mb-6"></div>
                
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{getDisplayValue(profileData.email)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{getDisplayValue(profileData.phone)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{getDisplayValue(profileData.company)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{getDisplayValue(profileData.workID)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Edit Form and Stats */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="w-6 h-6" style={{ color: '#fc944c' }} />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">First Name</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.firstName)}</div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Last Name</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.lastName)}</div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Job Title</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.position || '—'}</div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Department</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.department)}</div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.email)}</div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Phone</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.phone)}</div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">NIC</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.nic)}</div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Work ID</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.workID)}</div>
                </div>
              </div>

              <div className="form-control mt-6">
                <label className="label">
                  <span className="label-text font-semibold">Bio</span>
                </label>
                {isEditing ? (
                  <textarea 
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full h-24 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg min-h-[6rem]">{getDisplayValue(profileData.bio, 'No bio provided')}</div>
                )}
              </div>
            </motion.div>

            {/* Company Information */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Building2 className="w-6 h-6" style={{ color: '#fc944c' }} />
                Company Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Company</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.company)}</div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Website</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.companyWebsite || '—'}</div>
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">LinkedIn Profile</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="url" 
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{getDisplayValue(profileData.linkedin, 'No LinkedIn profile provided')}</div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Account Information */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6" style={{ color: '#fc944c' }} />
                Account Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Account Status</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profileData.status === 'Active' ? 'bg-green-100 text-green-800' :
                      profileData.status === 'Unverified' ? 'bg-yellow-100 text-yellow-800' :
                      profileData.status === 'Banned' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getDisplayValue(profileData.status, 'Unknown')}
                    </span>
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Last Login</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                    {formatDate(profileData.lastLogin)}
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Login Count</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                    {profileData.loginCount || 0}
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Member Since</span>
                  </label>
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                    {formatDate(profileData.createdAt)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Statistics */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6" style={{ color: '#fc944c' }} />
                Your Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.jobsPosted}</div>
                  <div className="text-sm text-gray-600">Jobs Posted</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.applicantsReviewed}</div>
                  <div className="text-sm text-gray-600">Applicants Reviewed</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.hiringRate}</div>
                  <div className="text-sm text-gray-600">Hiring Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.activePositions}</div>
                  <div className="text-sm text-gray-600">Active Positions</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HM_HeroProfile;