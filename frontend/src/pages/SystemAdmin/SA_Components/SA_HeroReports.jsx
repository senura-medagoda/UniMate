import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  Users,
  GraduationCap,
  Shield,
  Activity,
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react';

const SA_HeroReports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');

  const reports = [
    {
      id: 'overview',
      title: 'System Overview',
      description: 'Complete system statistics and user analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'users',
      title: 'User Analytics',
      description: 'Student registration and verification trends',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'admins',
      title: 'Admin Activity',
      description: 'Administrator performance and activity logs',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'system',
      title: 'System Health',
      description: 'Platform performance and error monitoring',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const stats = {
    totalUsers: 1247,
    newRegistrations: 45,
    verifiedUsers: 1156,
    pendingVerifications: 23,
    totalAdmins: 12,
    activeAdmins: 10,
    systemUptime: 99.8,
    errorRate: 0.2
  };

  const recentReports = [
    {
      id: 1,
      name: 'Monthly User Report',
      type: 'User Analytics',
      generatedBy: user?.sa_fname ? `${user.sa_fname} ${user.sa_lname}` : 'System Admin',
      date: '2024-01-20',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Admin Activity Summary',
      type: 'Admin Activity',
      generatedBy: user?.sa_fname ? `${user.sa_fname} ${user.sa_lname}` : 'System Admin',
      date: '2024-01-19',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      id: 3,
      name: 'System Health Check',
      type: 'System Health',
      generatedBy: user?.sa_fname ? `${user.sa_fname} ${user.sa_lname}` : 'System Admin',
      date: '2024-01-18',
      size: '3.2 MB',
      status: 'completed'
    },
    {
      id: 4,
      name: 'Weekly Overview',
      type: 'System Overview',
      generatedBy: user?.sa_fname ? `${user.sa_fname} ${user.sa_lname}` : 'System Admin',
      date: '2024-01-17',
      size: '1.5 MB',
      status: 'generating'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'generating': return 'text-yellow-600 bg-yellow-50'
      case 'failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  };

  const handleGenerateReport = (reportType) => {
    console.log('Generating report:', reportType);
    alert(`Generating ${reportType} report...`);
  };

  const handleDownloadReport = (reportId) => {
    console.log('Downloading report:', reportId);
    alert('Download started...');
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
              System <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reports</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Generate comprehensive reports, analyze system performance, and monitor user activity across all UniMate platforms.
            </p>
          </div>
          <motion.div
            className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <div className="text-right">
              <div className="text-sm text-gray-600">System Status</div>
              <div className="font-semibold text-gray-900">Healthy</div>
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Users className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Users</h3>
            <p className="text-xs text-gray-500">All registered users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.newRegistrations}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">New This Month</h3>
            <p className="text-xs text-gray-500">Recent registrations</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Shield className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Admins</h3>
            <p className="text-xs text-gray-500">System administrators</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Activity className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.systemUptime}%</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">System Uptime</h3>
            <p className="text-xs text-gray-500">Platform availability</p>
          </div>
        </motion.div>

        {/* Report Types */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 cursor-pointer transition-all duration-300 ${
                selectedReport === report.id ? 'ring-2 ring-orange-500' : 'hover:shadow-xl'
              }`}
              onClick={() => setSelectedReport(report.id)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${report.color}`}>
                  {report.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateReport(report.id);
                }}
                className="w-full py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Generate Report
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Date Range Filter */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Report Period:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
                <option value="custom">Custom range</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export All
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-6 h-6" style={{ color: '#fc944c' }} />
              Recent Reports
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated By</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentReports.map((report, index) => (
                  <motion.tr 
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.generatedBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.size}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-200"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SA_HeroReports;