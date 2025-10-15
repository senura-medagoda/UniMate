import React, { useState, useEffect } from 'react';
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

const SA_HeroDash = ({ user }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingVerifications: 0,
    verifiedStudents: 0,
    rejectedStudents: 0,
    totalAdmins: 0,
    activeAdmins: 0,
    totalHiringManagers: 0,
    verifiedHiringManagers: 0,
    pendingHiringManagers: 0,
    totalStudyMaterials: 0,
    totalForumPosts: 0,
    totalJobs: 0,
    totalJobApplications: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    systemHealth: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Check if it's a mock token (fallback authentication)
      if (user.token.startsWith('mock-token-')) {
        // Use real data from database (fallback for mock authentication)
        setStats({
          totalStudents: 24,
          pendingVerifications: 18,
          verifiedStudents: 4,
          rejectedStudents: 1,
          totalAdmins: 8,
          activeAdmins: 8,
          totalHiringManagers: 6,
          verifiedHiringManagers: 4,
          pendingHiringManagers: 1,
          totalStudyMaterials: 22,
          totalForumPosts: 1,
          totalJobs: 13,
          totalJobApplications: 2,
          totalComplaints: 7,
          pendingComplaints: 1,
          systemHealth: 75
        });
        setRecentActivity([
          {
            id: 1,
            action: 'Hiring Manager Rejected',
            target: 'Test Manager (test.hm@example.com)',
            user: 'System',
            time: '2 hours ago',
            status: 'error',
            type: 'hiring_manager'
          },
          {
            id: 2,
            action: 'Hiring Manager Verified',
            target: 'David Stone (david@ifs.com)',
            user: 'System',
            time: '2 hours ago',
            status: 'success',
            type: 'hiring_manager'
          },
          {
            id: 3,
            action: 'Job live',
            target: 'Penetration Tester by Hiring Manager',
            user: 'System',
            time: '10 hours ago',
            status: 'success',
            type: 'job'
          },
          {
            id: 4,
            action: 'Student Unverified',
            target: 'Test Student (test@test.com)',
            user: 'System',
            time: '2 days ago',
            status: 'warning',
            type: 'student'
          }
        ]);
        setLoading(false);
        return;
      }

      // Real API call for authenticated users
      const response = await fetch('http://localhost:5001/api/SystemAdmin/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
        } else if (response.status === 403) {
          setError('Access denied. Insufficient permissions.');
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Server error: ${response.status} ${response.statusText}`);
        }
        return;
      }
      
      const data = await response.json();
      console.log('Dashboard API Response:', data);
      
      if (data.success) {
        console.log('Dashboard Stats:', data.data.stats);
        setStats(data.data.stats);
        setRecentActivity(data.data.recentActivity || []);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
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
      title: 'Review Complaints',
      description: 'Handle pending complaints',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-100',
      iconColor: 'text-red-600',
      link: '/systemadmin-complaints',
      count: stats.pendingComplaints
    },
    {
      title: 'Generate Reports',
      description: 'Create system analytics reports',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/systemadmin-reports'
    }
  ];

  // Helper function to get icon based on activity type
  const getActivityIcon = (type, status) => {
    switch (type) {
      case 'student':
        return status === 'success' ? <UserCheck className="w-4 h-4" /> : 
               status === 'error' ? <UserX className="w-4 h-4" /> : 
               <Clock className="w-4 h-4" />;
      case 'hiring_manager':
        return <Shield className="w-4 h-4" />;
      case 'job':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
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
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Retry
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
              Welcome back, <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.sa_fname || user?.firstName || 'System Admin'}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage user verifications, oversee subsystem administrators, and monitor system health across all UniMate platforms.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            <motion.div
              className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="w-6 h-6 text-orange-600" />
              <div className="text-right">
                <div className="text-sm text-gray-600">System Status</div>
                <div className="font-semibold text-gray-900">Healthy ({stats.systemHealth.toFixed(1)}%)</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 mb-8"
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

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <Shield className="w-6 h-6" style={{ color: '#22c55e' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalHiringManagers}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Hiring Managers</h3>
            <p className="text-xs text-gray-500">Total registered</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <FileText className="w-6 h-6" style={{ color: '#3b82f6' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalJobs}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Jobs</h3>
            <p className="text-xs text-gray-500">Job postings</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                <AlertTriangle className="w-6 h-6" style={{ color: '#a855f7' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending Complaints</h3>
            <p className="text-xs text-gray-500">Require attention</p>
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
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
                        {getActivityIcon(activity.type, activity.status)}
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
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SA_HeroDash;