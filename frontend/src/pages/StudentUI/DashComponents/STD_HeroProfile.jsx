import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const STD_HeroProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current user email from session/localStorage
  const currentUserEmail = user?.email || user?.s_email || localStorage.getItem('studentEmail') || '';

  useEffect(() => {
    const fetchStudentData = async () => {
      console.log('User object:', user);
      console.log('Current user email:', currentUserEmail);
      
      if (!currentUserEmail) {
        setError('No user email found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching student data for email:', currentUserEmail);
        const response = await axios.get(`http://localhost:5001/api/students/email/${encodeURIComponent(currentUserEmail)}`);
        console.log('API response:', response.data);
        setStudentData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching student data:', err);
        console.error('Error response:', err.response?.data);
        setError(`Failed to load profile data: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currentUserEmail, user]);

  // Default data structure
  const defaultData = {
    s_fname: "Loading...",
    s_lname: "",
    s_email: currentUserEmail,
    s_uni: "Loading...",
    s_uniID: "Loading...",
    s_NIC: "Not provided",
    s_phone: "Not provided",
    s_status: "Unverified",
    avatar: "https://placehold.co/400x400?text=U",
    joinDate: "Unknown",
    lastActive: "Unknown"
  };

  const userData = studentData || defaultData;

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    // Handle save logic here
    setIsEditing(false);
  };

  const handleVerifyProfile = () => {
    // Handle profile verification logic
    alert('Profile verification request sent! Please contact admin for verification.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
          <p className="text-gray-500 text-sm mt-2">Email: {currentUserEmail || 'Not found'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left max-w-md">
            <p className="text-sm text-gray-600 mb-2">Debug Info:</p>
            <p className="text-xs text-gray-500">User object: {JSON.stringify(user, null, 2)}</p>
            <p className="text-xs text-gray-500">Email found: {currentUserEmail}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-orange-400/5 to-orange-600/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fc944c%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto max-w-6xl px-4 py-8">
          
          {/* Profile Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  <img 
                    src={userData.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Verification Badge */}
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  userData.s_status === 'Verified' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {userData.s_status === 'Verified' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                      {userData.s_fname} {userData.s_lname}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        userData.s_status === 'Verified' 
                          ? 'bg-green-100 text-green-800' 
                          : userData.s_status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : userData.s_status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {userData.s_status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Student ID: {userData.s_uniID}
                      </span>
                    </div>
                    
                    {/* Status Message */}
                    {userData.s_status === 'Pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-yellow-800 font-medium">Verification Pending</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">Your profile verification is under review. Please wait for admin approval.</p>
                      </div>
                    )}
                    
                    {userData.s_status === 'Rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192-2.5 1.732-2.5z" />
                          </svg>
                          <span className="text-sm text-red-800 font-medium">Verification Rejected</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">Your profile verification was rejected. Please contact admin for more information.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-2 bg-white border-2 text-orange-600 border-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                    
                    {!['Pending', 'Verified', 'Rejected'].includes(userData.s_status) && (
                     <Link to="/verifystd"> <button
                        //onClick={handleVerifyProfile}
                        className="px-6 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verify Profile
                      </button></Link>
                    )}
                    
                    {isEditing && (
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        style={{backgroundColor: '#fc944c'}}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor: '#fc944c'}}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">First Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={userData.s_fname}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#fc944c'}}
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{userData.s_fname}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Last Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={userData.s_lname}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#fc944c'}}
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{userData.s_lname}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      defaultValue={userData.s_email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#fc944c'}}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{userData.s_email}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      defaultValue={userData.s_phone || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#fc944c'}}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{userData.s_phone || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">NIC Number</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      defaultValue={userData.s_NIC || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#fc944c'}}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{userData.s_NIC || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* University Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor: '#fc944c'}}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">University Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">University</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      defaultValue={userData.s_uni}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#fc944c'}}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{userData.s_uni}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Student ID</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      defaultValue={userData.s_uniID}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{'--tw-ring-color': '#fc944c'}}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{userData.s_uniID}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Profile Verification</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      userData.s_status === 'Verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userData.s_status}
                    </span>
                    {userData.s_status === 'Verified' ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Member Since</label>
                  <p className="text-gray-800 font-medium">{userData.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/std-dash" className="group">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#fc944c'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-sm">Dashboard</h3>
                </div>
              </Link>
              
              <Link to="/jobdash" className="group">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#fc944c'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-sm">Job Portal</h3>
                </div>
              </Link>
              
              <Link to="/StudyMaterialDash" className="group">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#fc944c'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-sm">Study Materials</h3>
                </div>
              </Link>
              
              <Link to="/M_home" className="group">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#fc944c'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-sm">Marketplace</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STD_HeroProfile;
