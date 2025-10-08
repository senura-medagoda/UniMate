import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/M_ShopContext';
import M_Title from '../components/M_Title';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';

const MarketPlace_Orders = ({ user, setUser }) => {
  const { token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

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
        console.log('No orders found or API returned error:', data?.message);
      }
    } catch (error) {
      console.error('Orders API not available:', error);
      setOrderData([]);
      // Don't show error toast - just show empty orders
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

  const statusBadge = (status) => {
    const text = (status || 'Processing').toString();
    const isGood = /delivered|completed|shipped|ready/i.test(text);
    const base =
      'flex items-center gap-3 px-4 py-2 rounded-full border text-sm font-semibold';
    return (
      <div
        className={
          isGood
            ? `${base} bg-green-50 border-green-200 text-green-700`
            : `${base} bg-amber-50 border-amber-200 text-amber-700`
        }
      >
        <div className="relative">
          <div
            className={
              isGood ? 'w-3 h-3 bg-green-500 rounded-full' : 'w-3 h-3 bg-amber-500 rounded-full'
            }
          />
          <div
            className={
              isGood
                ? 'absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75'
                : 'absolute inset-0 w-3 h-3 bg-amber-500 rounded-full animate-ping opacity-75'
            }
          />
        </div>
        <span>{text}</span>
      </div>
    );
  };

  // 🆕 Track order by opening Google Maps with current delivery location
  const handleTrackOrder = async (item) => {
    try {
      if (!item.orderId) {
        alert("Order ID missing");
        return;
      }

      // Check if we have location data
      if (item.lat && item.lng) {
        // Open Google Maps with existing location
        const googleMapsUrl = `https://www.google.com/maps?q=${item.lat},${item.lng}`;
        window.open(googleMapsUrl, "_blank");
      } else {
        // Fetch latest location from backend
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
              const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
              window.open(googleMapsUrl, "_blank");
            } else {
              alert("Location not available yet. The delivery person hasn't started delivery.");
            }
          } else {
            alert("Unable to fetch order information. Please try again later.");
          }
        } catch (fetchError) {
          console.error("Error fetching order location:", fetchError);
          alert("Order tracking not available. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Track Order failed:", error);
      alert("Failed to track order. Please try again.");
    }
  };

  return (
    <div className="mr-10 ml-10">
      <MarketPlace_Navbar user={user} setUser={setUser} />
      <div className="border-t pt-16 mb-20">
        <div className="text-2xl mb-8">
          <M_Title text1={'MY '} text2={'ORDERS'} />
        </div>

        {loading && (
          <div className="text-center text-gray-600 py-12">Loading your orders…</div>
        )}

        {!loading && orderData.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            You don’t have any orders yet.
          </div>
        )}

        {!loading && orderData.length > 0 && (
          <div className="space-y-6">
            {orderData.map((item, index) => {
              const img =
                Array.isArray(item.image) ? item.image[0] :
                typeof item.image === 'string' ? item.image :
                '';

              return (
                <div
                  key={`${item._id || item.productId || index}-${index}`}
                  className="bg-gradient-to-br from-orange-50/90 to-yellow-50/90 backdrop-blur-md rounded-2xl p-6 border border-orange-200/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Product Info */}
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <img
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md border border-white/50"
                          src={img}
                          alt={item.name || 'Product'}
                          onError={(e) => { e.currentTarget.src = ''; }}
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {item.quantity ?? 1}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {item.name || 'Unnamed product'}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-orange-600">
                              {currency}{item.price ?? 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-orange-700">Q</span>
                            </div>
                            <span className="font-medium">
                              Qty: {item.quantity ?? 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-orange-700">S</span>
                            </div>
                            <span className="font-medium">
                              Size: {item.size ?? '-'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Order Date:</span>
                          <span className="font-semibold text-gray-700">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-4 lg:min-w-fit">
                      {statusBadge(item.status)}
                      <button
                        onClick={() => handleTrackOrder(item)}
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
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
  );
};

export default MarketPlace_Orders;
