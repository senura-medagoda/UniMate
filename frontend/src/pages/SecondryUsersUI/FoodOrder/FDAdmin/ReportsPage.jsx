import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Package, DollarSign, XCircle, ChevronDown, FileText, Calendar, Filter } from 'lucide-react';

// Mock AdminNavbar component
const AdminNavbar = () => (
  <nav className="bg-white border-b border-gray-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-orange-600" />
          <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, Admin</span>
        </div>
      </div>
    </div>
  </nav>
);

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    period: 'monthly',
    startDate: '',
    endDate: '',
    reportType: 'summary'
  });

  // Mock data generator
  const generateMockData = () => {
    return {
      summary: {
        totalOrders: 1247,
        totalRevenue: 458920.50,
        averageOrderValue: 368.12,
        cancellationRate: 8.5
      },
      breakdown: {
        status: {
          'Pending': 45,
          'Confirmed': 320,
          'Preparing': 180,
          'Ready': 95,
          'Delivered': 501,
          'Cancelled': 106
        },
        payment: {
          'Cash on Delivery': 687,
          'Credit Card': 342,
          'Debit Card': 156,
          'Online Payment': 62
        },
        topItems: [
          { name: 'Margherita Pizza', quantity: 342, revenue: 85500 },
          { name: 'Chicken Burger', quantity: 289, revenue: 57800 },
          { name: 'Caesar Salad', quantity: 256, revenue: 38400 },
          { name: 'Pasta Carbonara', quantity: 234, revenue: 58500 },
          { name: 'Grilled Chicken', quantity: 198, revenue: 49500 }
        ],
        cancellationReasons: {
          'Too long delivery time': 38,
          'Changed mind': 25,
          'Found better price elsewhere': 18,
          'Order placed by mistake': 15,
          'Restaurant out of stock': 10
        }
      }
    };
  };

  const generateReport = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockData();
      setReportData(mockData);
      setLoading(false);
    }, 1500);
  };

  const downloadPDF = () => {
    if (!reportData) return;

    // Create a more modern PDF structure
    const generateModernPDF = () => {
      // Since we can't use jsPDF in this environment, we'll create a print-friendly version
      const printWindow = window.open('', '_blank');
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Food Order Analytics Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 40px;
              background: white;
              color: #1f2937;
            }
            .header {
              border-bottom: 4px solid #ea580c;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              font-size: 32px;
              color: #1f2937;
              margin-bottom: 10px;
            }
            .header .meta {
              color: #6b7280;
              font-size: 14px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin-bottom: 40px;
            }
            .summary-card {
              background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
              padding: 20px;
              border-radius: 12px;
              border-left: 4px solid #ea580c;
            }
            .summary-card .label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }
            .summary-card .value {
              font-size: 28px;
              font-weight: bold;
              color: #1f2937;
            }
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .section h2 {
              font-size: 20px;
              color: #1f2937;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            th {
              background: #f9fafb;
              font-weight: 600;
              color: #374151;
              font-size: 14px;
            }
            td {
              color: #1f2937;
            }
            .item-rank {
              background: #fed7aa;
              color: #9a3412;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
            }
            .status-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-top: 15px;
            }
            .status-item {
              background: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }
            .status-item .count {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
            }
            .status-item .label {
              font-size: 13px;
              color: #6b7280;
              margin-top: 5px;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #9ca3af;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Food Order Analytics Report</h1>
            <div class="meta">
              <strong>Period:</strong> ${filters.period.charAt(0).toUpperCase() + filters.period.slice(1)} | 
              <strong>Generated:</strong> ${new Date().toLocaleString()} |
              <strong>Type:</strong> ${filters.reportType.charAt(0).toUpperCase() + filters.reportType.slice(1)}
            </div>
          </div>

          <div class="summary-grid">
            <div class="summary-card">
              <div class="label">Total Orders</div>
              <div class="value">${reportData.summary.totalOrders}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Revenue</div>
              <div class="value">Rs. ${reportData.summary.totalRevenue.toFixed(2)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Avg Order Value</div>
              <div class="value">Rs. ${reportData.summary.averageOrderValue.toFixed(2)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Cancellation Rate</div>
              <div class="value">${reportData.summary.cancellationRate}%</div>
            </div>
          </div>

          <div class="section">
            <h2>Order Status Distribution</h2>
            <div class="status-grid">
              ${Object.entries(reportData.breakdown.status).map(([status, count]) => `
                <div class="status-item">
                  <div class="count">${count}</div>
                  <div class="label">${status}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2>Payment Method Breakdown</h2>
            <table>
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(reportData.breakdown.payment).map(([method, count]) => `
                  <tr>
                    <td>${method}</td>
                    <td>${count}</td>
                    <td>${((count / reportData.summary.totalOrders) * 100).toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Top Selling Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Item Name</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.breakdown.topItems.map((item, index) => `
                  <tr>
                    <td><span class="item-rank">${index + 1}</span></td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>Rs. ${item.revenue.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          ${Object.keys(reportData.breakdown.cancellationReasons).length > 0 ? `
            <div class="section">
              <h2>Cancellation Reasons Analysis</h2>
              <table>
                <thead>
                  <tr>
                    <th>Reason</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(reportData.breakdown.cancellationReasons).map(([reason, count]) => `
                    <tr>
                      <td>${reason}</td>
                      <td>${count}</td>
                      <td>${((count / Object.values(reportData.breakdown.cancellationReasons).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          <div class="footer">
            <p>This report was automatically generated by the Food Order Management System</p>
            <p>Confidential - For internal use only</p>
          </div>

          <div class="no-print" style="position: fixed; top: 20px; right: 20px;">
            <button onclick="window.print()" style="background: #ea580c; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
              Print Report
            </button>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(html);
      printWindow.document.close();
    };

    generateModernPDF();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-8 pb-12">
        {/* Modern Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Analytics & Reports</h1>
              <p className="text-gray-600 mt-1">Generate comprehensive insights on orders, revenue, and performance</p>
            </div>
          </div>
        </div>

        {/* Modern Filter Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 backdrop-blur-sm bg-white/80">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Report Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4" />
                Time Period
              </label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({...filters, period: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white"
              >
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.period === 'custom' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4" />
                Report Type
              </label>
              <select
                value={filters.reportType}
                onChange={(e) => setFilters({...filters, reportType: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="cancellation">Cancellation Analysis</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={generateReport}
              disabled={loading}
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>

            {reportData && (
              <button
                onClick={downloadPDF}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-semibold"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Report Results */}
        {reportData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Modern Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Package className="w-7 h-7" />
                  </div>
                  <ChevronDown className="w-5 h-5 opacity-60 group-hover:translate-y-1 transition-transform" />
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Orders</p>
                <p className="text-4xl font-black">{reportData.summary.totalOrders}</p>
              </div>

              <div className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <ChevronDown className="w-5 h-5 opacity-60 group-hover:translate-y-1 transition-transform" />
                </div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-4xl font-black">Rs. {reportData.summary.totalRevenue.toFixed(2)}</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <ChevronDown className="w-5 h-5 opacity-60 group-hover:translate-y-1 transition-transform" />
                </div>
                <p className="text-purple-100 text-sm font-medium mb-1">Avg Order Value</p>
                <p className="text-4xl font-black">Rs. {reportData.summary.averageOrderValue.toFixed(2)}</p>
              </div>

              <div className="group bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <ChevronDown className="w-5 h-5 opacity-60 group-hover:translate-y-1 transition-transform" />
                </div>
                <p className="text-rose-100 text-sm font-medium mb-1">Cancellation Rate</p>
                <p className="text-4xl font-black">{reportData.summary.cancellationRate}%</p>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                Order Status Distribution
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(reportData.breakdown.status).map(([status, count]) => (
                  <div key={status} className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-orange-400">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all"></div>
                    <p className="text-3xl font-black text-gray-900 mb-2">{count}</p>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Items */}
            {reportData.breakdown.topItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  Top Selling Items
                </h3>
                <div className="space-y-4">
                  {reportData.breakdown.topItems.slice(0, 5).map((item, index) => (
                    <div key={item.name} className="group flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-all duration-300 border-2 border-orange-100 hover:border-orange-300">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg">
                            {index + 1}
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <span className="font-bold text-gray-900 text-lg">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{item.quantity} <span className="text-sm font-normal text-gray-600">sold</span></p>
                        <p className="text-sm font-semibold text-orange-600">Rs. {item.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Reasons */}
            {Object.keys(reportData.breakdown.cancellationReasons).length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-rose-500 to-rose-600 rounded-full"></div>
                  Cancellation Insights
                </h3>
                <div className="space-y-3">
                  {Object.entries(reportData.breakdown.cancellationReasons).map(([reason, count]) => (
                    <div key={reason} className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-red-50 rounded-xl hover:shadow-md transition-all duration-300 border-2 border-rose-100 hover:border-rose-300">
                      <p className="text-sm font-semibold text-gray-700 flex-1">{reason}</p>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-500"
                            style={{ width: `${(count / Math.max(...Object.values(reportData.breakdown.cancellationReasons))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="px-3 py-1 bg-rose-600 text-white text-sm font-bold rounded-full min-w-[3rem] text-center">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;