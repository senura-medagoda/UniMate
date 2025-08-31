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

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Navbar />
      <div className="flex">
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <M_SIdebar />
        </div>

        <div className="flex-1 p-6">
          {/* 🔥 Stats Section */}
          <Admin_Summary
            totalRevenue={stats.totalRevenue}
            totalOrders={stats.totalOrders}
            pendingOrders={stats.pendingOrders}
            deliveredOrders={stats.deliveredOrders}
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Orders</h1>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search orders…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />

                {/* Category */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                </select>

                {/* Refresh */}
                <button
                  onClick={() =>
                    fetchAllOrders(adminToken, { showToastOnSuccess: true })
                  }
                  disabled={loading || !adminToken}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
                >
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
              </div>
            </div>

            {/* Orders list */}
            {loading ? (
              <p className="text-gray-600">Loading orders…</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-gray-600">No orders match your filters.</p>
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
                      className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">Order ID: {order._id}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.date || order.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <img
                          src={assets.parcel_icon}
                          alt="parcel"
                          className="w-6 h-6 mt-0.5"
                        />
                        <div className="text-sm text-gray-800 flex flex-wrap">
                          {orderItems.map((item, idx) => (
                            <span key={idx} className="mr-1">
                              {item.name} x {item.quantity}
                              {item.size ? (
                                <span className="text-gray-500"> ({item.size})</span>
                              ) : null}
                              {idx < orderItems.length - 1 ? (
                                <span>,&nbsp;</span>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="font-medium text-gray-800">
                          {fullName || "—"}
                        </p>
                        {addressLine && (
                          <p className="text-gray-600">{addressLine}</p>
                        )}
                        {addr.phone && (
                          <p className="text-gray-500">Phone: {addr.phone}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-sm text-gray-700 items-center">
                        <div>
                          Amount: <span className="font-medium">{order.amount}</span>
                        </div>
                        <div>
                          Payment:{" "}
                          <span className="font-medium">
                            {typeof order.payment === "boolean"
                              ? order.payment
                                ? "Paid"
                                : "Unpaid"
                              : order.payment || "Pending"}
                          </span>
                        </div>
                        <div>
                          Method:{" "}
                          <span className="font-medium">
                            {order.paymentMethod || "-"}
                          </span>
                        </div>
                        <div>
                          Items count:{" "}
                          <span className="font-medium">{orderItems.length}</span>
                        </div>

                        <div>
                          <label className="mr-2 font-medium">Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="p-2 border rounded font-semibold"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Packing">Packing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
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
