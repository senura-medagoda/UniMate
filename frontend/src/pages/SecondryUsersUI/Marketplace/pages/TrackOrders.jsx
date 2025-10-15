import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Admin_Navbar from "../components/Admin_Navbar";
import M_SIdebar from "../components/M_SIdebar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrackOrders = () => {
  const navigate = useNavigate();
  const [adminToken, setAdminToken] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingLocation, setUpdatingLocation] = useState(null);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please login as admin first!");
      navigate("/A_login");
      return;
    }
    setAdminToken(token);
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5001/api/order/M_list",
        {},
        { headers: { token: adminToken } }
      );

      if (data?.success) {
        // Filter orders with status "Out for delivery"
        const outForDeliveryOrders = (data.orders || []).filter(
          order => order.status === "Out for delivery"
        );
        setOrders(outForDeliveryOrders);
      } else {
        toast.error(data?.message || "Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchOrders();
    }
  }, [adminToken]);

  // Filter orders based on search, date, and category
  const filteredOrders = orders.filter((order) => {
    const orderItems = order.items || [];
    const address = order.address || {};
    const fullName = [address.firstName, address.lastName]
      .filter(Boolean)
      .join(" ");

    // Search filter
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      orderItems.some((item) =>
        (item.name || "").toLowerCase().includes(search.toLowerCase())
      );

    // Category filter
    const matchesCategory =
      categoryFilter === "All" ||
      orderItems.some((item) => item.category === categoryFilter);

    // Date filtering
    const orderDate = new Date(order.date || order.createdAt);
    const now = new Date();
    let matchesDate = true;

    if (dateFilter !== "All") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case "Today":
          const todayEnd = new Date(today);
          todayEnd.setHours(23, 59, 59, 999);
          matchesDate = orderDate >= today && orderDate <= todayEnd;
          break;
        case "Yesterday":
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayEnd = new Date(yesterday);
          yesterdayEnd.setHours(23, 59, 59, 999);
          matchesDate = orderDate >= yesterday && orderDate <= yesterdayEnd;
          break;
        case "Last 7 days":
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          matchesDate = orderDate >= sevenDaysAgo;
          break;
        case "Last 30 days":
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          matchesDate = orderDate >= thirtyDaysAgo;
          break;
        case "This month":
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          matchesDate = orderDate >= startOfMonth;
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  }).sort((a, b) => {
    // Sort by date - newest first
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA;
  });

  const handleUpdateTracking = async (orderId) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setUpdatingLocation(orderId);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const { data } = await axios.post(
            "http://localhost:5001/api/order/M_updateLocation",
            {
              orderId,
              lat: latitude,
              lng: longitude,
            }
          );

          if (data.success) {
            toast.success("Location updated successfully!");
            // Update the order in the local state
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order._id === orderId
                  ? {
                      ...order,
                      location: {
                        lat: latitude,
                        lng: longitude,
                        updatedAt: new Date(),
                      },
                    }
                  : order
              )
            );
          } else {
            toast.error(data.message || "Failed to update location");
          }
        } catch (error) {
          console.error("Error updating location:", error);
          toast.error("Failed to update location");
        } finally {
          setUpdatingLocation(null);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Failed to get location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        toast.error(errorMessage);
        setUpdatingLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const getLastUpdateTime = (updatedAt) => {
    if (!updatedAt) return "Never updated";
    const now = new Date();
    const updateTime = new Date(updatedAt);
    const diffInMinutes = Math.floor((now - updateTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (!adminToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Navbar />
      <div className="flex">
        {/* Fixed Sidebar */}
        <M_SIdebar />

        {/* Main Content with left margin for fixed sidebar */}
        <div className="flex-1 lg:ml-64 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Track Orders</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage real-time delivery tracking for orders out for delivery
                </p>
              </div>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="This month">This month</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Hostel & Essentials">Hostel & Essentials</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
              </select>

              {/* Clear Filters */}
              {(search || dateFilter !== "All" || categoryFilter !== "All") && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {[search && "Search", dateFilter !== "All" && "Date", categoryFilter !== "All" && "Category"]
                      .filter(Boolean).length} active
                  </span>
                  <button
                    onClick={() => {
                      setSearch("");
                      setDateFilter("All");
                      setCategoryFilter("All");
                    }}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders out for delivery
                {(search || dateFilter !== "All" || categoryFilter !== "All") && (
                  <span className="text-blue-600 font-medium"> (filtered)</span>
                )}
              </p>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading orders...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {orders.length === 0 
                    ? "No orders out for delivery" 
                    : "No orders match your filters"
                  }
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {orders.length === 0 
                    ? "There are currently no orders with \"Out for delivery\" status."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderItems = order.items || [];
                  const address = order.address || {};
                  const fullName = [address.firstName, address.lastName]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-50 p-2 rounded-lg">
                            <svg
                              className="h-5 w-5 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Order #{order._id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.date)}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Out for delivery
                        </span>
                      </div>

                      {/* Order Content */}
                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Customer & Items Info */}
                        <div className="lg:col-span-2 space-y-4">
                          {/* Customer Info */}
                          {fullName && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                Customer Details
                              </h4>
                              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                                <p className="font-medium text-gray-900">{fullName}</p>
                                {address.phone && (
                                  <p className="text-sm text-gray-500">📞 {address.phone}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                  {[
                                    address.street,
                                    address.city,
                                    address.state,
                                    address.zipcode,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Items */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                              </svg>
                              Items ({orderItems.length})
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex flex-wrap gap-2">
                                {orderItems.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-white px-2 py-1 rounded text-sm border border-gray-200"
                                  >
                                    {item.name} x {item.quantity}
                                    {item.size && (
                                      <span className="text-gray-500 text-xs">
                                        {" "}
                                        ({item.size})
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tracking Info & Actions */}
                        <div className="space-y-4">
                          {/* Current Location Info */}
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Current Location
                            </h4>
                            
                            {order.location?.lat && order.location?.lng ? (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Coordinates:</span>
                                  <span className="text-sm font-mono">
                                    {order.location.lat.toFixed(6)}, {order.location.lng.toFixed(6)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Last Updated:</span>
                                  <span className="text-sm text-gray-900">
                                    {getLastUpdateTime(order.location.updatedAt)}
                                  </span>
                                </div>
                                <div className="pt-2">
                                  <a
                                    href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                  >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    View on Google Maps
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">
                                No location data available yet
                              </p>
                            )}
                          </div>

                          {/* Update Tracking Button */}
                          <button
                            onClick={() => handleUpdateTracking(order._id)}
                            disabled={updatingLocation === order._id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            {updatingLocation === order._id ? (
                              <>
                                <svg
                                  className="w-4 h-4 animate-spin"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                                Getting Location...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                Update Tracking
                              </>
                            )}
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
      </div>
    </div>
  );
};

export default TrackOrders;
