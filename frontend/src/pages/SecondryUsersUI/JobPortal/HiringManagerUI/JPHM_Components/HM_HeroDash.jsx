import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useHMAuth } from '@/context/HMAuthContext'
import { 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp, 
  Plus, 
  Eye, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Target,
  Award,
  RefreshCw
} from 'lucide-react'

function HM_HeroDash({ user }) {
  const { hm, makeAuthenticatedRequest } = useHMAuth();
  const navigate = useNavigate();
  
  // Debug: Log HM data to see what we're getting
  console.log('HM_HeroDash - HM data:', hm);
  console.log('HM_HeroDash - HM firstName:', hm?.firstName);
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    pendingJobs: 0,
    totalApplicants: 0,
    newApplicants: 0,
    recentApplications: []
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleNewJob = () => {
    // Check if hiring manager is verified
    if (hm && hm.status !== 'Verified') {
      alert(`You need to be verified to create new jobs. Current status: ${hm.status}`);
      return;
    }
    navigate('/addnewjob');
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const response = await makeAuthenticatedRequest('http://localhost:5001/api/hm/dashboard/stats');
      const result = await response.json();
      
      if (response.ok && result.success) {
        setStats({
          activeJobs: result.data.activeJobs,
          pendingJobs: result.data.pendingJobs,
          totalApplicants: result.data.totalApplicants,
          newApplicants: result.data.newApplicants,
          recentApplications: result.data.recentApplications || []
        });
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch dashboard stats:', result.message);
        // Keep default values on error
      }
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [makeAuthenticatedRequest]);

  // Auto-refresh dashboard data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [makeAuthenticatedRequest]);

  // Refresh data when component becomes visible (user navigates back to dashboard)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardStats();
      }
    };

    const handleFocus = () => {
      fetchDashboardStats();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [makeAuthenticatedRequest]);

  // Format recent applications for display
  const formatRecentActivity = () => {
    if (!stats.recentApplications || stats.recentApplications.length === 0) {
      return [
        {
          id: 'no-applications',
          jobTitle: 'No recent applications',
          activity: 'No new applications yet',
          date: 'N/A',
          status: 'inactive',
          icon: <Users className="w-4 h-4" />
        }
      ];
    }

    return stats.recentApplications.map((app, index) => {
      // Transform status for display
      let displayStatus = app.status;
      if (app.status === 'hired') {
        displayStatus = 'approved';
      } else if (app.status === 'pending') {
        displayStatus = 'active';
      }

      return {
        id: app._id || index,
        jobTitle: app.jobId?.title || 'Unknown Job',
        activity: `New application from ${app.studentName}`,
        date: new Date(app.appliedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: displayStatus,
        icon: <Users className="w-4 h-4" />
      };
    });
  };

  const recentActivity = formatRecentActivity();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'live': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'closed': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'shortlisted': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
              Welcome back, <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{hm?.firstName || hm?.name?.split(' ')[0] || 'Hiring Manager'}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Here's what's happening with your job postings and applications. Manage your recruitment process efficiently.
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <motion.button
              onClick={fetchDashboardStats}
              className="px-6 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:shadow-xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </motion.button>
            <motion.button
              onClick={handleNewJob}
              className={`px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-3 ${
                hm && hm.status === 'Verified' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:shadow-xl transform hover:scale-105' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
              whileHover={hm && hm.status === 'Verified' ? { scale: 1.05 } : {}}
              whileTap={hm && hm.status === 'Verified' ? { scale: 0.95 } : {}}
              disabled={hm && hm.status !== 'Verified'}
            >
              <Plus className="w-5 h-5" />
              {hm && hm.status === 'Verified' ? 'List a New Job' : 'Verification Required'}
            </motion.button>
          </div>
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
                <Briefcase className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.activeJobs}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Active Jobs</h3>
            <p className="text-xs text-gray-500">Currently live positions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.pendingJobs}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending Jobs</h3>
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Users className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.totalApplicants}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Applicants</h3>
            <p className="text-xs text-gray-500">All time applications</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.newApplicants}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">New This Week</h3>
            <p className="text-xs text-gray-500">Recent applications</p>
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
              <div className="p-3 rounded-xl bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Jobs</h3>
                <p className="text-sm text-gray-600">View and edit your job postings</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/myjobs')}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              View Jobs <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-green-100">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Applications</h3>
                <p className="text-sm text-gray-600">Check new applicant submissions</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/applicants')}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              View Applications <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View performance metrics</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              View Analytics <ArrowRight className="w-4 h-4" />
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
                <Clock className="w-6 h-6" style={{ color: '#fc944c' }} />
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
                      <h3 className="font-semibold text-gray-900">{activity.jobTitle}</h3>
                      <p className="text-sm text-gray-600">{activity.activity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HM_HeroDash