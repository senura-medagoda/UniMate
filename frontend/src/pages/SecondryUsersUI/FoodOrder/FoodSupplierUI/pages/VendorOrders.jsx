import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';
import VendorNavbar from '../components/VendorNavbar';
import { useToast } from '@/context/ToastContext';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Truck,
  Package,
  AlertCircle,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
  Send,
  TruckIcon,
  ChevronDown
} from 'lucide-react';

const VendorOrders = () => {
  const { vendor } = useVendorAuth();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shipmentData, setShipmentData] = useState({
    trackingNumber: '',
    estimatedDeliveryTime: '',
    notes: ''
  });
  const [updatingStatus, setUpdatingStatus] = useState({});

  const statusOptions = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'Order Placed', label: 'Order Placed', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'Packing', label: 'Packing', color: 'blue' },
    { value: 'preparing', label: 'Preparing', color: 'orange' },
    { value: 'Shipped', label: 'Shipped', color: 'orange' },
    { value: 'ready', label: 'Ready', color: 'purple' },
    { value: 'Out for Delivery', label: 'Out for Delivery', color: 'purple' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'Delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'Cancelled', label: 'Cancelled', color: 'red' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vendorToken');
      
      console.log('Fetching vendor orders with token:', token ? 'Token present' : 'No token');
      
      const response = await fetch('http://localhost:5001/api/orders/vendor', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Vendor orders data:', data);
        setOrders(data.orders || []);
        
        // Orders loaded successfully
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch orders:', response.status, errorData);
        toastError(`Failed to load orders: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toastError(`Failed to load orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toastSuccess('Orders refreshed successfully!');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      const token = localStorage.getItem('vendorToken');
      
      console.log('Making API call to update status...');
      const response = await fetch(`http://localhost:5001/api/orders/vendor/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      console.log('API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Status update successful:', data);
        toastSuccess(`Order status updated to ${newStatus}`);
        await fetchOrders(); // Refresh orders
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Status update failed:', errorData);
        toastError(`Failed to update order status: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toastError('Failed to update order status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const openShipmentModal = (order) => {
    setSelectedOrder(order);
    setShipmentData({
      trackingNumber: '',
      estimatedDeliveryTime: '',
      notes: ''
    });
    setShowShipmentModal(true);
  };

  const closeShipmentModal = () => {
    setShowShipmentModal(false);
    setSelectedOrder(null);
    setShipmentData({
      trackingNumber: '',
      estimatedDeliveryTime: '',
      notes: ''
    });
  };

  const handleShipmentSubmit = async () => {
    try {
      const token = localStorage.getItem('vendorToken');
      
      const response = await fetch(`http://localhost:5001/api/orders/vendor/${selectedOrder._id}/ship`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipmentData)
      });

      if (response.ok) {
        const data = await response.json();
        toastSuccess('Order marked as shipped! Admin and customer have been notified.');
        closeShipmentModal();
        await fetchOrders(); // Refresh orders
      } else {
        const errorData = await response.json().catch(() => ({}));
        toastError(`Failed to mark as shipped: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error marking order as shipped:', error);
      toastError('Failed to mark order as shipped');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': 
      case 'Order Placed': return <Clock className="w-4 h-4" />;
      case 'confirmed': 
      case 'Packing': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': 
      case 'Shipped': return <Package className="w-4 h-4" />;
      case 'ready': 
      case 'Out for Delivery': return <Truck className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': 
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': 
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': 
      case 'Order Placed': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': 
      case 'Packing': return 'bg-blue-100 text-blue-800';
      case 'preparing': 
      case 'Shipped': return 'bg-orange-100 text-orange-800';
      case 'ready': 
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': 
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': 
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.studentId?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesDate = !dateFilter || new Date(order.createdAt).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === 'delivered' || order.status === 'Delivered')
      .reduce((total, order) => total + (order.totalAmount || 0), 0);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => 
        o.status === 'pending' || 
        o.status === 'Order Placed' || 
        o.status === 'confirmed' || 
        o.status === 'Packing' || 
        o.status === 'preparing' || 
        o.status === 'Shipped' || 
        o.status === 'ready' || 
        o.status === 'Out for Delivery'
      ).length,
      delivered: orders.filter(o => 
        o.status === 'delivered' || 
        o.status === 'Delivered'
      ).length,
      cancelled: orders.filter(o => 
        o.status === 'cancelled' || 
        o.status === 'Cancelled'
      ).length
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VendorNavbar />
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-4" />
                <p className="text-gray-600">Loading orders...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavbar />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/vendor/dashboard')}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                  <p className="text-gray-600 mt-1">Manage your shop's food orders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">Rs.{getTotalRevenue().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by order number, student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Orders ({filteredOrders.length})
              </h2>
            </div>
            
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {orders.length === 0 
                    ? "You haven't received any orders yet. Start promoting your menu to get orders!"
                    : "No orders match your current filters. Try adjusting your search criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-900">
                              #{order.orderNumber || order._id?.slice(-6)}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span>{order.studentName || `Student ${order.studentId?.slice(-6)}`}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <CreditCard className="w-4 h-4 mr-2" />
                            <span className="font-medium">Rs.{order.totalAmount?.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
                          <div className="space-y-1">
                            {order.foodItems?.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="font-medium">Rs.{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {order.deliveryAddress && (
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Delivery Address:</p>
                              <p>{order.deliveryAddress}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-4 ml-6">
                        {/* Status Update Dropdown */}
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">Update Status:</label>
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              disabled={updatingStatus[order._id]}
                              className="appearance-none bg-white border border-orange-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packing">Packing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {updatingStatus[order._id] && (
                            <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
                          )}
                        </div>
                        
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shipment Modal */}
      {showShipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Mark Order as Shipped</h3>
                <button
                  onClick={closeShipmentModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={shipmentData.trackingNumber}
                    onChange={(e) => setShipmentData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery Time
                  </label>
                  <input
                    type="datetime-local"
                    value={shipmentData.estimatedDeliveryTime}
                    onChange={(e) => setShipmentData(prev => ({ ...prev, estimatedDeliveryTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Notes (Optional)
                  </label>
                  <textarea
                    value={shipmentData.notes}
                    onChange={(e) => setShipmentData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes about the shipment..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeShipmentModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShipmentSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Mark as Shipped
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
