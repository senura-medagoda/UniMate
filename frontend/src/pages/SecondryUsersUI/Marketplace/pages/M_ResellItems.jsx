import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import M_SIdebar from '../components/M_SIdebar';
import Admin_Navbar from '../components/Admin_Navbar';

const M_ResellItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, sold, available

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/resell/items');
      
      if (response.data.success) {
        setItems(response.data.items);
        toast.success(`📦 Loaded ${response.data.items.length} resell items`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(`❌ ${response.data.message || 'Failed to fetch items'}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('❌ Network error: Failed to load items. Please refresh the page.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (itemId) => {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/resell/mark-sold',
        { itemId },
        { headers: { token: adminToken } }
      );

      if (response.data.success) {
        toast.success('✅ Item marked as sold successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchItems(); // Refresh the list
      } else {
        toast.error(`❌ Failed to mark item as sold: ${response.data.message || 'Unknown error'}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error marking item as sold:', error);
      toast.error('❌ Network error: Failed to mark item as sold. Please try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getStatusBadge = (isSold) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isSold 
          ? 'bg-red-100 text-red-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {isSold ? 'Sold' : 'Available'}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'sold') return item.isSold;
    if (filter === 'available') return !item.isSold;
    return true;
  });

  if (loading) {
    return (
      <div className="flex">
        <M_SIdebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Navbar />
      <div className="flex">
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <M_SIdebar />
        </div>
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Resell Items</h1>
            <p className="text-gray-600 mt-2">View all approved resell items</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items ({items.length})
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'available'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available ({items.filter(item => !item.isSold).length})
              </button>
              <button
                onClick={() => setFilter('sold')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'sold'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sold ({items.filter(item => item.isSold).length})
              </button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No resell items have been approved yet' 
                  : `No ${filter} items found`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.itemName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(item.isSold)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.itemName}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-orange-600">
                        Rs {item.price}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{item.subCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Condition:</span>
                        <span className="font-medium">{item.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seller:</span>
                        <span className="font-medium">{item.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact:</span>
                        <span className="font-medium">{item.contactNumber}</span>
                      </div>
                    </div>

                    {!item.isSold && (
                      <button
                        onClick={() => handleMarkAsSold(item._id)}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Mark as Sold
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default M_ResellItems;
