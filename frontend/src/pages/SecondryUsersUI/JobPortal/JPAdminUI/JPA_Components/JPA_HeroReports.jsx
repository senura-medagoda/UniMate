import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calendar,
  Download,
  Filter,
  Eye,
  FileText,
  PieChart,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const JPA_HeroReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportData = {
    overview: {
      title: 'Platform Overview',
      description: 'Key metrics and statistics for the job portal platform',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    jobs: {
      title: 'Job Analytics',
      description: 'Detailed analysis of job postings and performance',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600'
    },
    managers: {
      title: 'Manager Activity',
      description: 'Hiring manager engagement and activity metrics',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600'
    },
    applications: {
      title: 'Application Trends',
      description: 'Student application patterns and success rates',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-600'
    }
  };

  const stats = [
    {
      title: 'Total Jobs Posted',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      title: 'Active Managers',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Total Applications',
      value: '3,456',
      change: '+18%',
      changeType: 'positive',
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: 'Success Rate',
      value: '78%',
      change: '+3%',
      changeType: 'positive',
      icon: <Target className="w-5 h-5" />
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New Job Posted',
      details: 'Senior Developer at TechCorp',
      time: '2 hours ago',
      type: 'job',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 2,
      action: 'Manager Verified',
      details: 'Sarah Johnson from Creative Studio',
      time: '4 hours ago',
      type: 'manager',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: 3,
      action: 'Job Rejected',
      details: 'Intern Position at StartupCo',
      time: '6 hours ago',
      type: 'rejection',
      icon: <XCircle className="w-4 h-4" />
    },
    {
      id: 4,
      action: 'Report Generated',
      details: 'Weekly Analytics Report',
      time: '1 day ago',
      type: 'report',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  const getActivityColor = (type) => {
    switch (type) {
      case 'job': return 'text-green-600 bg-green-100'
      case 'manager': return 'text-blue-600 bg-blue-100'
      case 'rejection': return 'text-red-600 bg-red-100'
      case 'report': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  };

  const handleGenerateReport = (reportType) => {
    console.log('Generating report:', reportType);
    // API call to generate report
  };

  const handleDownloadReport = (reportType) => {
    console.log('Downloading report:', reportType);
    // API call to download report
  };

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
              Analytics & <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reports</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Comprehensive analytics and reporting for the job portal platform. Track performance, generate insights, and monitor system health.
            </p>
          </div>
          <div className="flex gap-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
            <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-100">
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.title}</div>
            </div>
          ))}
        </motion.div>

        {/* Report Types */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {Object.entries(reportData).map(([key, report]) => (
            <motion.div
              key={key}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                selectedReport === key ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedReport(key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-3 rounded-xl ${report.color} w-fit mb-4`}>
                {report.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{report.description}</p>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateReport(key);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadReport(key);
                  }}
                  className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Postings Chart */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Job Postings Trend
              </h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View Details
              </button>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </motion.div>

          {/* Manager Activity Chart */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-orange-600" />
                Manager Distribution
              </h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View Details
              </button>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Pie chart visualization would go here</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="w-6 h-6 text-orange-600" />
                Recent Activity
              </h2>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View All
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
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

export default JPA_HeroReports;