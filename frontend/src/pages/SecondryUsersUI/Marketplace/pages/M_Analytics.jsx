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
  const chartContainerRef = useRef(null);

  const [reportType, setReportType] = useState("Last 30 Days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrder: 0,
    uniqueCustomers: 0,
  });

  const [orders, setOrders] = useState([]);

  const adminToken = localStorage.getItem("adminToken");

  // Helpers for date ranges
  const getPresetRange = (type) => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let start = new Date(end);
    if (type === "Last 7 Days") start.setDate(end.getDate() - 6);
    else if (type === "Last 30 Days") start.setDate(end.getDate() - 29);
    else if (type === "This Month") start = new Date(end.getFullYear(), end.getMonth(), 1);
    else if (type === "This Year") start = new Date(end.getFullYear(), 0, 1);
    else start = new Date(end);
    const toStr = (d) => d.toISOString().slice(0, 10);
    return { s: toStr(start), e: toStr(end) };
  };

  // Fetch analytics data from backend
  const fetchAnalytics = async () => {
    if (!adminToken) {
      toast.error("Unauthorized: admin token missing");
      return;
    }
    setIsLoading(true);
    try {
      const payload = { startDate, endDate };
      const { data } = await axios.post(
        "http://localhost:5001/api/order/M_analytics",
        payload,
        { headers: { token: adminToken } }
      );
      if (data.success) {
        setStats(data.stats);
        setOrders(data.orders);
      } else {
        toast.error(data.message || "Failed to load analytics");
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch analytics");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize default range and fetch once on mount
  useEffect(() => {
    const { s, e } = getPresetRange(reportType);
    setStartDate(s);
    setEndDate(e);
    // defer fetch to next tick after state set
    setTimeout(() => {
      if (adminToken) fetchAnalytics();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  // Update dates when reportType changes (without auto-fetch)
  useEffect(() => {
    if (!reportType || reportType === "Custom Range") return;
    const { s, e } = getPresetRange(reportType);
    setStartDate(s);
    setEndDate(e);
  }, [reportType]);

  // Draw chart with Canvas API (responsive with axes/grid/legend)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = chartContainerRef.current;
    if (!canvas || !container) return;

    const render = () => {
      const width = Math.max(560, container.clientWidth);
      const height = 320;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      const padding = 48;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const revenueByMonth = Array(12).fill(0);
      const ordersByMonth = Array(12).fill(0);
      orders.forEach((o) => {
        const m = new Date(o.date).getMonth();
        revenueByMonth[m] += o.amount;
        ordersByMonth[m] += 1;
      });

      const maxVal = Math.max(...revenueByMonth, ...ordersByMonth, 10);
      const niceMax = Math.ceil(maxVal / 10) * 10;
      const stepX = (width - padding * 2) / (months.length - 1);
      const scaleY = (height - padding * 2) / (niceMax || 1);

      // Grid and axes
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      const yTicks = 5;
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#6b7280";
      for (let i = 0; i <= yTicks; i++) {
        const y = height - padding - (i * (height - padding * 2)) / yTicks;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        const label = Math.round((i * niceMax) / yTicks).toString();
        ctx.fillText(label, 8, y + 4);
      }

      // X-axis labels
      ctx.fillStyle = "#374151";
      months.forEach((m, idx) => {
        const x = padding + idx * stepX;
        ctx.fillText(m, x - 10, height - padding + 24);
      });

      const drawLine = (data, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.25;
        ctx.beginPath();
        data.forEach((val, idx) => {
          const x = padding + idx * stepX;
          const y = height - padding - val * scaleY;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.fillStyle = color;
        data.forEach((val, idx) => {
          const x = padding + idx * stepX;
          const y = height - padding - val * scaleY;
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      drawLine(revenueByMonth, "#f97316");
      drawLine(ordersByMonth, "#2563eb");

      // Legend
      const legendX = width - padding - 160;
      const legendY = padding - 28;
      ctx.fillStyle = "#111827";
      ctx.fillText("Legend:", legendX, legendY);
      ctx.fillStyle = "#f97316";
      ctx.fillRect(legendX, legendY + 10, 12, 3);
      ctx.fillStyle = "#111827";
      ctx.fillText("Revenue", legendX + 20, legendY + 16);
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(legendX + 90, legendY + 10, 12, 3);
      ctx.fillStyle = "#111827";
      ctx.fillText("Orders", legendX + 112, legendY + 16);
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [orders]);

  // PDF Download (advanced layout)
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = margin;

      // Header
      doc.setFillColor(249, 115, 22);
      doc.rect(0, 0, pageWidth, 70, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text("UniMate Marketplace — Sales Report", margin, 42);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 180, 42);

      doc.setTextColor(17, 24, 39);
      y = 90;

      // Report meta
      doc.setFontSize(12);
      doc.text(`Report Type: ${reportType}`, margin, y);
      doc.text(`Range: ${startDate || "-"}  to  ${endDate || "-"}`, margin, y + 18);
      y += 36;

      // KPI cards
      const kpiWidth = (pageWidth - margin * 2 - 30) / 2;
      const kpiHeight = 60;
      const drawKPI = (x, title, value) => {
        doc.setDrawColor(229, 231, 235);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, y, kpiWidth, kpiHeight, 6, 6, "FD");
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(10);
        doc.text(title, x + 12, y + 20);
        doc.setTextColor(17, 24, 39);
        doc.setFontSize(16);
        doc.text(value, x + 12, y + 42);
      };
      drawKPI(margin, "Total Revenue", `Rs ${stats.totalRevenue}`);
      drawKPI(margin + kpiWidth + 30, "Total Orders", `${stats.totalOrders}`);
      y += kpiHeight + 16;
      drawKPI(margin, "Average Order", `Rs ${Number(stats.avgOrder || 0).toFixed(2)}`);
      drawKPI(margin + kpiWidth + 30, "Unique Customers", `${stats.uniqueCustomers}`);
      y += kpiHeight + 24;

      // Chart image
      const canvas = canvasRef.current;
      if (canvas) {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const imgW = pageWidth - margin * 2;
        const aspect = canvas.height / canvas.width;
        const imgH = imgW * aspect;
        doc.setFontSize(12);
        doc.text("Revenue & Orders (Monthly)", margin, y);
        y += 8;
        doc.addImage(imgData, "PNG", margin, y, imgW, imgH);
        y += imgH + 20;
      }

      // Orders table (first 15 rows)
      const columns = ["Date", "Order Id", "Amount", "Customer"];
      const rows = (orders || []).slice(0, 15).map((o) => [
        (o.date ? new Date(o.date).toISOString().slice(0, 10) : "-"),
        (o._id || o.id || "-"),
        `Rs ${o.amount ?? "-"}`,
        (o.customerName || o.userName || o.user || "-")
      ]);

      const tableTop = y;
      const colWidths = [110, 160, 100, pageWidth - margin * 2 - (110 + 160 + 100)];
      // Header row
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y, pageWidth - margin * 2, 26, "F");
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(11);
      let x = margin + 10;
      columns.forEach((c, i) => {
        doc.text(c, x, y + 17);
        x += colWidths[i];
      });
      y += 26;
      // Rows
      doc.setFontSize(10);
      rows.forEach((r, ri) => {
        let cx = margin + 10;
        r.forEach((cell, ci) => {
          doc.text(String(cell), cx, y + 14, { maxWidth: colWidths[ci] - 20 });
          cx += colWidths[ci];
        });
        // row divider
        doc.setDrawColor(243, 244, 246);
        doc.line(margin, y + 18, pageWidth - margin, y + 18);
        y += 22;
      });

      if ((orders || []).length > rows.length) {
        doc.setTextColor(107, 114, 128);
        doc.text(`+ ${orders.length - rows.length} more orders not shown`, margin, y + 10);
      }

      // Footer page numbering
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 80, doc.internal.pageSize.getHeight() - 16);
      }

      doc.save("UniMate_Sales_Report.pdf");
      toast.success("Report downloaded!");
    } catch (e) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Navbar />
      <div className="flex">
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <M_SIdebar />
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sales Analytics</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchAnalytics}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {isLoading ? "Loading..." : "Generate"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg px-4 py-2 font-semibold"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* Report Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid sm:grid-cols-5 gap-4">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                <option>Custom Range</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Month</option>
                <option>This Year</option>
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

              <div className="col-span-2 flex items-center gap-2">
                <span className="text-sm text-gray-500">Tip: change preset then click Generate</span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid sm:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-lg shadow border border-orange-100">
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">Rs {stats.totalRevenue}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <p className="text-gray-500">Average Order</p>
              <p className="text-2xl font-bold">Rs {Number(stats.avgOrder || 0).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <p className="text-gray-500">Unique Customers</p>
              <p className="text-2xl font-bold">{stats.uniqueCustomers}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Revenue & Orders Overview</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 inline-block"></span><span className="text-gray-600">Revenue</span></div>
                <div className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600 inline-block"></span><span className="text-gray-600">Orders</span></div>
              </div>
            </div>
            <div ref={chartContainerRef} className="w-full overflow-x-auto">
              <canvas ref={canvasRef} height={320}></canvas>
            </div>
            {!orders.length && (
              <p className="text-sm text-gray-500 mt-3">No data for selected range. Try a different filter.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default M_Analytics;
