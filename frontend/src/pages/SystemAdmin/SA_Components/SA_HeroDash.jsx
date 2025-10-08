import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Activity,
  Eye,
  Settings,
  UserCheck,
  UserX,
  FileText,
  AlertTriangle
} from 'lucide-react';

const SA_HeroDash = () => {
  const stats = {
    totalStudents: 1247,
    pendingVerifications: 23,
    verifiedStudents: 1156,
    totalAdmins: 12,
    activeAdmins: 10,
    systemHealth: 98.5
  };

  const quickActions = [
    {
      title: 'Review Students',
      description: 'Verify pending student registrations',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      link: '/systemadmin-students',
      count: stats.pendingVerifications
    },
    {
      title: 'Manage Admins',
      description: 'Add or edit subsystem administrators',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/systemadmin-admins',
      count: stats.totalAdmins
    },
    {
      title: 'Generate Reports',
      description: 'Create system analytics reports',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/systemadmin-reports'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/systemadmin-settings'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Student Verified',
      target: 'John Doe (john.doe@university.edu)',
      user: 'System Admin',
      time: '5 minutes ago',
      icon: <UserCheck className="w-4 h-4" />,
      status: 'success'
    },
    {
      id: 2,
      action: 'Admin Added',
      target: 'Food Admin - Sarah Wilson',
      user: 'System Admin',
      time: '1 hour ago',
      icon: <Shield className="w-4 h-4" />,
      status: 'success'
    },
    {
      id: 3,
      action: 'Student Rejected',
      target: 'Invalid document submitted',
      user: 'System Admin',
      time: '2 hours ago',
      icon: <UserX className="w-4 h-4" />,
      status: 'error'
    },
    {
      id: 4,
      action: 'Report Generated',
      target: 'Monthly User Analytics',
      user: 'System Admin',
      time: '4 hours ago',
      icon: <BarChart3 className="w-4 h-4" />,
      status: 'info'
    },
    {
      id: 5,
      action: 'System Alert',
      target: 'High verification queue',
      user: 'System',
      time: '6 hours ago',
      icon: <AlertTriangle className="w-4 h-4" />,
      status: 'warning'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
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
              Welcome back, <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>System Admin</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage user verifications, oversee subsystem administrators, and monitor system health across all UniMate platforms.
            </p>
          </div>
          <motion.div
            className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Shield className="w-6 h-6 text-orange-600" />
            <div className="text-right">
              <div className="text-sm text-gray-600">System Status</div>
              <div className="font-semibold text-gray-900">Healthy ({stats.systemHealth}%)</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <GraduationCap className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalStudents}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Students</h3>
            <p className="text-xs text-gray-500">All registered users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending Verifications</h3>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <CheckCircle className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.verifiedStudents}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Verified Students</h3>
            <p className="text-xs text-gray-500">Approved users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Users className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Admins</h3>
            <p className="text-xs text-gray-500">Subsystem administrators</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Activity className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.activeAdmins}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Active Admins</h3>
            <p className="text-xs text-gray-500">Currently online</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.systemHealth}%</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">System Health</h3>
            <p className="text-xs text-gray-500">Overall performance</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${action.color}`}>
                  <div className={action.iconColor}>
                    {action.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                {action.count && (
                  <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                    {action.count}
                  </div>
                )}
              </div>
              <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                {action.title} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
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
                      <p className="text-xs text-gray-500">by {activity.user}</p>
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

export default SA_HeroDash;