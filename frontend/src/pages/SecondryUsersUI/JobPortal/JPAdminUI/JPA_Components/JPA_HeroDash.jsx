import React from 'react';

const JPA_HeroDash = () => {
  // Dashboard stats data
  const stats = [
    {
      title: 'Pending Jobs',
      value: 12,
      icon: '⏳',
      color: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      change: '+3 today'
    },
    {
      title: 'Hiring Managers',
      value: 45,
      icon: '👥',
      color: 'bg-blue-100',
      textColor: 'text-blue-800',
      change: '+2 this week'
    },
    {
      title: 'Total Jobs',
      value: 234,
      icon: '💼',
      color: 'bg-green-100',
      textColor: 'text-green-800',
      change: '+15 this month'
    },
    {
      title: 'Pending Verifications',
      value: 8,
      icon: '✅',
      color: 'bg-purple-100',
      textColor: 'text-purple-800',
      change: '+1 today'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Review Jobs',
      description: 'Approve or reject pending job listings',
      icon: '📋',
      color: 'bg-orange-500',
      link: '/admin/pending-jobs'
    },
    {
      title: 'Verify Managers',
      description: 'Review new hiring manager registrations',
      icon: '👤',
      color: 'bg-blue-500',
      link: '/admin/hiring-managers'
    },
    {
      title: 'Generate Report',
      description: 'Create system activity reports',
      icon: '📊',
      color: 'bg-green-500',
      link: '/admin/reports'
    },
    {
      title: 'Manage Users',
      description: 'Add or remove system users',
      icon: '⚙️',
      color: 'bg-purple-500',
      link: '/admin/users'
    }
  ];

  // Recent activity
  const recentActivity = [
    {
      id: 1,
      action: 'Job Approved',
      target: 'Senior Developer at TechCorp',
      user: 'admin@unimate.com',
      time: '2 minutes ago',
      icon: '✅'
    },
    {
      id: 2,
      action: 'Manager Verified',
      target: 'Sarah Johnson (sarah@tech.io)',
      user: 'admin@unimate.com',
      time: '15 minutes ago',
      icon: '👥'
    },
    {
      id: 3,
      action: 'Job Rejected',
      target: 'Intern Position at StartupCo',
      user: 'admin@unimate.com',
      time: '1 hour ago',
      icon: '❌'
    },
    {
      id: 4,
      action: 'Report Generated',
      target: 'Monthly Jobs Report',
      user: 'admin@unimate.com',
      time: '3 hours ago',
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl px-4 mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Welcome back, Admin!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your job portal today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.color} ${stat.textColor}`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                      <span className="text-lg">{action.icon}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{action.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                <button className="text-primary hover:text-primary-dark text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start py-2">
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-800 truncate">
                          {activity.action}
                        </p>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm truncate mb-1">
                        {activity.target}
                      </p>
                      <p className="text-xs text-gray-500">By {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
                  <p className="text-sm text-green-800">Uptime</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">1.2s</div>
                  <p className="text-sm text-blue-800">Avg. Response</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                  <p className="text-sm text-purple-800">Active Issues</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
                  <p className="text-sm text-orange-800">Monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JPA_HeroDash;