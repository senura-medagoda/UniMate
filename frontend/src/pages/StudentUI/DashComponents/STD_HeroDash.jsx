import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const STD_HeroDash = ({ user }) => {
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
        setError(`Failed to load student data: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currentUserEmail, user]);

  // Use the user prop safely with optional chaining
  const userData = studentData || {
    s_fname: "Loading...",
    s_lname: "",
    s_email: currentUserEmail,
    s_uni: "University of Technology",
    s_uniID: "STU456789",
    avatar: "https://placehold.co/100x100?text=EJ"
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Email: {currentUserEmail || 'Not found'}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
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

  // Service cards data with modern design
  const services = [
    {
      id: 1,
      title: "Accommodation",
      description: "Find your perfect student housing",
      icon: "🏠",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/student/accommodation"
    },
    {
      id: 2,
      title: "Food Order",
      description: "Order from campus restaurants",
      icon: "🍕",
      gradient: "from-red-500 to-red-600",
      hoverGradient: "from-red-600 to-red-700",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      link: "/food"
    },
    {
      id: 3,
      title: "Job Portal",
      description: "Find on-campus jobs & internships",
      icon: "💼",
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      link: "/jobdash"
    },
    {
      id: 4,
      title: "Study Materials",
      description: "Access notes, papers & resources",
      icon: "📚",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/StudyMaterialDash"
    },
    {
      id: 5,
      title: "Marketplace",
      description: "Buy & sell items with students",
      icon: "🛒",
      gradient: "from-orange-500 to-orange-600",
      hoverGradient: "from-orange-600 to-orange-700",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      link: "/M_home"
    }
  ];

  // Quick stats
  const stats = [
    { label: "Active Applications", value: 3, icon: "📋", color: "text-orange-600" },
    { label: "Unread Messages", value: 2, icon: "💬", color: "text-orange-500" },
    { label: "Saved Items", value: 7, icon: "❤️", color: "text-orange-700" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-orange-400/5 to-orange-600/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto max-w-7xl px-4 py-12">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
              Welcome back, {userData.s_fname || "Student"}!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-2">
              {userData.s_uni}
            </p>
            <p className="text-sm text-gray-500">
              Student ID: {userData.s_uniID}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="text-4xl opacity-80">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Services Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">UniMate Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Access all your campus services in one place. Everything you need for your university journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  to={service.link}
                  className="group relative"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 h-full">
                    {/* Icon Container */}
                    <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{service.icon}</span>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                      {service.description}
                    </p>
                    
                    {/* Action Button */}
                    <div className="mt-auto">
                      <div className={`inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r ${service.gradient} text-white font-medium text-sm group-hover:from-opacity-90 group-hover:to-opacity-90 transition-all duration-300 transform group-hover:scale-105`}>
                        Explore
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Hover Effect Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.hoverGradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Quick Access</h2>
              <p className="text-gray-600">Jump to your most used features</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/jobdash" className="group">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#fc944c'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">Job Applications</h3>
                </div>
              </Link>
              
              <Link to="/study" className="group">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#fc944c'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">Study Materials</h3>
                </div>
              </Link>
              
              <Link to="/accommodation" className="group">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#fc944c'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">My Accommodation</h3>
                </div>
              </Link>
              
              <Link to="/food" className="group">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#fc944c'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">My Orders</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STD_HeroDash;