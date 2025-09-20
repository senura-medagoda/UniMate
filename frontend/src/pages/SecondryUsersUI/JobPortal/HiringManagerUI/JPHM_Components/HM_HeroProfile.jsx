import React from 'react'
import { useState } from 'react'

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
    // In a real app, this would save to the backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // In a real app, this would revert changes
    setIsEditing(false);
  };

  const stats = {
    jobsPosted: 24,
    applicantsReviewed: 347,
    hiringRate: '68%',
    activePositions: 5
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your personal and professional information</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="btn btn-outline">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex flex-col items-center text-center">
                <div className="avatar mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-content text-3xl font-bold flex items-center justify-center">
                    {profileData.name.split(' ').map(name => name[0]).join('')}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.title}</p>
                <p className="text-gray-500 text-sm mt-1">{profileData.department}</p>
                
                <div className="divider my-4"></div>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{profileData.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{profileData.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{profileData.office}</span>
                  </div>
                </div>
                
                <div className="divider my-4"></div>
                
                <h3 className="font-semibold text-lg mb-3">Hiring Stats</h3>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="stat p-0">
                    <div className="stat-title">Jobs Posted</div>
                    <div className="stat-value text-primary text-xl">{stats.jobsPosted}</div>
                  </div>
                  <div className="stat p-0">
                    <div className="stat-title">Applicants</div>
                    <div className="stat-value text-secondary text-xl">{stats.applicantsReviewed}</div>
                  </div>
                  <div className="stat p-0">
                    <div className="stat-title">Hiring Rate</div>
                    <div className="stat-value text-accent text-xl">{stats.hiringRate}</div>
                  </div>
                  <div className="stat p-0">
                    <div className="stat-title">Active Roles</div>
                    <div className="stat-value text-info text-xl">{stats.activePositions}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.name}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Job Title</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="title"
                      value={profileData.title}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.title}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Department</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.department}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Office Location</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="office"
                      value={profileData.office}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.office}</div>
                  )}
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.email}</div>
                  )}
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.phone}</div>
                  )}
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  {isEditing ? (
                    <textarea 
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered h-24" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.bio}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-6">Company Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Company/University</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="company"
                      value={profileData.company}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.company}</div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Website</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="url" 
                      name="companyWebsite"
                      value={profileData.companyWebsite}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.companyWebsite}</div>
                  )}
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">LinkedIn Profile</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="url" 
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      className="input input-bordered" 
                    />
                  ) : (
                    <div className="text-gray-700 p-2">{profileData.linkedin}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-base-100 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start">
                    <input 
                      type="checkbox" 
                      name="notifications"
                      checked={profileData.notifications}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="checkbox checkbox-primary mr-3" 
                    />
                    <span className="label-text">Email me about new applications</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label cursor-pointer justify-start">
                    <input 
                      type="checkbox" 
                      name="newsletter"
                      checked={profileData.newsletter}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="checkbox checkbox-primary mr-3" 
                    />
                    <span className="label-text">Subscribe to hiring tips newsletter</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HM_HeroProfile