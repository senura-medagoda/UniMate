import React, { useState, useEffect } from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context';
import FoodNavbar from '../components/navbar/FoodNavbar';
import Footer from '../components/Footer';
import ShopCards from '../components/ShopCards';
import { Search, Filter, MapPin, Star, Clock, Users, ShoppingCart, RefreshCw, Grid, List } from 'lucide-react';

const MenuContent = () => {
  const { menuItems, shops, cartItems, isLoading, error, fetchMenuItems } = useAppContext();
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); 
  const [localLoading, setLocalLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);

 
  const categories = [
    'Burgers', 'Pizza', 'Salads', 'Pasta', 'Desserts', 
    'Beverages', 'Appetizers', 'Main Course', 'Sides', 'Drinks'
  ];

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      setFilteredItems(menuItems);
    }
  }, [menuItems]);

  useEffect(() => {
    let items = menuItems || [];
    
   
    if (searchTerm) {
      items = items.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    
    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
    }
    
   
    if (selectedShop) {
      items = items.filter(item => item.shopId === selectedShop);
    }
    
  
    items = items.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );
    

    items.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        default:
          return 0;
      }
    });
    
    setFilteredItems(items);
  }, [menuItems, searchTerm, selectedCategory, selectedShop, sortBy, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedShop('');
    setSortBy('name');
    setPriceRange([0, 1000]);
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  const handleRefresh = async () => {
    setLocalLoading(true);
    try {
      await fetchMenuItems();
    } finally {
      setLocalLoading(false);
    }
  };


  if (isLoading || localLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
        <FoodNavbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded-lg w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg h-72">
                    <div className="h-40 bg-gray-300 rounded-t-2xl"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
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

 
  if (error && (!menuItems || menuItems.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
        <FoodNavbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Unable to Load Menu</h1>
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
      
   
      <div className="pt-20 pb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our Delicious Menu
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Discover amazing dishes from the best restaurants and cafes in your area
          </p>
          
       
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for your favorite food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </div>

 
      <div className="py-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      
            <div className="flex flex-wrap items-center gap-4">
             
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

        
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Shops</option>
                {Array.isArray(shops) && shops.length > 0 ? (
                  shops.map(shop => (
                    <option key={shop._id} value={shop._id}>{shop.businessName}</option>
                  ))
                ) : (
                  <option value="" disabled>Loading shops...</option>
                )}
              </select>

       
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Sort by Rating</option>
                <option value="popular">Sort by Popularity</option>
              </select>

    
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Price:</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

        
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>

 
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6">
    
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {filteredItems.length} Menu Items Found
              </h2>
              {searchTerm && (
                <p className="text-gray-600">
                  Showing results for "{searchTerm}"
                </p>
              )}
            </div>
            
    
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  {getCartCount()} items in cart
                </span>
              </div>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {filteredItems.map((item, index) => (
                <div 
                  key={item._id || index} 
                  className={`transform transition-all duration-500 hover:scale-105 animate-in slide-in-from-bottom-5 fade-in ${
                    viewMode === 'list' ? 'bg-white rounded-xl shadow-lg p-4' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {viewMode === 'list' ? (
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || item.images?.[0] || 'https://via.placeholder.com/120x120/f3f4f6/9ca3af?text=🍽️'}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400" />
                                {item.rating || 0} ({item.reviewCount || 0})
                              </span>
                              {item.preparationTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {item.preparationTime} min
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-xl font-bold text-orange-600 mb-2">
                              Rs. {item.price}
                            </div>
                            <ShopCards product={item} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ShopCards product={item} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Items Found</h3>
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
    </div>
  );
};

const MenuPage = () => {
  return (
    <AppContextProvider>
      <MenuContent />
    </AppContextProvider>
  );
};

export default MenuPage;
