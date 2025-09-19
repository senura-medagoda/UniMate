import React from 'react';
import { Link } from 'react-router-dom';

const RecentVendors = ({ vendors }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusInfo = (vendor) => {
    // If vendor is not approved, show pending
    if (vendor.approvalStatus === 'pending' || !vendor.isApproved) {
      return {
        text: 'Pending Approval',
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⏳'
      };
    }
    
    // If vendor is approved, check shop status
    if (vendor.shops && vendor.shops.length > 0) {
      const latestShop = vendor.shops[0];
      if (latestShop.approvalStatus === 'pending' || !latestShop.isApproved) {
        return {
          text: 'Shop Pending',
          color: 'bg-orange-100 text-orange-800',
          icon: '🏪'
        };
      } else if (latestShop.approvalStatus === 'approved' && latestShop.isApproved) {
        return {
          text: 'Approved',
          color: 'bg-green-100 text-green-800',
          icon: '✅'
        };
      }
    }
    
    // If vendor is approved but no shops
    return {
      text: 'Approved',
      color: 'bg-green-100 text-green-800',
      icon: '✅'
    };
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Vendors</h3>
          <Link
            to="/admin/vendors"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {vendors.length > 0 ? (
          vendors.map((vendor, index) => {
            const statusInfo = getStatusInfo(vendor);
            const latestShop = vendor.shops && vendor.shops.length > 0 ? vendor.shops[0] : null;
            
            return (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {vendor.ownerName?.charAt(0) || 'V'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {vendor.businessName || vendor.ownerName}
                      </p>
                      <p className="text-sm text-gray-500">{vendor.email}</p>
                      {latestShop && (
                        <p className="text-xs text-gray-400 mt-1">
                          Shop: {latestShop.businessName} • {latestShop.address.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{formatDate(vendor.createdAt)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <span className="mr-1">{statusInfo.icon}</span>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">👥</div>
            <p className="text-gray-500">No recent vendors</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentVendors;


