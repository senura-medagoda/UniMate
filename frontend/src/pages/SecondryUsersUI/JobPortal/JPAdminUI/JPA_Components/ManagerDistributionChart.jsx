import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ManagerDistributionChart = ({ data }) => {
  // Get manager data from props
  const verifiedManagers = data?.stats?.verifiedManagers || 0;
  const unverifiedManagers = data?.stats?.unverifiedManagers || 0;
  const rejectedManagers = data?.stats?.rejectedManagers || 0;
  const totalManagers = verifiedManagers + unverifiedManagers + rejectedManagers;

  const chartData = {
    labels: ['Verified', 'Unverified', 'Rejected'],
    datasets: [
      {
        data: [verifiedManagers, unverifiedManagers, rejectedManagers],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green for verified
          'rgba(249, 115, 22, 0.8)',  // Orange for unverified
          'rgba(239, 68, 68, 0.8)'    // Red for rejected
        ],
        borderColor: [
          'rgb(34, 197, 94)',   // Green border
          'rgb(249, 115, 22)',  // Orange border
          'rgb(239, 68, 68)'    // Red border
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(249, 115, 22, 0.9)',
          'rgba(239, 68, 68, 0.9)'
        ],
        hoverBorderColor: [
          'rgb(34, 197, 94)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)'
        ],
        hoverBorderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const percentage = totalManagers > 0 ? ((value / totalManagers) * 100).toFixed(1) : 0;
                
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(249, 115, 22, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = totalManagers > 0 ? ((value / totalManagers) * 100).toFixed(1) : 0;
            return `${label}: ${value} managers (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 2
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

  // If no data, show empty state
  if (totalManagers === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No manager data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default ManagerDistributionChart;
