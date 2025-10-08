import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    {
      title: 'Review Pending Vendors',
      description: 'Check and approve new vendor applications',
      icon: '⏳',
      link: '/food/admin/vendors?status=pending',
      color: 'orange'
    },
    {
      title: 'Manage Shops',
      description: 'View and manage all shop listings',
      icon: '🏪',
      link: '/food/admin/shops',
      color: 'orange'
    },
    {
      title: 'View Analytics',
      description: 'Check platform performance metrics',
      icon: '📊',
      link: '/food/admin/analytics',
      color: 'green'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: '⚙️',
      link: '/food/admin/settings',
      color: 'gray'
    }
  ];

  const colorClasses = {
    orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    gray: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
      </div>
      
      <div className="p-6 space-y-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`block p-4 rounded-lg border transition-colors ${colorClasses[action.color]}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{action.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;


