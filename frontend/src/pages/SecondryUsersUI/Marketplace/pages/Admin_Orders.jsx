import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Admin_Navbar from "../components/Admin_Navbar";
import M_SIdebar from "../components/M_SIdebar";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import Admin_Summary from "../components/Admin_Summary";

const Admin_Orders = () => {
  const navigate = useNavigate();

  const [adminToken, setAdminToken] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  // filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) {
      toast.error("Please login as admin first!");
      navigate("/A_login");
      return;
    }
    setAdminToken(t);
  }, [navigate]);

  const fetchAllOrders = async (tkn, { showToastOnSuccess = false } = {}) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5001/api/order/M_list",
        {},
        { headers: { token: tkn } }
      );

      if (data?.success) {
        setOrders(data.orders || []);
        setStats(data.stats || {});
        if (showToastOnSuccess) toast.success("Orders refreshed");
      } else {
        const msg = data?.message || "Failed to fetch orders";
        toast.error(msg);
        setOrders([]);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Failed to fetch orders";
      toast.error(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAllOrders(adminToken, { showToastOnSuccess: false });
    }
  }, [adminToken]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/order/M_status",
        { orderId, status: newStatus },
        { headers: { token: adminToken } }
      );

      if (data.success) {
        toast.success("Status updated");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // ✅ Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/order/M_delete",
        { orderId },
        { headers: { token: adminToken } }
      );

      if (data.success) {
        toast.success("Order deleted");
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete order");
    }
  };

  // 🔎 filter orders
  const filteredOrders = orders.filter((order) => {
    const orderItems = order.items || order.item || [];
    const addr = order?.address || {};
    const fullName = [addr.firstName, addr.lastName].filter(Boolean).join(" ");

    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      orderItems.some((item) =>
        (item.name || "").toLowerCase().includes(search.toLowerCase())
      );

    const matchesCategory =
      category === "All" ||
      orderItems.some((item) => item.category === category);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

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

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  }).sort((a, b) => {
    // Sort by date - newest first
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed": return "bg-blue-100 text-blue-800";
      case "Packing": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Out for delivery": return "bg-orange-100 text-orange-800";
      case "Delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Navbar />
      <div className="flex">
        {/* Fixed Sidebar */}
        <M_SIdebar />

        {/* Main Content with left margin for fixed sidebar */}
        <div className="flex-1 lg:ml-64 p-6">
          {/* 🔥 Stats Section */}
          <Admin_Summary
            totalRevenue={stats.totalRevenue}
            totalOrders={stats.totalOrders}
            pendingOrders={stats.pendingOrders}
            deliveredOrders={stats.deliveredOrders}
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            {/* Header & Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredOrders.length} orders found • Showing latest first
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by ID, name, or product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[250px]"
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

                {/* Refresh Button */}
                <button
                  onClick={() =>
                    fetchAllOrders(adminToken, { showToastOnSuccess: true })
                  }
                  disabled={loading || !adminToken}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading orders...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">No orders match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderItems = order.items || order.item || [];
                  const addr = order?.address || {};
                  const fullName = [addr.firstName, addr.lastName]
                    .filter(Boolean)
                    .join(" ");
                  const addressLine = [
                    addr.street,
                    addr.city,
                    addr.state,
                    addr.zipcode,
                    addr.district,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">#{order._id.slice(-8)}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.date || order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Order Content */}
                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Items & Customer Info */}
                        <div className="lg:col-span-2 space-y-4">
                          {/* Items */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <img src={assets.parcel_icon} alt="items" className="w-4 h-4" />
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
                                    {item.size && <span className="text-gray-500 text-xs"> ({item.size})</span>}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Customer Info */}
                          {fullName && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Customer Details
                              </h4>
                              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                                <p className="font-medium text-gray-900">{fullName}</p>
                                {addressLine && <p className="text-sm text-gray-600">{addressLine}</p>}
                                {addr.phone && <p className="text-sm text-gray-500">📞 {addr.phone}</p>}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Order Details & Actions */}
                        <div className="space-y-4">
                          {/* Payment & Amount Info */}
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Amount:</span>
                              <span className="font-semibold text-lg">${order.amount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Payment:</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                (typeof order.payment === "boolean" ? order.payment : order.payment === "Paid") 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {typeof order.payment === "boolean"
                                  ? order.payment ? "Paid" : "Unpaid"
                                  : order.payment || "Pending"}
                              </span>
                            </div>
                            {order.paymentMethod && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Method:</span>
                                <span className="text-sm font-medium">{order.paymentMethod}</span>
                              </div>
                            )}
                          </div>

                          {/* Status Management */}
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Update Status:
                            </label>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Packing">Packing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for delivery">Out for delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>

                            {/* Delete Button - Clean placement */}
                            {order.status === "Delivered" && (
                              <button
                                onClick={() => handleDeleteOrder(order._id)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors font-medium"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Order
                              </button>
                            )}
                          </div>
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

export default Admin_Orders;