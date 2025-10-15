import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl, getFirstImage } from '../../../utils/imageUtils';
import AccommodationNavbar from './components/AccommodationNavbar';
import BookingModal from './components/BookingModal';

const FavoritesPage = ({ user, setUser }) => {
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Debug: Check user data
  console.log('FavoritesPage - User data:', user);
  console.log('FavoritesPage - User name:', user?.name);
  console.log('FavoritesPage - User fname:', user?.fname);

  useEffect(() => {
    if (user && (user.id || user._id)) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      // Get user-specific favorites from localStorage
      const userId = user?.id || user?._id;
      if (!userId) {
        console.log('No user ID found');
        setLoading(false);
        return;
      }

      const userFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      setFavoriteIds(new Set(userFavorites));

      if (userFavorites.length === 0) {
        setFavoritePlaces([]);
        setLoading(false);
        return;
      }

      // Fetch all boarding places
      const res = await axios.get('http://localhost:5001/api/boarding-places');
      const allPlaces = res.data || [];
      
      // Filter to only show user's favorites
      const favorites = allPlaces.filter(place => userFavorites.includes(place._id));
      setFavoritePlaces(favorites);
      
    } catch (error) {
      toast.error('Failed to load favorites');
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (placeId) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      toast.error('Please log in to manage favorites');
      return;
    }

    const newFavorites = new Set(favoriteIds);
    if (newFavorites.has(placeId)) {
      newFavorites.delete(placeId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(placeId);
      toast.success('Added to favorites');
    }
    
    setFavoriteIds(newFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify([...newFavorites]));
    
    // Update the displayed favorites
    setFavoritePlaces(prev => prev.filter(place => place._id !== placeId));
  };

  const handleBookNow = (place) => {
    setSelectedPlace(place);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedPlace(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AccommodationNavbar user={user} setUser={setUser} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading your favorites...</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
              <p className="text-gray-600 text-lg">
                Your saved boarding places
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">{favoritePlaces.length}</p>
              <p className="text-gray-600">Saved Places</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {favoritePlaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring boarding places and add them to your favorites!
            </p>
            <Link
              to="/student/accommodation/boarding-places"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-block"
            >
              Explore Boarding Places
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoritePlaces.map((place) => (
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
                      onClick={() => toggleFavorite(place._id)}
                      className="p-2 rounded-lg shadow-md transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
                      title="Remove from favorites"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-bold text-2xl">Rs. {place.price}</p>
                    <p className="text-white text-sm opacity-90">per month</p>
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

      {/* Booking Modal */}
      {showBookingModal && selectedPlace && (
        <BookingModal
          place={selectedPlace}
          user={user}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
