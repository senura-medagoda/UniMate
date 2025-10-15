import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Camera,
  Key,
  Bell,
  Settings,
  Activity,
  Award,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useJPAuth } from '@/context/JPAuthContext';

const JPA_HeroProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [editData, setEditData] = useState({ phone: '', bio: '' });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const { jpAdmin, makeAuthenticatedRequest } = useJPAuth();

  // Fetch admin profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await makeAuthenticatedRequest('http://localhost:5001/api/jpadmin/profile');
        const result = await response.json();
        
        if (response.ok && result.success) {
          setAdminData(result.data.jpAdmin);
        } else {
          setError(result.message || 'Failed to fetch profile data');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    const fetchStatsData = async () => {
      try {
        const response = await makeAuthenticatedRequest('http://localhost:5001/api/jpadmin/dashboard/stats');
        const result = await response.json();
        
        if (response.ok && result.success) {
          setStats(result.data.stats);
        }
      } catch (err) {
        console.error('Error fetching stats data:', err);
      }
    };

    if (jpAdmin) {
      fetchProfileData();
      fetchStatsData();
    }
  }, [jpAdmin, makeAuthenticatedRequest]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Default permissions for JP Admin
  const permissions = [
    'Job Management',
    'Manager Verification',
    'System Reports',
    'User Management',
    'Platform Settings'
  ];

  // Calculate days active
  const getDaysActive = () => {
    if (!adminData?.createdAt) return '0';
    const createdDate = new Date(adminData.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };

  const statsData = [
    {
      title: 'Jobs Reviewed',
      value: stats?.totalJobs || '0',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Managers Verified',
      value: stats?.verifiedManagers || '0',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Total Applications',
      value: stats?.totalApplications || '0',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Days Active',
      value: getDaysActive(),
      icon: <Clock className="w-5 h-5" />,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Approved Job Posting',
      details: 'Senior Developer at TechCorp',
      time: '2 hours ago',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: 2,
      action: 'Verified Manager',
      details: 'Sarah Johnson from Creative Studio',
      time: '4 hours ago',
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 3,
      action: 'Generated Report',
      details: 'Weekly Analytics Report',
      time: '1 day ago',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 4,
      action: 'Updated Settings',
      details: 'Platform configuration changes',
      time: '2 days ago',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  const handleEdit = () => {
    if (adminData) {
      setEditData({
        phone: adminData.phone || '',
        bio: adminData.bio || ''
      });
      setSaveError(null);
      setSaveSuccess(false);
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Validate phone number if provided
      if (editData.phone && !/^[0-9]{10}$/.test(editData.phone)) {
        setSaveError('Phone number must be exactly 10 digits');
        setSaveLoading(false);
        return;
      }

      // Validate bio length if provided
      if (editData.bio && editData.bio.length > 500) {
        setSaveError('Bio cannot exceed 500 characters');
        setSaveLoading(false);
        return;
      }

      const response = await makeAuthenticatedRequest('http://localhost:5001/api/jpadmin/profile', {
        method: 'PUT',
        body: JSON.stringify({
          jpa_phone: editData.phone || null,
          bio: editData.bio || null
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAdminData(result.data.jpAdmin);
        setSaveSuccess(true);
        setIsEditing(false);
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ phone: '', bio: '' });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (saveError) {
      setSaveError(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-blue-100 w-fit mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading profile...</h3>
            <p className="text-gray-600">Please wait while we fetch your profile data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-red-100 w-fit mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading profile</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No profile data found</h3>
            <p className="text-gray-600">Unable to load profile information</p>
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
              Admin <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profile</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage your administrator account settings, view activity history, and configure platform preferences.
            </p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <motion.button
                onClick={handleEdit}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: saveLoading ? 1 : 1.02 }}
                  whileTap={{ scale: saveLoading ? 1 : 0.98 }}
                >
                  {saveLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saveLoading ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: saveLoading ? 1 : 1.02 }}
                  whileTap={{ scale: saveLoading ? 1 : 0.98 }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Success Message */}
        {saveSuccess && (
          <motion.div 
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Profile updated successfully!</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {saveError && (
          <motion.div 
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">{saveError}</p>
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</h3>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Information */}
          <motion.div 
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <User className="w-6 h-6 text-orange-600" />
                Profile Information
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-orange-100 flex items-center justify-center">
                    {adminData.profilePicture ? (
                      <img 
                        src={adminData.profilePicture} 
                        alt={adminData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-orange-600 font-bold text-2xl">
                        {getInitials(adminData.firstName, adminData.lastName)}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{adminData.name}</h3>
                  <p className="text-gray-600 mb-2">{adminData.position || 'Job Portal Administrator'}</p>
                  <p className="text-gray-500 text-sm">{adminData.department || 'IT Administration'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      defaultValue={adminData.name}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{adminData.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      defaultValue={adminData.email}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {adminData.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter 10-digit phone number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {adminData.phone || 'Not provided'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work ID</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {adminData.workID}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(adminData.createdAt)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDateTime(adminData.lastLogin)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio {isEditing && <span className="text-gray-500 text-sm">(max 500 characters)</span>}
                </label>
                {isEditing ? (
                  <div>
                    <textarea 
                      value={editData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editData.bio.length}/500 characters
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-900">{adminData.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Permissions */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Permissions
              </h3>
              <div className="space-y-2">
                {permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {permission}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-3">
                  <Key className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Change Password</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Notification Settings</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-3">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Activity Log</span>
                </button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Recent Activity
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{activity.action}</h4>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JPA_HeroProfile;
