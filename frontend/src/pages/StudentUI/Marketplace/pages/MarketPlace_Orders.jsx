import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/M_ShopContext';
import M_Title from '../components/M_Title';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';
import OrderTrackingModal from '../components/OrderTrackingModal';

const MarketPlace_Orders = ({ user, setUser }) => {
  const { token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderLocation, setOrderLocation] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadOrderData = async () => {
    try {
      const studentToken = localStorage.getItem('studentToken');
      if (!studentToken) return;
      setLoading(true);

      const { data } = await axios.post(
        'http://localhost:5001/api/order/M_userorders',
        {},
        { headers: { token: studentToken } }
      );

      if (data?.success) {
        const sortedOrders = (data.orders || [])
          .slice()
          .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

        const allOrdersItem = sortedOrders.flatMap((order) =>
          (order.items || []).map((item) => ({
            ...item,
            status: order.status,
            date: order.date || order.createdAt,
            lat: order.location?.lat ?? null,
            lng: order.location?.lng ?? null,
            orderId: order._id,
          }))
        );

        setOrderData(allOrdersItem);
      } else {
        setOrderData([]);
      }
    } catch (error) {
      console.error('Orders API not available:', error);
      setOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  const formatDate = (d) => {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  const getStatusConfig = (status) => {
    const text = (status || 'Processing').toString().toLowerCase();
    
    if (/delivered|completed/.test(text)) {
      return {
        label: 'Delivered',
        bg: 'bg-orange-500',
        text: 'text-orange-700',
        lightBg: 'bg-orange-50'
      };
    } else if (/shipped|ready/.test(text)) {
      return {
        label: 'Shipped',
        bg: 'bg-yellow-500',
        text: 'text-yellow-700',
        lightBg: 'bg-yellow-50'
      };
    } else {
      return {
        label: 'Processing',
        bg: 'bg-orange-400',
        text: 'text-orange-700',
        lightBg: 'bg-orange-50'
      };
    }
  };

  const handleTrackOrder = async (item) => {
    try {
      if (!item.orderId) {
        toast.error("Order ID missing");
        return;
      }

      setSelectedOrder(item);

      if (item.lat && item.lng) {
        setOrderLocation({ lat: item.lat, lng: item.lng });
        setShowTrackingModal(true);
      } else {
        try {
          const studentToken = localStorage.getItem('studentToken');
          const { data } = await axios.post(
            "http://localhost:5001/api/order/M_userorders",
            {},
            { headers: { token: studentToken } }
          );

          if (data.success && data.orders) {
            const order = data.orders.find(o => o._id === item.orderId);
            if (order?.location?.lat && order?.location?.lng) {
              const { lat, lng } = order.location;
              setOrderLocation({ lat, lng });
              setShowTrackingModal(true);
            } else {
              setOrderLocation(null);
              setShowTrackingModal(true);
            }
          } else {
            toast.error("Unable to fetch order information.");
          }
        } catch (fetchError) {
          console.error("Error fetching order location:", fetchError);
          toast.error("Order tracking not available.");
        }
      }
    } catch (error) {
      console.error("Track Order failed:", error);
      toast.error("Failed to track order.");
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orderData;
    return orderData.filter(item => {
      const status = (item.status || '').toLowerCase();
      if (filter === 'delivered') return /delivered|completed/.test(status);
      if (filter === 'shipped') return /shipped|ready/.test(status);
      if (filter === 'processing') return /processing|pending/.test(status);
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div>
      <MarketPlace_Navbar user={user} setUser={setUser} />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="p-8 pt-24 max-w-6xl mx-auto">
          
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-orange-600 mb-2'>My Orders</h1>
            <p className='text-gray-600'>Track and manage your purchases</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {[
                { key: 'all', label: 'All', count: orderData.length },
                { key: 'delivered', label: 'Delivered', count: orderData.filter(o => /delivered|completed/.test((o.status || '').toLowerCase())).length },
                { key: 'shipped', label: 'Shipped', count: orderData.filter(o => /shipped|ready/.test((o.status || '').toLowerCase())).length },
                { key: 'processing', label: 'Processing', count: orderData.filter(o => /processing|pending/.test((o.status || '').toLowerCase())).length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500'></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredOrders.length === 0 && (
            <div className='text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200'>
              <div className='text-gray-400 mb-4'>
                <svg className='w-16 h-16 mx-auto' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' clipRule='evenodd' />
                </svg>
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>No {filter === 'all' ? '' : filter} orders found</h3>
              <p className='text-gray-500'>
                {filter === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `You don't have any ${filter} orders at the moment.`
                }
              </p>
            </div>
          )}

          {/* Orders List */}
          {!loading && filteredOrders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map((item, index) => {
                const img = Array.isArray(item.image) ? item.image[0] : typeof item.image === 'string' ? item.image : '';
                const statusConfig = getStatusConfig(item.status);

                return (
                  <div
                    key={`${item._id || item.productId || index}-${index}`}
                    className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'
                  >
                    <div className='flex items-start justify-between gap-6'>
                      <div className='flex items-start gap-6 flex-1'>
                        {/* Image */}
                        <img
                          className='w-20 h-20 object-cover rounded-lg border border-gray-200'
                          src={img}
                          alt={item.name || 'Product'}
                          onError={(e) => { e.currentTarget.src = ''; }}
                        />
                        
                        {/* Details */}
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold text-gray-900 mb-2'>{item.name || 'Unnamed product'}</h3>
                          
                          <div className='grid grid-cols-3 gap-4 mb-3'>
                            <div>
                              <p className='text-sm text-gray-600'>Price</p>
                              <p className='font-semibold text-gray-900'>{currency}{item.price ?? 0}</p>
                            </div>
                            <div>
                              <p className='text-sm text-gray-600'>Quantity</p>
                              <p className='font-semibold text-gray-900'>{item.quantity ?? 1}</p>
                            </div>
                            <div>
                              <p className='text-sm text-gray-600'>Size</p>
                              <p className='font-semibold text-gray-900'>{item.size ?? '-'}</p>
                            </div>
                          </div>
                          
                          <p className='text-sm text-gray-500'>Order Date: {formatDate(item.date)}</p>
                        </div>
                      </div>
                      
                      {/* Status & Action */}
                      <div className='flex flex-col items-end gap-3'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.lightBg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                        <button
                          onClick={() => handleTrackOrder(item)}
                          className='px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors'
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={showTrackingModal}
        onClose={() => {
          setShowTrackingModal(false);
          setSelectedOrder(null);
          setOrderLocation(null);
        }}
        orderData={selectedOrder}
        location={orderLocation}
      />
    </div>
  );
};

export default MarketPlace_Orders;