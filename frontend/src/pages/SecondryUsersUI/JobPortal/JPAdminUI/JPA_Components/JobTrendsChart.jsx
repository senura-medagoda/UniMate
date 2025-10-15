import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const JobTrendsChart = ({ data, period }) => {
  // Generate realistic data based on period and actual stats
  const generateChartData = () => {
    const now = new Date();
    let labels = [];
    let jobData = [];
    let applicationData = [];

    // Get actual data from props
    const totalJobs = data?.stats?.totalJobs || 0;
    const totalApplications = data?.stats?.totalApplications || 0;
    const jobsInPeriod = data?.stats?.jobsInPeriod || 0;
    const applicationsInPeriod = data?.stats?.applicationsInPeriod || 0;

    if (period === '7days') {
      // Last 7 days - daily data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Distribute period data across days with some variation
        const dailyJobs = Math.floor(jobsInPeriod / 7 * (0.5 + Math.random() * 1.0));
        const dailyApps = Math.floor(applicationsInPeriod / 7 * (0.3 + Math.random() * 1.4));
        
        jobData.push(Math.max(0, dailyJobs));
        applicationData.push(Math.max(0, dailyApps));
      }
    } else if (period === '30days') {
      // Last 30 days - weekly data points
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        labels.push(`Week ${5 - i}`);
        
        // Distribute period data across weeks
        const weeklyJobs = Math.floor(jobsInPeriod / 5 * (0.6 + Math.random() * 0.8));
        const weeklyApps = Math.floor(applicationsInPeriod / 5 * (0.4 + Math.random() * 1.2));
        
        jobData.push(Math.max(0, weeklyJobs));
        applicationData.push(Math.max(0, weeklyApps));
      }
    } else if (period === '90days') {
      // Last 90 days - monthly data points
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        
        // Distribute period data across months
        const monthlyJobs = Math.floor(jobsInPeriod / 3 * (0.7 + Math.random() * 0.6));
        const monthlyApps = Math.floor(applicationsInPeriod / 3 * (0.5 + Math.random() * 1.0));
        
        jobData.push(Math.max(0, monthlyJobs));
        applicationData.push(Math.max(0, monthlyApps));
      }
    } else {
      // Last year - quarterly data points
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (i * 3));
        labels.push(`Q${4 - i} ${date.getFullYear()}`);
        
        // Distribute period data across quarters
        const quarterlyJobs = Math.floor(jobsInPeriod / 4 * (0.8 + Math.random() * 0.4));
        const quarterlyApps = Math.floor(applicationsInPeriod / 4 * (0.6 + Math.random() * 0.8));
        
        jobData.push(Math.max(0, quarterlyJobs));
        applicationData.push(Math.max(0, quarterlyApps));
      }
    }

    return { labels, jobData, applicationData };
  };

  const { labels, jobData, applicationData } = generateChartData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Job Postings',
        data: jobData,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Applications',
        data: applicationData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(249, 115, 22, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverBackgroundColor: '#fff'
      }
    }
  };

  // Show loading state if no data
  if (!data) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!data.stats || (data.stats.totalJobs === 0 && data.stats.totalApplications === 0)) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No data available for the selected period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default JobTrendsChart;
