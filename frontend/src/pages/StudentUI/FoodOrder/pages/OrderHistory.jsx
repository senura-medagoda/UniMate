import React, { useEffect, useState } from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context';
import FoodNavbar from '../components/navbar/FoodNavbar';
import Footer from '../components/Footer';

const OrderHistoryContent = () => {
  const { user, makeAuthenticatedRequest, currency = 'Rs.', navigate } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(null);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for order history...');
      const resp = await makeAuthenticatedRequest(`http://localhost:5001/api/orders/student`);
      const data = await resp.json();
      console.log('Orders fetched:', data);
      if (data.success) {
        setOrders(data.orders || []);
        console.log('Orders set:', data.orders?.length || 0);
      }
    } catch (e) {
      console.error('fetch orders error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  const deleteOrder = async (orderId) => {
    try {
      setActionBusy(orderId);
      const resp = await makeAuthenticatedRequest(`http://localhost:5001/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await resp.json();
      if (data.success) setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (e) { console.error('delete order error', e); }
    finally { setActionBusy(null); }
  };

  const history = orders.filter(o => {
    const isHistoryOrder = (o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved');
    console.log(`Order ${o._id}: status=${o.orderStatus}, cancelStatus=${o.cancelStatus}, isHistory=${isHistoryOrder}`);
    return isHistoryOrder;
  });
  
  console.log('Total orders:', orders.length);
  console.log('History orders:', history.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      <FoodNavbar />
      <div className="pt-24 pb-10 max-w-6xl mx-auto px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Order History</h1>
            <p className="text-gray-600">Delivered and cancelled orders</p>
          </div>
          <button onClick={()=>navigate('/student/my-orders')} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Back to Active Orders</button>
        </div>
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">No order history yet.</div>
        ) : (
          <div className="space-y-5">
            {history.map((o) => (
              <div key={o._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex-1 min-w-[220px]">
                    <div className="text-sm text-gray-500">Order ID</div>
                    <div className="font-mono text-sm break-all">{o._id}</div>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                      {o.orderStatus === 'Cancelled' || o.cancelStatus === 'Approved' ? 'Cancelled' : 'Delivered'}
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
                    <div className="text-gray-800">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                </div>
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
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Delivery:</span> {o.address}
                  </div>
                  <button onClick={() => deleteOrder(o._id)} disabled={actionBusy === o._id} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50">{actionBusy === o._id ? 'Deleting...' : 'Delete'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const OrderHistory = ({ user, setUser }) => (
  <AppContextProvider user={user} setUser={setUser}>
    <OrderHistoryContent />
  </AppContextProvider>
);

export default OrderHistory;





