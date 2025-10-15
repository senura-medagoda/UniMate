import React, { useState, useEffect } from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context';
import FoodNavbar from '../components/navbar/FoodNavbar';
import Footer from '../components/Footer';
import ShopCards from '../components/ShopCards';
import { Search, MapPin, Star, Clock, Phone, Mail, Globe, Filter, Grid, List, RefreshCw, X, Heart, Share2, Navigation, Award, Users, Calendar } from 'lucide-react';

const ShopsContent = () => {
  const { shops, menuItems, isLoading, error, fetchMenuItems } = useAppContext();
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedShop(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedShop.businessName,
          text: `Check out ${selectedShop.businessName} - ${selectedShop.cuisineType}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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
                   onClick={() => handleShopClick(shop)}
                   className={`transform transition-all duration-500 hover:scale-105 animate-fade-in-up cursor-pointer ${
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
                        
                      </div>
                    </>
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

       {/* Shop Details Popup */}
       {showPopup && selectedShop && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
             {/* Popup Header */}
             <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-3xl">
               <button
                 onClick={closePopup}
                 className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
               >
                 <X className="w-6 h-6" />
               </button>
               
               <div className="flex items-start gap-6">
                 {/* Shop Avatar */}
                 <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center flex-shrink-0">
                   <span className="text-3xl">🏪</span>
                 </div>
                 
                 {/* Shop Info */}
                 <div className="flex-1 min-w-0">
                   <h2 className="text-3xl font-bold mb-2">{selectedShop.businessName}</h2>
                   <div className="flex items-center gap-4 text-orange-100 mb-3">
                     <div className="flex items-center gap-1">
                       <Star className="w-5 h-5 text-yellow-300 fill-current" />
                       <span className="font-semibold">{selectedShop.averageRating || 0}</span>
                       <span className="text-sm">({selectedShop.totalReviews || 0} reviews)</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <MapPin className="w-4 h-4" />
                       <span>{selectedShop.address?.city || 'Location not specified'}</span>
                     </div>
                   </div>
                   <p className="text-orange-100 text-lg">{selectedShop.cuisineType || 'Restaurant'}</p>
                 </div>
                 
                 {/* Action Buttons */}
                 <div className="flex gap-2">
                   <button
                     onClick={handleShare}
                     className="p-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-200"
                     title="Share"
                   >
                     <Share2 className="w-5 h-5" />
                   </button>
                   <button
                     className="p-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-200"
                     title="Add to Favorites"
                   >
                     <Heart className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </div>

             {/* Popup Content */}
             <div className="p-6">
               {/* Quick Stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-orange-50 rounded-xl p-4 text-center">
                   <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                     <Award className="w-6 h-6 text-orange-600" />
                   </div>
                   <p className="text-sm text-gray-600">Rating</p>
                   <p className="font-bold text-lg text-gray-800">{selectedShop.averageRating || 0}</p>
                 </div>
                 
                 <div className="bg-blue-50 rounded-xl p-4 text-center">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                     <Users className="w-6 h-6 text-blue-600" />
                   </div>
                   <p className="text-sm text-gray-600">Reviews</p>
                   <p className="font-bold text-lg text-gray-800">{selectedShop.totalReviews || 0}</p>
                 </div>
                 
                 <div className="bg-green-50 rounded-xl p-4 text-center">
                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                     <Clock className="w-6 h-6 text-green-600" />
                   </div>
                   <p className="text-sm text-gray-600">Open Now</p>
                   <p className="font-bold text-lg text-gray-800">Yes</p>
                 </div>
                 
                 <div className="bg-purple-50 rounded-xl p-4 text-center">
                   <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                     <Calendar className="w-6 h-6 text-purple-600" />
                   </div>
                   <p className="text-sm text-gray-600">Established</p>
                   <p className="font-bold text-lg text-gray-800">2023</p>
                 </div>
               </div>

               {/* Contact Information */}
               <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Phone className="w-5 h-5 text-orange-600" />
                   Contact Information
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {selectedShop.phone && (
                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                       <Phone className="w-5 h-5 text-orange-600" />
                       <div>
                         <p className="text-sm text-gray-600">Phone</p>
                         <p className="font-semibold text-gray-800">{selectedShop.phone}</p>
                       </div>
                     </div>
                   )}
                   
                   {selectedShop.email && (
                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                       <Mail className="w-5 h-5 text-orange-600" />
                       <div>
                         <p className="text-sm text-gray-600">Email</p>
                         <p className="font-semibold text-gray-800">{selectedShop.email}</p>
                       </div>
                     </div>
                   )}
                   
                   {selectedShop.address && (
                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl md:col-span-2">
                       <MapPin className="w-5 h-5 text-orange-600" />
                       <div>
                         <p className="text-sm text-gray-600">Address</p>
                         <p className="font-semibold text-gray-800">
                           {selectedShop.address.street && `${selectedShop.address.street}, `}
                           {selectedShop.address.city && `${selectedShop.address.city}, `}
                           {selectedShop.address.state && `${selectedShop.address.state}`}
                         </p>
                       </div>
                     </div>
                   )}
                 </div>
               </div>

               {/* Operating Hours */}
               <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Clock className="w-5 h-5 text-orange-600" />
                   Operating Hours
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                     <div key={day} className="flex justify-between items-center p-3 bg-white rounded-lg">
                       <span className="font-medium text-gray-700">{day}</span>
                       <span className="text-orange-600 font-semibold">9:00 AM - 10:00 PM</span>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-4">
                 <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2">
                   <Navigation className="w-5 h-5" />
                   Get Directions
                 </button>
                 <button className="flex-1 bg-white border-2 border-orange-500 text-orange-600 py-4 px-6 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-2">
                   <Phone className="w-5 h-5" />
                   Call Now
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

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
         
         @keyframes slide-up {
           from {
             opacity: 0;
             transform: translateY(50px) scale(0.95);
           }
           to {
             opacity: 1;
             transform: translateY(0) scale(1);
           }
         }
         
         .animate-fade-in-up {
           animation: fade-in-up 0.6s ease-out;
         }
         
         .animate-slide-up {
           animation: slide-up 0.3s ease-out;
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
