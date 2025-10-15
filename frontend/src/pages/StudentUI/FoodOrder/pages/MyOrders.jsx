import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context';
import FoodNavbar from '../components/navbar/FoodNavbar';
import Footer from '../components/Footer';

const MyOrdersContent = () => {
  const { user, makeAuthenticatedRequest, currency = 'Rs.' } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      // Get userId from user context or localStorage
      const userId = user?._id || user?.id || JSON.parse(localStorage.getItem('studentUser') || '{}')._id;
      
      console.log('fetchOrders called with userId:', userId);
      console.log('user object:', user);
      
      if (!userId) {
        console.error('No user ID found');
        setLoading(false);
        return;
      }

      console.log('Making request to fetch orders...');
      const resp = await makeAuthenticatedRequest(`http://localhost:5001/api/orders/student`);
      console.log('Orders API response status:', resp.status);
      
      if (!resp.ok) {
        console.error('Orders API request failed with status:', resp.status);
        const errorData = await resp.json().catch(() => ({}));
        console.error('Error response data:', errorData);
        setOrders([]);
        setLoading(false);
        return;
      }
      
      const data = await resp.json();
      console.log('Orders API response data:', data);
      
      if (data.success) {
        console.log('Orders fetched successfully:', data.orders?.length || 0);
        console.log('Raw orders data:', data.orders);
        
        // Ensure orders have the correct structure
        const processedOrders = (data.orders || []).map(order => ({
          ...order,
          foodItems: order.foodItems || [],
          totalAmount: order.totalAmount || 0,
          address: order.address || '',
          paymentMethod: order.paymentMethod || 'Unknown',
          paymentStatus: order.paymentStatus || 'Unknown',
          orderStatus: order.orderStatus || 'Unknown',
          createdAt: order.createdAt || order.orderDate || new Date()
        }));
        
        setOrders(processedOrders);
      } else {
        console.error('Failed to fetch orders:', data.message);
        setOrders([]);
      }
    } catch (e) {
      console.error('fetch orders error', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, makeAuthenticatedRequest]);

  useEffect(() => {
    // Try to fetch orders even if user context is not available
    // as we can get user data from localStorage
    fetchOrders();
  }, [user, fetchOrders]);

  // Light polling so approved cancellations disappear automatically
  useEffect(() => {
    const id = setInterval(() => {
      fetchOrders();
    }, 10000); // 10s
    return () => clearInterval(id);
  }, []);

  const showCancelModalHandler = (orderId) => {
    setCancelOrderId(orderId);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const requestCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    console.log('requestCancel called with:', {
      cancelOrderId,
      cancelReason: cancelReason.trim(),
      user: user?._id || user?.id
    });

    try {
      setActionBusy(cancelOrderId);
      const url = `http://localhost:5001/api/orders/${cancelOrderId}/cancel`;
      const requestBody = { reason: cancelReason.trim() };
      
      console.log('Making cancel request to:', url);
      console.log('Request body:', requestBody);
      
      const resp = await makeAuthenticatedRequest(url, { 
        method: 'POST', 
        body: JSON.stringify(requestBody) 
      });
      
      console.log('Cancel request response status:', resp.status);
      const data = await resp.json();
      console.log('Cancel request response data:', data);
      
      if (data.success) {
        console.log('Cancel request successful, updating orders');
        setOrders(prev => prev.map(o => o._id === cancelOrderId ? data.order : o));
        setShowCancelModal(false);
        setCancelOrderId(null);
        setCancelReason('');
      } else {
        console.error('Cancel request failed:', data.message);
        alert(`Failed to cancel order: ${data.message}`);
      }
    } catch (e) {
      console.error('cancel request error', e);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setActionBusy(null);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelOrderId(null);
    setCancelReason('');
  };

  const deleteOrder = async (orderId) => {
    try {
      setActionBusy(orderId);
      const resp = await makeAuthenticatedRequest(`http://localhost:5001/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await resp.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
      }
    } catch (e) {
      console.error('delete order error', e);
    } finally {
      setActionBusy(null);
    }
  };

  // Deduplicate orders by _id to avoid accidental duplicates
  const uniqueOrders = useMemo(() => {
    const map = new Map();
    (orders || []).forEach(o => {
      if (o && o._id && !map.has(o._id)) map.set(o._id, o);
    });
    return Array.from(map.values());
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      <FoodNavbar />
      <div className="pt-24 pb-10 max-w-6xl mx-auto px-6">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track your recent purchases and their delivery progress</p>
          </div>
          <div className="flex gap-3">
            <a href="/student/order-history" className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">View Order History</a>
          </div>
        </div>
        {uniqueOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-3">📦</div>
            <div className="text-xl font-semibold text-gray-800 mb-2">You haven't ordered anything yet</div>
            <p className="text-gray-600 mb-6">Browse the menu and add some tasty food to your cart.</p>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p><strong>Debug Info:</strong></p>
              <p>User ID: {user?._id || user?.id || 'Not found'}</p>
              <p>Raw orders count: {orders?.length || 0}</p>
              <p>Unique orders count: {uniqueOrders?.length || 0}</p>
              <p>Active orders: {uniqueOrders?.filter(o => !(o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved')).length || 0}</p>
              <p>Completed orders: {uniqueOrders?.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved').length || 0}</p>
              {orders?.length > 0 && (
                <div className="mt-2">
                  <p><strong>Order Details:</strong></p>
                  {orders.slice(0, 3).map((order, idx) => (
                    <div key={idx} className="text-xs mt-1 p-2 bg-white rounded border">
                      <p>Order {idx + 1}: {order._id?.substring(0, 8)}...</p>
                      <p>Status: {order.orderStatus}</p>
                      <p>Payment: {order.paymentMethod} - {order.paymentStatus}</p>
                      <p>Amount: Rs. {order.totalAmount}</p>
                      <p>Items: {order.foodItems?.length || 0}</p>
                      <p>Address: {order.address?.substring(0, 20)}...</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <a href="/menu" className="inline-block px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition">Explore Menu</a>
          </div>
        ) : (
          <>
          {/* Active Orders */}
          <div className="space-y-5 mb-10">
            <h2 className="text-xl font-bold text-gray-800">Active Orders</h2>
            {uniqueOrders
              .filter(o => !(o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved'))
              .map((o) => (
              <div key={o._id} className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex-1 min-w-[220px]">
                    <div className="text-sm text-gray-500">Order ID</div>
                    <div className="font-mono text-sm break-all">{o._id}</div>
                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      o.orderStatus === 'Order Placed' ? 'bg-orange-50 text-orange-700' :
                      o.orderStatus === 'Packing' ? 'bg-blue-50 text-blue-700' :
                      o.orderStatus === 'Shipped' ? 'bg-purple-50 text-purple-700' :
                      o.orderStatus === 'Out for Delivery' ? 'bg-yellow-50 text-yellow-700' :
                      o.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700' :
                      o.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        o.orderStatus === 'Order Placed' ? 'bg-orange-500' :
                        o.orderStatus === 'Packing' ? 'bg-blue-500' :
                        o.orderStatus === 'Shipped' ? 'bg-purple-500' :
                        o.orderStatus === 'Out for Delivery' ? 'bg-yellow-500' :
                        o.orderStatus === 'Delivered' ? 'bg-green-500' :
                        o.orderStatus === 'Cancelled' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></span>
                      {o.orderStatus}
                    </div>
                    {/* Order Progress Indicator */}
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <div className={`flex items-center ${o.orderStatus === 'Order Placed' ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${o.orderStatus === 'Order Placed' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                          Order Placed
                        </div>
                        <div className="w-4 h-px bg-gray-300"></div>
                        <div className={`flex items-center ${o.orderStatus === 'Packing' ? 'text-orange-600 font-semibold' : o.orderStatus === 'Order Placed' ? 'text-gray-400' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${o.orderStatus === 'Packing' ? 'bg-orange-500' : o.orderStatus === 'Order Placed' ? 'bg-gray-300' : 'bg-gray-300'}`}></div>
                          Packing
                        </div>
                        <div className="w-4 h-px bg-gray-300"></div>
                        <div className={`flex items-center ${o.orderStatus === 'Shipped' ? 'text-orange-600 font-semibold' : ['Order Placed', 'Packing'].includes(o.orderStatus) ? 'text-gray-400' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${o.orderStatus === 'Shipped' ? 'bg-orange-500' : ['Order Placed', 'Packing'].includes(o.orderStatus) ? 'bg-gray-300' : 'bg-gray-300'}`}></div>
                          Shipped
                        </div>
                        <div className="w-4 h-px bg-gray-300"></div>
                        <div className={`flex items-center ${o.orderStatus === 'Out for Delivery' ? 'text-orange-600 font-semibold' : ['Order Placed', 'Packing', 'Shipped'].includes(o.orderStatus) ? 'text-gray-400' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${o.orderStatus === 'Out for Delivery' ? 'bg-orange-500' : ['Order Placed', 'Packing', 'Shipped'].includes(o.orderStatus) ? 'bg-gray-300' : 'bg-gray-300'}`}></div>
                          Out for Delivery
                        </div>
                        <div className="w-4 h-px bg-gray-300"></div>
                        <div className={`flex items-center ${o.orderStatus === 'Delivered' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${o.orderStatus === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          Delivered
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-2xl font-bold text-gray-900">{currency} {Number(o.totalAmount).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Payment</div>
                    <div className="text-gray-800">{o.paymentMethod} • {o.paymentStatus}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Placed</div>
                    <div className="text-gray-800">{new Date(o.createdAt || o.orderDate).toLocaleString()}</div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-5">
                  <div className="text-sm font-medium text-gray-700 mb-2">Items</div>
                  <div className="divide-y rounded-lg border border-gray-100 overflow-hidden">
                    {o.foodItems?.map((fi, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/50">
                        <div className="text-gray-800">{fi.name} × {fi.quantity}</div>
                        <div className="font-semibold">{currency} {(fi.price * fi.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address & Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Delivery:</span> {o.address}
                  </div>
                  <div className="flex gap-2">
                    <a href="/menu" className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Order More</a>
                    <a href="/cart" className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Reorder</a>
                    {(!o.cancelRequested && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled') && (
                      <button
                        onClick={() => showCancelModalHandler(o._id)}
                        disabled={actionBusy === o._id}
                        className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {actionBusy === o._id ? 'Requesting...' : 'Request Cancel'}
                      </button>
                    )}
                    {o.cancelRequested && (
                      <span className="px-3 py-2 rounded-lg text-sm bg-yellow-50 text-yellow-700">Cancellation {o.cancelStatus || 'Requested'}</span>
                    )}
                    {(o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved') && (
                      <button
                        onClick={() => deleteOrder(o._id)}
                        disabled={actionBusy === o._id}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {actionBusy === o._id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Orders */}
          {uniqueOrders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved').length > 0 && (
            <div className="space-y-5 mb-10">
              <h2 className="text-xl font-bold text-gray-800">Completed Orders</h2>
              {uniqueOrders
                .filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved')
                .map((o) => (
                <div key={o._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="flex-1 min-w-[220px]">
                      <div className="text-sm text-gray-500">Order ID</div>
                      <div className="font-mono text-sm break-all">{o._id}</div>
                      <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        o.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700' :
                        o.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          o.orderStatus === 'Delivered' ? 'bg-green-500' :
                          o.orderStatus === 'Cancelled' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></span>
                        {o.orderStatus}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-2xl font-bold text-gray-900">{currency} {Number(o.totalAmount).toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Payment</div>
                      <div className="text-gray-800">{o.paymentMethod} • {o.paymentStatus}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Placed</div>
                      <div className="text-gray-800">{new Date(o.createdAt || o.orderDate).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-5">
                    <div className="text-sm font-medium text-gray-700 mb-2">Items</div>
                    <div className="divide-y rounded-lg border border-gray-100 overflow-hidden">
                      {o.foodItems?.map((fi, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/50">
                          <div className="text-gray-800">{fi.name} × {fi.quantity}</div>
                          <div className="font-semibold">{currency} {(fi.price * fi.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address & Actions */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Delivery:</span> {o.address}
                    </div>
                    <div className="flex gap-2">
                      <a href="/menu" className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Order More</a>
                      <a href="/cart" className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Reorder</a>
                      {(o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved') && (
                        <button
                          onClick={() => deleteOrder(o._id)}
                          disabled={actionBusy === o._id}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {actionBusy === o._id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order history moved to dedicated page at /student/order-history */}
          </>
        )}
      </div>
      
      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for cancelling this order:</p>
            
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter your reason for cancellation..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              maxLength={500}
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={requestCancel}
                disabled={actionBusy === cancelOrderId || !cancelReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionBusy === cancelOrderId ? 'Submitting...' : 'Submit Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

const MyOrders = ({ user, setUser }) => {
  // Add safety check for user data
  if (!user) {
    return <div>Loading user data...</div>;
  }
  
  return (
    <AppContextProvider user={user} setUser={setUser}>
      <MyOrdersContent />
    </AppContextProvider>
  );
};

export default MyOrders;


