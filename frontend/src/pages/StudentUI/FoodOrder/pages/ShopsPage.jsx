import React, { useState, useEffect } from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context';
import FoodNavbar from '../components/navbar/FoodNavbar';
import Footer from '../components/Footer';
import ShopCards from '../components/ShopCards';
import { Search, MapPin, Star, Clock, Phone, Mail, Globe, Filter, Grid, List, RefreshCw } from 'lucide-react';

const ShopsContent = () => {
  const { shops, menuItems, isLoading, error, fetchMenuItems } = useAppContext();
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  // Safety check: ensure shops is always an array
  const safeShops = Array.isArray(shops) ? shops : [];

  useEffect(() => {
    if (safeShops && safeShops.length > 0) {
      setFilteredShops(safeShops);
    }
  }, [safeShops]);

  useEffect(() => {
    let shopsList = safeShops || [];
    
    // Apply search filter
    if (searchTerm) {
      shopsList = shopsList.filter(shop => 
        shop.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply cuisine filter
    if (selectedCuisine) {
      shopsList = shopsList.filter(shop => shop.cuisineType === selectedCuisine);
    }
    
    // Apply sorting
    shopsList.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'name':
          return (a.businessName || '').localeCompare(b.businessName || '');
        case 'reviews':
          return (b.totalReviews || 0) - (a.totalReviews || 0);
        default:
          return 0;
      }
    });
    
    setFilteredShops(shopsList);
  }, [safeShops, searchTerm, selectedCuisine, sortBy]);

  const getShopMenuItems = (shopId) => {
    return menuItems.filter(item => item.shopId === shopId);
  };

  const getCuisineTypes = () => {
    const types = safeShops?.map(shop => shop.cuisineType).filter(Boolean) || [];
    return [...new Set(types)];
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('');
    setSortBy('rating');
  };

  const handleRefresh = async () => {
    setLocalLoading(true);
    try {
      await fetchMenuItems();
    } finally {
      setLocalLoading(false);
    }
  };

  // Show loading state
  if (isLoading || localLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
        <FoodNavbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded-lg w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg h-80">
                    <div className="h-40 bg-gray-300 rounded-t-2xl"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && (!safeShops || safeShops.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
        <FoodNavbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Unable to Load Shops</h1>
              <p className="text-gray-600 text-lg mb-8">
                {error}. Please check your connection and try again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleRefresh}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold flex items-center gap-2 justify-center"
                >
                  <RefreshCw className={`w-5 h-5 ${localLoading ? 'animate-spin' : ''}`} />
                  Try Again
                </button>
                <button 
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      <FoodNavbar />
      
      {/* Hero Section */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Restaurants
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Explore the best restaurants, cafes, and food joints in your area
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="py-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Cuisine Filter */}
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Cuisines</option>
                {getCuisineTypes().map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="reviews">Sort by Reviews</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Results Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {filteredShops.length} Restaurants Found
            </h2>
            {searchTerm && (
              <p className="text-gray-600">
                Showing results for "{searchTerm}"
              </p>
            )}
          </div>

          {/* Shops Grid/List */}
          {filteredShops.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {filteredShops.map((shop, index) => (
                <div 
                  key={shop._id || index} 
                  className={`transform transition-all duration-500 hover:scale-105 animate-fade-in-up ${
                    viewMode === 'list' ? 'bg-white rounded-xl shadow-lg p-6' : 'bg-white rounded-2xl shadow-lg overflow-hidden'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {viewMode === 'list' ? (
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                          <span className="text-3xl">🏪</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{shop.businessName}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {shop.address?.city || 'Location not specified'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400" />
                                {shop.averageRating || 0} ({shop.totalReviews || 0} reviews)
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{shop.cuisineType || 'Restaurant'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {shop.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {shop.phone}
                                </span>
                              )}
                              {shop.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {shop.email}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <button
                              onClick={() => setSelectedShop(selectedShop === shop._id ? null : shop._id)}
                              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              {selectedShop === shop._id ? 'Hide Menu' : 'View Menu'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Shop Header */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{shop.businessName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{shop.address?.city || 'Location not specified'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span>{shop.averageRating || 0} ({shop.totalReviews || 0} reviews)</span>
                            </div>
                            <p className="text-gray-700">{shop.cuisineType || 'Restaurant'}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                              <span className="text-2xl">🏪</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Info */}
                        {(shop.phone || shop.email) && (
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            {shop.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {shop.phone}
                              </span>
                            )}
                            {shop.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {shop.email}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* View Menu Button */}
                        <button
                          onClick={() => setSelectedShop(selectedShop === shop._id ? null : shop._id)}
                          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          {selectedShop === shop._id ? 'Hide Menu' : 'View Menu'}
                        </button>
                      </div>
                    </>
                  )}

                  {/* Shop Menu Items */}
                  {selectedShop === shop._id && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Menu Items</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {getShopMenuItems(shop._id).slice(0, 4).map((item, itemIndex) => (
                          <div key={item._id || itemIndex} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || item.images?.[0] || 'https://via.placeholder.com/60x60/f3f4f6/9ca3af?text=🍽️'}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-gray-800 truncate">{item.name}</h5>
                                <p className="text-sm text-gray-600">Rs. {item.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {getShopMenuItems(shop._id).length > 4 && (
                        <div className="text-center mt-4">
                          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            View All {getShopMenuItems(shop._id).length} Items
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Restaurants Found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

const ShopsPage = ({ user, setUser }) => {
  return (
    <AppContextProvider user={user} setUser={setUser}>
      <ShopsContent />
    </AppContextProvider>
  );
};

export default ShopsPage;
