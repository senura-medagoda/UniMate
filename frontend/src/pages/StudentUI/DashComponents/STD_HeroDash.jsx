import React from 'react';

const STD_HeroDash = ({ user }) => {
  console.log("User object:", user);

  // Use the user prop safely with optional chaining
  const userData = user || {
    name: "Emily Johnson",
    university: "University of Technology",
    studentId: "STU456789",
    avatar: "https://placehold.co/100x100?text=EJ"
  };

  // Sample notifications
  const notifications = [
    { id: 1, message: "Your job application was viewed", time: "2 hours ago", read: false },
    { id: 2, message: "New study materials available", time: "5 hours ago", read: true },
    { id: 3, message: "Food order delivered successfully", time: "Yesterday", read: true }
  ];

  // Service cards data
  const services = [
    {
      id: 1,
      title: "Accommodation",
      description: "Find your perfect student housing",
      icon: "🏠",
      color: "bg-blue-100",
      textColor: "text-blue-800",
      link: "/accommodation"
    },
    {
      id: 2,
      title: "Food Order",
      description: "Order from campus restaurants",
      icon: "🍕",
      color: "bg-red-100",
      textColor: "text-red-800",
      link: "/food"
    },
    {
      id: 3,
      title: "Job Portal",
      description: "Find on-campus jobs & internships",
      icon: "💼",
      color: "bg-green-100",
      textColor: "text-green-800",
      link: "/jobs"
    },
    {
      id: 4,
      title: "Study Materials",
      description: "Access notes, papers & resources",
      icon: "📚",
      color: "bg-purple-100",
      textColor: "text-purple-800",
      link: "/study"
    },
    {
      id: 5,
      title: "Marketplace",
      description: "Buy & sell items with students",
      icon: "🛒",
      color: "bg-orange-100",
      textColor: "text-orange-800",
      link: "/marketplace"
    }
  ];

  // Quick stats
  const stats = [
    { label: "Active Applications", value: 3 },
    { label: "Unread Messages", value: 2 },
    { label: "Saved Items", value: 7 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Welcome Header - FIXED with safe access */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, {user?.email || userData.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {userData.university} • {user?.uid || userData.studentId}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-title">{stat.label}</div>
                <div className="stat-value text-primary">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Unimate Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {services.map(service => (
              <div key={service.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="card-body p-4">
                  <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mb-3`}>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <h3 className="card-title text-lg">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  <div className="card-actions justify-end mt-3">
                    <button className="btn btn-primary btn-sm">Explore</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 01118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Applied for Library Assistant position</p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Uploaded Calculus II notes to Study Materials</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Received message about your accommodation inquiry</p>
                  <p className="text-sm text-gray-500">4 days ago</p>
                </div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm mt-4">View All Activity</button>
          </div>

          {/* Quick Access */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
            <div className="space-y-3">
              <button className="btn btn-outline btn-block justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                My Job Applications
              </button>
              <button className="btn btn-outline btn-block justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Study Materials
              </button>
              <button className="btn btn-outline btn-block justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                My Accommodation
              </button>
              <button className="btn btn-outline btn-block justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STD_HeroDash;