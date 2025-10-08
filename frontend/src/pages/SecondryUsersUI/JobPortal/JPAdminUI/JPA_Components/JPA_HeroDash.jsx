import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Shield,
  Activity,
  Zap,
  Eye,
  Settings
} from 'lucide-react';

const JPA_HeroDash = () => {
  const stats = {
    pendingJobs: 12,
    totalManagers: 45,
    totalJobs: 234,
    pendingVerifications: 8
  };

  const quickActions = [
    {
      title: 'Review Jobs',
      description: 'Approve or reject pending job listings',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      link: '/jpadmin-jobs'
    },
    {
      title: 'Verify Managers',
      description: 'Review new hiring manager registrations',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/jpadmin-managers'
    },
    {
      title: 'Generate Report',
      description: 'Create system activity reports',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/jpadmin-reports'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/jpadmin-settings'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Job Approved',
      target: 'Senior Developer at TechCorp',
      user: 'admin@unimate.com',
      time: '2 minutes ago',
      icon: <CheckCircle className="w-4 h-4" />,
      status: 'success'
    },
    {
      id: 2,
      action: 'Manager Verified',
      target: 'Sarah Johnson (sarah@tech.io)',
      user: 'admin@unimate.com',
      time: '15 minutes ago',
      icon: <Users className="w-4 h-4" />,
      status: 'success'
    },
    {
      id: 3,
      action: 'Job Rejected',
      target: 'Intern Position at StartupCo',
      user: 'admin@unimate.com',
      time: '1 hour ago',
      icon: <AlertCircle className="w-4 h-4" />,
      status: 'error'
    },
    {
      id: 4,
      action: 'Report Generated',
      target: 'Monthly Jobs Report',
      user: 'admin@unimate.com',
      time: '3 hours ago',
      icon: <BarChart3 className="w-4 h-4" />,
      status: 'info'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
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
              Welcome back, <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Here's what's happening with your job portal today. Manage jobs, verify managers, and monitor system activity.
            </p>
          </div>
          <motion.div
            className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Shield className="w-6 h-6 text-orange-600" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Admin Status</div>
              <div className="font-semibold text-gray-900">Active</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.pendingJobs}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending Jobs</h3>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Users className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalManagers}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Hiring Managers</h3>
            <p className="text-xs text-gray-500">Total registered</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Briefcase className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalJobs}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Jobs</h3>
            <p className="text-xs text-gray-500">All time listings</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <CheckCircle className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending Verifications</h3>
            <p className="text-xs text-gray-500">Manager approvals</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-orange-100">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Jobs</h3>
                <p className="text-sm text-gray-600">Approve or reject pending listings</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              Manage Jobs <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Verify Managers</h3>
                <p className="text-sm text-gray-600">Review manager registrations</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              View Managers <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-green-100">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Generate Reports</h3>
                <p className="text-sm text-gray-600">Create system activity reports</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              View Reports <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="w-6 h-6" style={{ color: '#fc944c' }} />
                Recent Activity
              </h2>
              <button className="text-sm font-medium" style={{ color: '#fc944c' }}>View All</button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {activity.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                      <p className="text-sm text-gray-600">{activity.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JPA_HeroDash;