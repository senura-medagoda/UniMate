import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl, getFirstImage } from '../../../utils/imageUtils';
import AccommodationNavbar from './components/AccommodationNavbar';
import StudentImageGallery from './components/StudentImageGallery';
import BookingModal from './components/BookingModal';

const BoardingPlacesPage = ({ user, setUser }) => {
  const [boardingPlaces, setBoardingPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [favoritePlaces, setFavoritePlaces] = useState(new Set());
  
  // Debug: Log initial state
  console.log('Initial favoritePlaces state:', favoritePlaces, 'size:', favoritePlaces.size);
  const [sortBy, setSortBy] = useState('newest');

  // Debug: Check user data
  console.log('BoardingPlacesPage - User data:', user);
  console.log('BoardingPlacesPage - User name:', user?.name);
  console.log('BoardingPlacesPage - User fname:', user?.fname);

  useEffect(() => {
    fetchBoardingPlaces();
    loadFavorites();
  }, []);

  // Ensure favorites are loaded when user changes
  useEffect(() => {
    console.log('BoardingPlacesPage - User data changed:', user);
    if (user && (user.id || user._id)) {
      loadFavorites();
    } else {
      // Clear favorites if no user
      setFavoritePlaces(new Set());
    }
  }, [user]);

  const fetchBoardingPlaces = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5001/api/boarding-places');
      const fetched = res.data || [];
      setBoardingPlaces(fetched);
      const computedMaxPrice = fetched.length > 0 ? Math.max(...fetched.map((p) => Number(p.price) || 0)) : 50000;
      setMaxPrice(computedMaxPrice > 0 ? computedMaxPrice : 50000);
      setPriceRange([0, computedMaxPrice > 0 ? computedMaxPrice : 50000]);
    } catch (error) {
      toast.error('Failed to load boarding places');
      console.error('Error fetching boarding places:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const userId = user?.id || user?._id;
    if (!userId) {
      console.log('No user ID found for loading favorites');
      setFavoritePlaces(new Set());
      return;
    }
    
    // Load favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    console.log('Loading favorites for user:', userId, 'favorites:', favorites, 'length:', favorites.length);
    setFavoritePlaces(new Set(favorites));
  };

  const clearAllFavorites = () => {
    const userId = user?.id || user?._id;
    if (!userId) {
      toast.error('Please log in to manage favorites');
      return;
    }
    
    console.log('Clearing all favorites for user:', userId);
    console.log('Before clearing - favoritePlaces:', [...favoritePlaces], 'size:', favoritePlaces.size);
    
    // Clear all favorites-related localStorage keys
    const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('favorites_'));
    console.log('Keys to remove:', keysToRemove);
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    localStorage.removeItem(`favorites_${userId}`);
    setFavoritePlaces(new Set());
    console.log('After clearing - favoritePlaces should be empty');
    toast.success('All favorites cleared');
  };

  const debugFavorites = () => {
    const userId = user?.id || user?._id;
    console.log('=== DEBUG FAVORITES ===');
    console.log('User ID:', userId);
    console.log('Current favoritePlaces Set:', [...favoritePlaces]);
    console.log('Current favoritePlaces size:', favoritePlaces.size);
    console.log('localStorage favorites:', localStorage.getItem(`favorites_${userId}`));
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('All localStorage values:', Object.values(localStorage));
    
    // Check for any favorites-related keys
    const favoritesKeys = Object.keys(localStorage).filter(key => key.includes('favorite'));
    console.log('Favorites-related keys:', favoritesKeys);
    favoritesKeys.forEach(key => {
      console.log(`Key: ${key}, Value:`, localStorage.getItem(key));
    });
    
    console.log('========================');
  };

  const toggleFavorite = (placeId) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      toast.error('Please log in to manage favorites');
      return;
    }

    const newFavorites = new Set(favoritePlaces);
    console.log('Before toggle - placeId:', placeId, 'current favorites:', [...favoritePlaces], 'newFavorites:', [...newFavorites]);
    
    if (newFavorites.has(placeId)) {
      newFavorites.delete(placeId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(placeId);
      toast.success('Added to favorites');
    }
    
    console.log('After toggle - newFavorites:', [...newFavorites], 'size:', newFavorites.size);
    setFavoritePlaces(newFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify([...newFavorites]));
  };

  const handleBookNow = (place) => {
    setSelectedPlace(place);
    setShowBookingModal(true);
  };

  const handleImageGallery = (place) => {
    setSelectedPlace(place);
    setShowImageGallery(true);
  };

  const handleCloseImageGallery = () => {
    setShowImageGallery(false);
    setSelectedPlace(null);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedPlace(null);
    
  };

  const filteredPlaces = boardingPlaces.filter(place => {
    const matchesSearch = place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchTerm.toLowerCase());
    const priceValue = Number(place.price) || 0;
    const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];
    return matchesSearch && matchesPrice;
  });

  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AccommodationNavbar user={user} setUser={setUser} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading boarding places...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccommodationNavbar user={user} setUser={setUser} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Boarding Place</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto lg:mx-0">
              Discover comfortable and affordable accommodation options near your university
            </p>
            </div>
            
            {/* Favorites Button */}
            <div className="flex justify-center lg:justify-end gap-4">
              <Link
                to="/student/accommodation/favorites"
                className="group text-gray-700 hover:text-red-500 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>My Favorites</span>
                <div className="bg-red-100 text-red-600 rounded-full px-2 py-1 text-xs font-bold">
                  {favoritePlaces?.size || 0}
                </div>
              </Link>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: Rs. {priceRange[0]} - Rs. {priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Rs. 0</span>
                  <span>Rs. {maxPrice}</span>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                {sortedPlaces.length} places found
              </div>
            </div>
          </div>

          {/* Places Grid */}
          <div className="lg:w-3/4">
            {sortedPlaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No places found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedPlaces.map((place) => (
                  <div
                    key={place._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(getFirstImage(place.images))}
                        alt={place.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => handleImageGallery(place)}
                          className="bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 p-2 rounded-lg shadow-md transition-all duration-200"
                          title="View All Images"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleFavorite(place._id)}
                          className={`p-2 rounded-lg shadow-md transition-all duration-200 ${
                            favoritePlaces.has(place._id)
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500'
                          }`}
                          title={favoritePlaces.has(place._id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg className="w-5 h-5" fill={favoritePlaces.has(place._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex items-center justify-between">
                          <div>
                        <p className="text-white font-bold text-2xl">Rs. {place.price}</p>
                        <p className="text-white text-sm opacity-90">per month</p>
                          </div>
                          {place.images && place.images.length > 0 && (
                            <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{place.images.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{place.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{place.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-700 font-medium">{place.location}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8" />
                        </svg>
                        <p className="text-gray-700">Available from: {new Date(place.availableFrom).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <p className="text-gray-700">{place.contactNumber}</p>
                      </div>
                      
                      {place.amenities && place.amenities.length > 0 && (
                        <div className="border-t pt-4 mb-4">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Amenities:</p>
                          <div className="flex flex-wrap gap-2">
                            {place.amenities.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                                {amenity}
                              </span>
                            ))}
                            {place.amenities.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                +{place.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Additional Services */}
                      {place.additionalServices && place.additionalServices.length > 0 && (
                        <div className="border-t pt-4 mb-4">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Additional Services:</p>
                          <div className="space-y-2">
                            {place.additionalServices.slice(0, 2).map((service, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{service.name}</span>
                                <span className="text-orange-600 font-medium">Rs. {service.price}</span>
                              </div>
                            ))}
                            {place.additionalServices.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{place.additionalServices.length - 2} more services available
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Book Now Button - Always at bottom */}
                      <button
                        onClick={() => handleBookNow(place)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg mt-auto"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedPlace && (
        <BookingModal
          place={selectedPlace}
          user={user}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Student Image Gallery Modal */}
      {showImageGallery && selectedPlace && (
        <StudentImageGallery
          place={selectedPlace}
          onClose={handleCloseImageGallery}
        />
      )}
    </div>
  );
};

export default BoardingPlacesPage;

