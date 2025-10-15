import React, { useEffect, useMemo, useState } from 'react';
import AdminNavbar from './components/AdminNavbar';
import { useAdminAuth } from './context/AdminAuthContext';
import { useToast } from '@/context/ToastContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const statusOptions = ['Order Placed','Packing','Shipped','Out for Delivery','Delivered','Cancelled'];

const OrdersManagement = () => {
  console.log('OrdersManagement component rendered');
  const { admin, token } = useAdminAuth();
  const { toastSuccess, toastError } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [query, setQuery] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportFilters, setReportFilters] = useState({
    period: 'monthly',
    startDate: '',
    endDate: ''
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const resp = await fetch('http://localhost:5001/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resp.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (e) { 
      console.error('Error fetching orders:', e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, orderStatus) => {
    try {
      const resp = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus })
      });
      const data = await resp.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      } else {
        console.error('Failed to update status:', data.message);
      }
    } catch (e) { 
      console.error('Error updating status:', e); 
    }
  };

  const resolveCancel = async (orderId, action) => {
    try {
      const resp = await fetch(`http://localhost:5001/api/orders/${orderId}/cancel/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await resp.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      } else {
        console.error('Failed to resolve cancellation:', data.message);
      }
    } catch (e) { 
      console.error('Error resolving cancellation:', e); 
    }
  };

  const adminDelete = async (orderId) => {
    try {
      const resp = await fetch(`http://localhost:5001/api/orders/admin/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await resp.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
      } else {
        console.error('Failed to delete order:', data.message);
      }
    } catch (e) {
      console.error('Error deleting order:', e);
    }
  };

  const generateReport = async () => {
    try {
      setReportLoading(true);
      const resp = await fetch('http://localhost:5001/api/orders/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportFilters)
      });
      const data = await resp.json();
      if (data.success) {
        setReportData(data.report);
        toastSuccess('Report generated successfully! Click the download button to get your PDF.');
      } else {
        toastError('Failed to generate report');
      }
    } catch (e) {
      console.error('Error generating report:', e);
      toastError('Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  const downloadPDF = () => {
    // Allow PDF generation even without report data, using current orders
    if (!reportData && (!orders || orders.length === 0)) {
      toastError('No data available. Please ensure there are orders to generate a report.');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Colors - Updated to use site primary orange color
      const colors = {
        primary: [249, 115, 22], // Orange-500
        secondary: [251, 146, 60], // Orange-400
        text: [31, 41, 55],
        lightGray: [248, 250, 252],
        success: [34, 197, 94],
        warning: [251, 191, 36],
        danger: [239, 68, 68]
      };

      // Get current orders data for fallback
      const currentOrders = orders || [];
      const totalOrders = reportData?.totalOrders || currentOrders.length;
      const totalRevenue = reportData?.totalRevenue || currentOrders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);

      // Header
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('UniMate Food System', 20, 20);
      doc.setFontSize(12);
      doc.text('Food Order Analytics Report', 20, 30);

      // Report details
      doc.setTextColor(...colors.text);
      doc.setFontSize(10);
      doc.text(`Report #: ${Date.now()}`, 150, 15);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 22);
      doc.text(`Period: ${reportFilters.period}`, 150, 29);

      // Key metrics
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL ORDERS: ${totalOrders}`, 20, 50);
      doc.text(`TOTAL REVENUE: Rs. ${totalRevenue.toFixed(2)}`, 20, 60);

      // Calculate status breakdown from current orders
      const statusCounts = {};
      const paymentCounts = {};
      
      currentOrders.forEach(order => {
        // Status breakdown
        const status = order.orderStatus || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        
        // Payment breakdown
        const payment = order.paymentMethod || 'Unknown';
        paymentCounts[payment] = (paymentCounts[payment] || 0) + 1;
      });

      // Order Status Analysis - Better spacing
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Order Status Analysis', 20, 80);

      const statusData = Object.entries(statusCounts).map(([status, count]) => [
        status,
        count.toString(),
        `${((count / totalOrders) * 100).toFixed(1)}%`
      ]);

      if (doc.autoTable && typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Status', 'Count', 'Percentage']],
          body: statusData,
          startY: 85,
          headStyles: {
            fillColor: colors.secondary,
            textColor: [255, 255, 255],
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9
          },
          alternateRowStyles: {
            fillColor: colors.lightGray
          }
        });
      } else {
        // Fallback if autoTable is not available
        let yPos = 85;
        doc.setFontSize(10);
        doc.text('Status Breakdown:', 20, yPos);
        yPos += 10;
        Object.entries(statusCounts).forEach(([status, count]) => {
          doc.text(`${status}: ${count} (${((count / totalOrders) * 100).toFixed(1)}%)`, 25, yPos);
          yPos += 8;
        });
      }

      // Payment Method Analysis - Adjusted positioning
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Method Analysis', 20, 130);

      const paymentData = Object.entries(paymentCounts).map(([method, count]) => [
        method,
        count.toString(),
        `${((count / totalOrders) * 100).toFixed(1)}%`
      ]);

      if (doc.autoTable && typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Payment Method', 'Count', 'Percentage']],
          body: paymentData,
          startY: 135,
          headStyles: {
            fillColor: colors.secondary,
            textColor: [255, 255, 255],
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9
          },
          alternateRowStyles: {
            fillColor: colors.lightGray
          }
        });
      } else {
        // Fallback if autoTable is not available
        let yPos = 135;
        doc.setFontSize(10);
        doc.text('Payment Breakdown:', 20, yPos);
        yPos += 10;
        Object.entries(paymentCounts).forEach(([method, count]) => {
          doc.text(`${method}: ${count} (${((count / totalOrders) * 100).toFixed(1)}%)`, 25, yPos);
          yPos += 8;
        });
      }

      // Additional Analytics - Improved layout with better spacing
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Analytics', 20, 170);

      // Calculate additional metrics
      const deliveredOrders = statusCounts['Delivered'] || 0;
      const cancelledOrders = statusCounts['Cancelled'] || 0;
      const onlineOrders = paymentCounts['Online'] || 0;
      const codOrders = paymentCounts['COD'] || 0;

      doc.setFontSize(10);
      doc.text(`Delivered Orders: ${deliveredOrders}`, 20, 185);
      doc.text(`Cancelled Orders: ${cancelledOrders}`, 20, 195);
      doc.text(`Online Payments: ${onlineOrders}`, 20, 205);
      doc.text(`Cash on Delivery: ${codOrders}`, 20, 215);
      doc.text(`Delivery Rate: ${totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0}%`, 20, 225);

      // Analytics Overview - List View
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Analytics Overview', 20, 240);

      // Create analytics data for list view
      const analyticsData = {
        'Delivered Orders': deliveredOrders,
        'Cancelled Orders': cancelledOrders,
        'Online Payments': onlineOrders,
        'Cash on Delivery': codOrders
      };

      // Filter out zero values for cleaner display
      const filteredAnalytics = Object.entries(analyticsData).filter(([key, value]) => value > 0);
      
      if (filteredAnalytics.length > 0) {
        const total = filteredAnalytics.reduce((sum, [, value]) => sum + value, 0);
        
        // Display as clean list view
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.text);
        
        let yPos = 250;
        filteredAnalytics.forEach(([label, count], index) => {
          const percentage = (count / total) * 100;
          
          // Draw colored bullet point
          const colors_array = [
            [249, 115, 22], // Orange
            [59, 130, 246], // Blue
            [16, 185, 129], // Green
            [245, 158, 11], // Yellow
            [239, 68, 68],  // Red
            [139, 92, 246]  // Purple
          ];
          
          const colorIndex = index % colors_array.length;
          doc.setFillColor(...colors_array[colorIndex]);
          doc.circle(25, yPos + 2, 2, 'F');
          
          // Draw list item text
          doc.setTextColor(...colors.text);
          doc.text(`${label}: ${count} (${percentage.toFixed(1)}%)`, 35, yPos + 3);
          
          yPos += 12;
        });
      }

      // Footer for first page
      doc.setFillColor(...colors.primary);
      doc.rect(0, 320, 210, 20, 'F');
      doc.setTextColor(255, 255, 255); // White text on orange background
      doc.setFontSize(8);
      doc.text('UniMate Food Order System', 20, 330);
      doc.text('unimate@foodsystem.com', 20, 335);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 150, 330);
      doc.text('Page 1 of 2', 150, 335);

      // Add page break for Order Details
      doc.addPage();

      // Order Details Table - Second Page
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Order Details', 20, 30);

      // Prepare order data for table
      const orderTableData = currentOrders.map(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const orderTime = new Date(order.createdAt).toLocaleTimeString();
        
        // Get student ID - use the studentId field from the order
        const studentId = order.studentId ? order.studentId.toString().slice(-6) : 'Unknown';
        
        return [
          order._id ? order._id.toString().slice(-6) : 'N/A', // Use last 6 characters of MongoDB _id as order ID
          studentId, // Use student ID instead of name
          order.orderStatus || 'N/A',
          order.paymentMethod || 'N/A',
          `Rs. ${parseFloat(order.totalAmount || 0).toFixed(2)}`,
          `${orderDate} ${orderTime}`
        ];
      });

      // Add order details table on second page
      if (doc.autoTable && typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Order ID', 'Customer', 'Status', 'Payment', 'Amount', 'Date & Time']],
          body: orderTableData,
          startY: 40,
          headStyles: {
            fillColor: colors.primary,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3,
            textColor: [0, 0, 0], // Black text for table body
            halign: 'center'
          },
          alternateRowStyles: {
            fillColor: colors.lightGray,
            textColor: [0, 0, 0], // Black text for alternate rows
            halign: 'center'
          },
          columnStyles: {
            0: { cellWidth: 25, halign: 'center' }, // Order ID
            1: { cellWidth: 30, halign: 'center' }, // Customer
            2: { cellWidth: 25, halign: 'center' }, // Status
            3: { cellWidth: 20, halign: 'center' }, // Payment
            4: { cellWidth: 25, halign: 'center' }, // Amount
            5: { cellWidth: 35, halign: 'center' }  // Date & Time
          },
          margin: { left: 15, right: 15 },
          tableWidth: 'auto',
          showHead: 'everyPage'
        });
      } else {
        // Fallback if autoTable is not available - create centered table
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        
        // Center the table
        const tableStartX = 20;
        const tableEndX = 190;
        const centerX = (tableStartX + tableEndX) / 2;
        
        // Header with center alignment
        doc.text('Order ID', tableStartX, 45);
        doc.text('Customer', tableStartX + 30, 45);
        doc.text('Status', tableStartX + 60, 45);
        doc.text('Payment', tableStartX + 90, 45);
        doc.text('Amount', tableStartX + 120, 45);
        doc.text('Date & Time', tableStartX + 150, 45);
        
        // Draw header line
        doc.setDrawColor(...colors.primary);
        doc.setLineWidth(1);
        doc.line(tableStartX, 50, tableEndX, 50);
        
        let tableY = 55;
        currentOrders.forEach(order => {
          const orderDate = new Date(order.createdAt).toLocaleDateString();
          const orderTime = new Date(order.createdAt).toLocaleTimeString();
          
          // Get student ID - use the studentId field from the order
          const studentId = order.studentId ? order.studentId.toString().slice(-6) : 'Unknown';
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0); // Black text
          doc.text(order._id ? order._id.toString().slice(-6) : 'N/A', tableStartX, tableY);
          doc.text(studentId, tableStartX + 30, tableY);
          doc.text(order.orderStatus || 'N/A', tableStartX + 60, tableY);
          doc.text(order.paymentMethod || 'N/A', tableStartX + 90, tableY);
          doc.text(`Rs. ${parseFloat(order.totalAmount || 0).toFixed(2)}`, tableStartX + 120, tableY);
          doc.text(`${orderDate} ${orderTime}`, tableStartX + 150, tableY);
          
          tableY += 8;
        });
      }

      // Footer for second page
      doc.setFillColor(...colors.primary);
      doc.rect(0, 280, 210, 20, 'F');
      doc.setTextColor(255, 255, 255); // White text on orange background
      doc.setFontSize(8);
      doc.text('UniMate Food Order System', 20, 290);
      doc.text('unimate@foodsystem.com', 20, 295);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 150, 290);
      doc.text('Page 2 of 2', 150, 295);

      // Save the PDF
      const fileName = `food-order-report-${reportFilters.period}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      toastSuccess('PDF report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toastError(`Error generating PDF: ${error.message}. Please try again.`);
    }
  };

  const filtered = useMemo(() => {
    return orders
      .filter(o => (!filterStatus || o.orderStatus === filterStatus))
      .filter(o => (!filterPayment || o.paymentMethod === filterPayment))
      .filter(o => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          o._id?.toLowerCase().includes(q) ||
          String(o.studentId || '').toLowerCase().includes(q)
        );
      });
  }, [orders, filterStatus, filterPayment, query]);

  const statusBadge = (status) => {
    const map = {
      'Order Placed': 'bg-blue-50 text-blue-700',
      'Packing': 'bg-indigo-50 text-indigo-700',
      'Shipped': 'bg-amber-50 text-amber-700',
      'Out for Delivery': 'bg-purple-50 text-purple-700',
      'Delivered': 'bg-green-50 text-green-700',
      'Cancelled': 'bg-red-50 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/20">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-8 pb-12">
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage all customers orders and track fulfilment</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
              <span className="text-sm text-gray-500">Total:</span>
              <span className="text-sm font-semibold text-gray-800">{orders.length}</span>
              <span className="mx-1 text-gray-300">•</span>
              <span className="text-sm text-gray-500">Showing:</span>
              <span className="text-sm font-semibold text-gray-800">{filtered.length}</span>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow p-4 mb-5 flex flex-wrap items-center gap-3 border border-gray-100">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Order Status</label>
                <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500">
                  <option value="">All</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Payment</label>
                <select value={filterPayment} onChange={(e)=>setFilterPayment(e.target.value)} className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500">
                  <option value="">All</option>
                  <option value="Online">Online</option>
                  <option value="COD">COD</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Duration</label>
                <select value={reportFilters.period} onChange={(e)=>setReportFilters(prev => ({...prev, period: e.target.value}))} className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="relative">
                  <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by Order ID or Student ID" className="pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 w-64" />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <button onClick={fetchOrders} className="px-3 py-2 text-sm rounded bg-orange-500 text-white hover:bg-orange-600">Refresh</button>
                <button 
                  onClick={generateReport} 
                  disabled={reportLoading}
                  className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {reportLoading ? 'Generating...' : 'Generate Report'}
                </button>
                <button 
                  onClick={downloadPDF}
                  className="px-4 py-2 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Download PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(o => (
                <div key={o._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Order ID</div>
                      <div className="font-mono text-sm break-all">{o._id}</div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${statusBadge(o.orderStatus)}`}>{o.orderStatus}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Student</div>
                      <div className="text-gray-900 truncate">{o.studentId}</div>
                      {o.deletedByStudent && (
                        <div className="text-xs text-orange-600 mt-1">
                          📝 Deleted by student
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-gray-500">Total</div>
                      <div className="font-semibold text-gray-900">Rs. {Number(o.totalAmount).toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Payment</div>
                      <div className="text-gray-900">{o.paymentMethod} • {o.paymentStatus}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Update Status</div>
                      <select value={o.orderStatus} onChange={(e)=>updateStatus(o._id, e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500">
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {o.cancelRequested ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">Cancel Requested</span>
                          <button onClick={()=>resolveCancel(o._id,'approve')} className="px-3 py-1.5 rounded bg-green-600 text-white text-xs">Approve</button>
                          <button onClick={()=>resolveCancel(o._id,'reject')} className="px-3 py-1.5 rounded bg-red-600 text-white text-xs">Reject</button>
                        </div>
                        {o.cancelReason && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="text-xs font-medium text-yellow-800 mb-1">Cancellation Reason:</div>
                            <div className="text-sm text-yellow-700">{o.cancelReason}</div>
                          </div>
                        )}
                      </div>
                    ) : <span className="text-xs text-gray-400">&nbsp;</span>}
                    <button onClick={()=>adminDelete(o._id)} className="px-3 py-2 rounded bg-red-50 text-red-700 hover:bg-red-100 text-xs border border-red-200">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;


