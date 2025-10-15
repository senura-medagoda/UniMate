import React, { useState, useEffect } from 'react';
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
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useJPAuth } from '@/context/JPAuthContext';
import JobTrendsChart from './JobTrendsChart';
import ManagerDistributionChart from './ManagerDistributionChart';

const JPA_HeroReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(false);
  
  const { makeAuthenticatedRequest } = useJPAuth();

  // Fetch reports data
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await makeAuthenticatedRequest(`http://localhost:5001/api/jpadmin/reports?period=${selectedPeriod}`);
        const result = await response.json();
        
        console.log('Reports API response:', { status: response.status, ok: response.ok, result });
        
        if (response.ok && result.success) {
          setReportsData(result.data);
        } else {
          console.error('Reports API error:', result);
          setError(result.message || 'Failed to fetch reports data');
        }
      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError(err.message || 'Failed to fetch reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [selectedPeriod, makeAuthenticatedRequest]);

  // Helper function to format time
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

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

  // Calculate stats from real data
  const stats = reportsData ? [
    {
      title: 'Total Jobs Posted',
      value: reportsData.stats.totalJobs.toString(),
      change: `+${reportsData.stats.jobsInPeriod}`,
      changeType: 'positive',
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      title: 'Active Managers',
      value: reportsData.stats.verifiedManagers.toString(),
      change: `+${reportsData.stats.unverifiedManagers}`,
      changeType: 'positive',
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Total Applications',
      value: reportsData.stats.totalApplications.toString(),
      change: `+${reportsData.stats.applicationsInPeriod}`,
      changeType: 'positive',
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: 'Success Rate',
      value: `${reportsData.stats.successRate}%`,
      change: `+${reportsData.stats.hiredApplications}`,
      changeType: 'positive',
      icon: <Target className="w-5 h-5" />
    }
  ] : [];

  // Use real activity data
  const recentActivity = reportsData?.recentActivity || [];

  const getActivityColor = (type) => {
    switch (type) {
      case 'job': return 'text-green-600 bg-green-100'
      case 'manager': return 'text-blue-600 bg-blue-100'
      case 'rejection': return 'text-red-600 bg-red-100'
      case 'report': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      setGeneratingReport(true);
      setReportError(null);
      setReportSuccess(false);

      const response = await makeAuthenticatedRequest('http://localhost:5001/api/jpadmin/reports/generate', {
        method: 'POST',
        body: JSON.stringify({
          reportType,
          format: 'pdf',
          period: selectedPeriod
        })
      });

      if (response.ok) {
        // Check if response is PDF (binary data)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/pdf')) {
          // Handle PDF view in new tab
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          window.URL.revokeObjectURL(url);
          
          setReportSuccess(true);
          setTimeout(() => setReportSuccess(false), 3000);
        } else {
          // Handle JSON response (for other formats)
          const result = await response.json();
          if (result.success) {
            setReportSuccess(true);
            console.log('Report generated:', result.data);
            setTimeout(() => setReportSuccess(false), 3000);
          } else {
            setReportError(result.message || 'Failed to generate report');
          }
        }
      } else {
        const result = await response.json();
        setReportError(result.message || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setReportError(err.message || 'Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDownloadReport = async (reportType) => {
    try {
      setGeneratingReport(true);
      setReportError(null);
      setReportSuccess(false);

      const response = await makeAuthenticatedRequest('http://localhost:5001/api/jpadmin/reports/generate', {
        method: 'POST',
        body: JSON.stringify({
          reportType,
          format: 'pdf',
          period: selectedPeriod
        })
      });

      if (response.ok) {
        // Check if response is PDF (binary data)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/pdf')) {
          // Handle PDF download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${reportType}_report_${selectedPeriod}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          setReportSuccess(true);
          setTimeout(() => setReportSuccess(false), 3000);
        } else {
          // Handle JSON response (for other formats)
          const result = await response.json();
          if (result.success) {
            setReportSuccess(true);
            console.log('Report downloaded:', result.data);
            setTimeout(() => setReportSuccess(false), 3000);
          } else {
            setReportError(result.message || 'Failed to download report');
          }
        }
      } else {
        const result = await response.json();
        setReportError(result.message || 'Failed to download report');
      }
    } catch (err) {
      console.error('Error downloading report:', err);
      setReportError(err.message || 'Failed to download report');
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-blue-100 w-fit mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading reports...</h3>
            <p className="text-gray-600">Please wait while we fetch the analytics data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-red-100 w-fit mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading reports</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Message */}
        {reportSuccess && (
          <motion.div 
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Report generated successfully!</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {reportError && (
          <motion.div 
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">{reportError}</p>
            </div>
          </motion.div>
        )}

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
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                // Charts will automatically update due to period prop change
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
            <button 
              onClick={() => handleDownloadReport('overview')}
              disabled={generatingReport}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingReport ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {generatingReport ? 'Generating...' : 'Export All PDF'}
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
                  disabled={generatingReport}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingReport ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {generatingReport ? 'Generating...' : 'View PDF'}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadReport(key);
                  }}
                  disabled={generatingReport}
                  className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingReport ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {generatingReport ? '' : 'PDF'}
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
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {selectedPeriod === '7days' ? '7 Days' : 
                   selectedPeriod === '30days' ? '30 Days' :
                   selectedPeriod === '90days' ? '90 Days' : '1 Year'}
                </span>
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View Details
                </button>
              </div>
            </div>
            <JobTrendsChart data={reportsData} period={selectedPeriod} />
          </motion.div>

          {/* Manager Distribution Chart */}
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
            <ManagerDistributionChart data={reportsData} />
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const getActivityIcon = (iconName) => {
                  switch (iconName) {
                    case 'Briefcase': return <Briefcase className="w-4 h-4" />;
                    case 'Users': return <Users className="w-4 h-4" />;
                    case 'FileText': return <FileText className="w-4 h-4" />;
                    default: return <Activity className="w-4 h-4" />;
                  }
                };

                return (
                  <motion.div 
                    key={activity.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.time)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No recent activity found for the selected period.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JPA_HeroReports;