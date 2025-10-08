import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';
import VendorNavbar from '../components/VendorNavbar';
import { useToast } from '@/context/ToastContext';
import profileImage from '../../../../StudentUI/FoodOrder/assets/profile.png';

const VendorDashboard = () => {
  const { vendor, refreshVendorData } = useVendorAuth();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [hasShop, setHasShop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuStats, setMenuStats] = useState({
    totalItems: 0,
    availableItems: 0,
    popularItems: 0
  });
  const [menuItems, setMenuItems] = useState([]);
  const [refreshingMenu, setRefreshingMenu] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    console.log('VendorDashboard useEffect - vendor:', vendor);
    console.log('VendorDashboard useEffect - vendor ID:', vendor?._id);
    
    // Refresh vendor data to get latest approval status
    refreshVendorData();
    fetchShopData();
    
    if (vendor && !localStorage.getItem('welcomeNotificationShown')) {
      toastSuccess(`Welcome back, ${vendor.businessName || vendor.email}! 👋`);
      localStorage.setItem('welcomeNotificationShown', 'true');
    }
  }, []);


  useEffect(() => {
    console.log('hasShop changed to:', hasShop);
    if (hasShop) {
      console.log('hasShop is true, calling fetchMenuStats');
      fetchMenuStats();
    } else {
      console.log('hasShop is false, not calling fetchMenuStats');
    }
  }, [hasShop]);

  // Effect to handle vendor approval status changes
  useEffect(() => {
    if (vendor?.approvalStatus === 'approved' && !localStorage.getItem('vendorApprovedNotificationShown')) {
      toastSuccess('🎉 Your vendor account has been approved! You can now create shops and start accepting orders.');
      localStorage.setItem('vendorApprovedNotificationShown', 'true');
    }
  }, [vendor?.approvalStatus]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vendorToken');
      console.log('Fetching shop data with token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const response = await fetch('http://localhost:5001/api/shop/details', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Shop API response:', data);
        setShopData(data.data);
        setHasShop(true);
       
        localStorage.removeItem('shopNotificationShown');
        
      } else if (response.status === 404) {
       
        setHasShop(false);
        setShopData(null);
       
        if (!hasShop && !localStorage.getItem('shopNotificationShown')) {
          toastInfo('No shop profile found. Please create your shop first.');
          localStorage.setItem('shopNotificationShown', 'true');
        }
      } else {
       
        console.error('Failed to load shop data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setHasShop(false);
      setShopData(null);
      
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuStats = async () => {
    try {
      if (!hasShop) {
        console.log('No shop found, skipping menu fetch');
        setMenuStats({ totalItems: 0, availableItems: 0, popularItems: 0 });
        setMenuItems([]);
        return;
      }

      console.log('Fetching menu items for vendor...');
      const token = localStorage.getItem('vendorToken');
      console.log('Vendor token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const response = await fetch('http://localhost:5001/api/menu/vendor', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Menu API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Menu API response data:', data);
        
        
        let items = [];
        if (data.data && data.data.menuItems && Array.isArray(data.data.menuItems)) {
          
          items = data.data.menuItems;
        } else if (data.data && Array.isArray(data.data)) {
        
          items = data.data;
        } else if (Array.isArray(data)) {
   
          items = data;
        } else {
          items = [];
        }
        
        console.log('Processed menu items:', items);
        console.log('Menu items count:', items.length);
        
        setMenuItems(items);
        
        const stats = {
          totalItems: items.length,
          availableItems: items.filter(item => item.isAvailable).length,
          popularItems: items.filter(item => item.isPopular).length
        };
        
        console.log('Calculated menu stats:', stats);
        setMenuStats(stats);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to load menu statistics:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error fetching menu stats:', error);
    }
  };


  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }
    
 
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
  
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5001${imagePath}`;
    }
    

    return `http://localhost:5001/uploads/${imagePath}`;
  };


  const viewItemDetails = (item) => {
    
    toastSuccess(`${item.name} - Rs.${item.price} | ${item.category} | ${item.isAvailable ? 'Available' : 'Unavailable'}`);
  };


  const refreshMenuData = () => {
    setRefreshingMenu(true);
    fetchMenuStats().finally(() => {
      setRefreshingMenu(false);
    });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };


  useEffect(() => {
    window.refreshDashboardMenu = refreshMenuData;
    return () => {
      delete window.refreshDashboardMenu;
    };
  }, []);

  const toggleItemAvailability = async (itemId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/menu/vendor/${itemId}/availability`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });

      if (response.ok) {
      
        setMenuItems(prev => prev.map(item => 
          item._id === itemId ? { ...item, isAvailable: !currentStatus } : item
        ));
        
        
        setMenuStats(prev => ({
          ...prev,
          availableItems: prev.availableItems + (currentStatus ? -1 : 1)
        }));
        
        toastSuccess(`Item ${!currentStatus ? 'made available' : 'made unavailable'}`);
      } else {
        toastError('Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toastError('Failed to update availability');
    }
  };

  const getQuickActions = () => {
    if (!hasShop) {
      return [
        {
          title: "Create Shop",
          description: "Set up your restaurant shop details",
          icon: "🏪",
          link: "/vendor/shop-details",
          color: "bg-orange-500"
        }
      ];
    }

    return [
      {
        title: "Manage Shop",
        description: "Update shop details and settings",
        icon: "🏪",
        link: "/vendor/shop-details",
        color: "bg-blue-500"
      },
      {
        title: "Menu Management",
        description: "Add, edit, or remove menu items",
        icon: "🍽️",
        link: "/vendor/menu-management",
        color: "bg-green-500"
      },
      {
        title: "View Orders",
        description: "Check incoming orders and status",
        icon: "📋",
        link: "/vendor/orders",
        color: "bg-purple-500"
      },
      {
        title: "Analytics",
        description: "View sales and performance data",
        icon: "📊",
        link: "/vendor/analytics",
        color: "bg-orange-500"
      }
    ];
  };

  const stats = [
    {
      title: "Total Orders",
      value: shopData?.totalOrders || 0,
      change: "+12%",
      changeType: "positive",
      icon: "📦"
    },
    {
      title: "Total Revenue",
      value: `Rs.${(shopData?.totalRevenue || 0).toLocaleString()}`,
      change: "+8%",
      changeType: "positive",
      icon: "💰"
    },
    {
      title: "Average Rating",
      value: shopData?.averageRating || 0,
      change: "+0.2",
      changeType: "positive",
      icon: "⭐"
    },
    {
      title: "Menu Items",
      value: menuStats.totalItems,
      change: "+2",
      changeType: "positive",
      icon: "🍽️"
    }
  ];

  const recentActivity = [
    {
      type: "order",
      message: "New order #1234 received",
      time: "2 minutes ago",
      icon: "📦"
    },
    {
      type: "review",
      message: "New 5-star review received",
      time: "15 minutes ago",
      icon: "⭐"
    },
    {
      type: "menu",
      message: "Menu item 'Butter Chicken' updated",
      time: "1 hour ago",
      icon: "🍽️"
    },
    {
      type: "order",
      message: "Order #1230 completed",
      time: "2 hours ago",
      icon: "✅"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavbar />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
         
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {vendor?.profileImage ? (
                    <img 
                      src={vendor.profileImage} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                    />
                  ) : (
                    <img 
                      src={profileImage} 
                      alt="Default Profile" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                    />
                  )}
                </div>
                
                {/* Welcome Text */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {vendor?.businessName || vendor?.ownerName || 'Vendor'}! 👋
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Here's what's happening with your restaurant today
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Vendor Approval Status */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vendor?.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  vendor?.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {vendor?.approvalStatus === 'approved' ? 'Account Approved' :
                   vendor?.approvalStatus === 'rejected' ? 'Account Rejected' :
                   '⏳ Account Pending'}
                </span>
                
                {hasShop ? (
                  <>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      shopData?.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {shopData?.isOpen ? '🟢 Open' : '🔴 Closed'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      shopData?.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      shopData?.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {shopData?.approvalStatus === 'approved' ? 'Shop Approved' :
                       shopData?.approvalStatus === 'rejected' ? 'Shop Rejected' :
                       '⏳ Shop Pending'}
                    </span>
                  </>
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    ⚠️ No Shop Created
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Shop Approval Status Notifications */}
          {hasShop && shopData?.approvalStatus === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Shop Pending Approval</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Your shop is currently under review by our admin team. You'll be notified once it's approved and can start accepting orders.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasShop && shopData?.approvalStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Shop Rejected</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Your shop application was rejected. Reason: {shopData?.rejectionReason || 'No reason provided'}</p>
                    <p className="mt-1">Please update your shop details and resubmit for approval.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Approval Status Notifications */}
          {vendor?.approvalStatus === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Account Pending Approval</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Your vendor account is currently under review by our admin team. You'll be notified once it's approved and can start creating shops.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {vendor?.approvalStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Account Rejected</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Your vendor account was rejected. Reason: {vendor?.rejectionReason || 'No reason provided'}</p>
                    <p className="mt-1">Please contact support for more information or to resubmit your application.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          
          {!hasShop && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-yellow-600 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Create Your Shop First</h3>
                <p className="text-yellow-700 mb-4">
                  You need to create a shop before you can manage menus and receive orders.
                </p>
                <button
                  onClick={() => navigate('/vendor/shop-details')}
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  🏪 Create Shop Now
                </button>
              </div>
            </div>
          )}

       
          {hasShop && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                  <div className="mt-4">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getQuickActions().map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{action.icon}</div>
                        <div>
                          <h3 className="font-medium text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

        
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-lg">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        
          {hasShop && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">Your Menu Items</h2>
                    {refreshingMenu && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              {menuStats.totalItems === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🍽️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Menu Items Yet</h3>
                  <p className="text-gray-600 mb-4">Start building your menu by adding your first dish</p>
                  <Link
                    to="/vendor/menu-management"
                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add First Item
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {menuItems.slice(0, 8).map((item) => (
                    <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  
                      <div className="relative">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=🍽️+No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center text-4xl">
                            🍽️
                          </div>
                        )}
                        
                   
                        <div className="absolute top-2 right-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        
                       
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      
                    
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-3" style={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>{item.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-orange-600">Rs.{item.price}</span>
                          <span className="text-xs text-gray-500">{item.preparationTime || 15} min</span>
                        </div>
                        
                     
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => toggleItemAvailability(item._id, item.isAvailable)}
                            className={`p-2 rounded-lg transition-colors ${
                              item.isAvailable
                                ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                            }`}
                            title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                          >
                            {item.isAvailable ? '🟡' : '🟢'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {menuStats.totalItems > 8 && (
                <div className="text-center mt-6">
                  <span className="text-gray-500 text-sm">
                    Showing 8 of {menuStats.totalItems} menu items
                  </span>
                </div>
              )}
            </div>
          )}

       
          {hasShop && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shop Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{shopData?.totalReviews || 0}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{shopData?.deliveryRadius || 0} km</div>
                  <div className="text-sm text-gray-600">Delivery Radius</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Rs.{shopData?.minimumOrderAmount || 0}</div>
                  <div className="text-sm text-gray-600">Minimum Order</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{shopData?.preparationTime || 0} min</div>
                  <div className="text-sm text-gray-600">Prep Time</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default VendorDashboard;

