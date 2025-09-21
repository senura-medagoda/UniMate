import React from "react";

const Admin_Summary = ({ totalRevenue, totalOrders, pendingOrders, deliveredOrders }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Revenue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
          {/* Dollar Sign SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18c4.418 0 8-1.79 8-4V6c0-2.21-3.582-4-8-4S2 3.79 2 6v8c0 2.21 3.582 4 8 4zm0-2c-3.314 0-6-.895-6-2s2.686-2 6-2 6 .895 6 2-2.686 2-6 2z" />
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900">${totalRevenue}</p>
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {/* Box SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v2a2 2 0 001 1.732V15a2 2 0 002 2h10a2 2 0 002-2V8.732A2 2 0 0018 7V5a2 2 0 00-2-2H4z" />
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Total Orders</p>
          <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
          {/* Clock SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8H9V6h2v4zm0 2H9v2h2v-2z" />
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Pending</p>
          <p className="text-xl font-bold text-gray-900">{pendingOrders}</p>
        </div>
      </div>

      {/* Delivered Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
          {/* Check Circle SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5.414l-3.293-3.293 1.414-1.414L9 10.586l4.879-4.879 1.414 1.414L9 13.586z" />
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Delivered</p>
          <p className="text-xl font-bold text-gray-900">{deliveredOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default Admin_Summary;
