import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Admin_Navbar from "../components/Admin_Navbar";
import M_SIdebar from "../components/M_SIdebar";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import axios from "axios";

const M_Analytics = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [reportType, setReportType] = useState("Custom Range");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrder: 0,
    uniqueCustomers: 0,
  });

  const [orders, setOrders] = useState([]);

  const adminToken = localStorage.getItem("adminToken");

  // Fetch analytics data from backend
  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/order/M_analytics",
        { startDate, endDate },
        { headers: { token: adminToken } }
      );

      if (data.success) {
        setStats(data.stats);
        setOrders(data.orders);
        toast.success("Analytics loaded");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch analytics");
    }
  };

  useEffect(() => {
    if (adminToken) fetchAnalytics();
  }, [adminToken, startDate, endDate]);

  // Draw chart with Canvas API
 useEffect(() => {
  if (!orders.length) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 40;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Group revenue + order counts by month
  const revenueByMonth = Array(12).fill(0);
  const ordersByMonth = Array(12).fill(0);

  orders.forEach((o) => {
    const m = new Date(o.date).getMonth();
    revenueByMonth[m] += o.amount;
    ordersByMonth[m] += 1;
  });

  const maxVal = Math.max(...revenueByMonth, ...ordersByMonth, 100);
  const stepX = (canvas.width - padding * 2) / (months.length - 1);
  const scaleY = (canvas.height - padding * 2) / maxVal;

  // Helper to draw a line
  const drawLine = (data, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((val, idx) => {
      const x = padding + idx * stepX;
      const y = canvas.height - padding - val * scaleY;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = color;
    data.forEach((val, idx) => {
      const x = padding + idx * stepX;
      const y = canvas.height - padding - val * scaleY;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Draw revenue line (orange)
  drawLine(revenueByMonth, "#f97316");

  // Draw orders line (blue)
  drawLine(ordersByMonth, "#2563eb");

  // X-axis labels
  ctx.fillStyle = "#374151";
  ctx.font = "12px sans-serif";
  months.forEach((m, idx) => {
    const x = padding + idx * stepX;
    ctx.fillText(m, x - 10, canvas.height - 10);
  });

  // Title for legend
  ctx.fillStyle = "#f97316";
  ctx.fillText("Revenue", padding, 20);

  ctx.fillStyle = "#2563eb";
  ctx.fillText("Orders", padding + 80, 20);

}, [orders]);

  // PDF Download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 10, 10);
    doc.text(`Report Type: ${reportType}`, 10, 20);
    doc.text(`Start Date: ${startDate || "-"}`, 10, 30);
    doc.text(`End Date: ${endDate || "-"}`, 10, 40);
    doc.text(`Total Revenue: $${stats.totalRevenue}`, 10, 50);
    doc.text(`Total Orders: ${stats.totalOrders}`, 10, 60);
    doc.text(`Average Order: $${stats.avgOrder.toFixed(2)}`, 10, 70);
    doc.text(`Unique Customers: ${stats.uniqueCustomers}`, 10, 80);
    doc.save("SalesReport.pdf");
    toast.success("Report downloaded!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Navbar />
      <div className="flex">
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <M_SIdebar />
        </div>

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Sales Report</h1>

          {/* Report Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid sm:grid-cols-4 gap-4">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                <option>Custom Range</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Month</option>
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              />

              <button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg px-4 py-2 font-semibold"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid sm:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">Rs {stats.totalRevenue}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Average Order</p>
              <p className="text-2xl font-bold">Rs {stats.avgOrder.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Unique Customers</p>
              <p className="text-2xl font-bold">{stats.uniqueCustomers}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
            <canvas ref={canvasRef} width={600} height={300}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M_Analytics;
