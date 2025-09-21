import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Edit, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  Globe,
  Linkedin,
  Settings,
  Bell,
  Shield,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  Target,
  CheckCircle,
  Calendar,
  FileText
} from 'lucide-react'

function HM_HeroProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Johnson',
    title: 'Senior Hiring Manager',
    department: 'Computer Science Department',
    email: 'sarah.johnson@university.edu',
    phone: '(555) 123-4567',
    office: 'Science Building, Room 305',
    bio: 'Experienced hiring manager with 8+ years in academic recruitment. Specialized in identifying talented students for research positions and internships.',
    company: 'University of Technology',
    companyWebsite: 'www.university.edu',
    linkedin: 'linkedin.com/in/sarahjohnson',
    notifications: true,
    newsletter: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const stats = {
    jobsPosted: 24,
    applicantsReviewed: 347,
    hiringRate: '68%',
    activePositions: 5
  }

  const recentActivity = [
    {
      id: 1,
      action: 'Posted new job',
      details: 'Software Developer Intern',
      time: '2 hours ago',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 2,
      action: 'Reviewed applications',
      details: '5 new applications for Research Assistant',
      time: '1 day ago',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 3,
      action: 'Hired candidate',
      details: 'Sarah Johnson for Campus Tour Guide',
      time: '3 days ago',
      icon: <CheckCircle className="w-4 h-4" />
    }
  ];

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
                  {profileData.name.split(' ').map(name => name[0]).join('')}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
                <p className="text-gray-600 mb-1">{profileData.title}</p>
                <p className="text-gray-500 text-sm mb-6">{profileData.department}</p>
                
                <div className="w-full h-px bg-gray-200 mb-6"></div>
                
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{profileData.office}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{profileData.company}</span>
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
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.name}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Job Title</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="title"
                      value={profileData.title}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.title}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Department</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.department}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.email}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Phone</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.phone}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Office Location</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="office"
                      value={profileData.office}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.office}</div>
                  )}
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
                  <div className="text-gray-700 p-3 bg-gray-50 rounded-lg min-h-[6rem]">{profileData.bio}</div>
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
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="company"
                      value={profileData.company}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.company}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Website</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="url" 
                      name="companyWebsite"
                      value={profileData.companyWebsite}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.companyWebsite}</div>
                  )}
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
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">{profileData.linkedin}</div>
                  )}
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

            {/* Recent Activity */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6" style={{ color: '#fc944c' }} />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HM_HeroProfile;