import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './context/context';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';

const Shops = () => {
  const { shops, navigate } = useAppContext();
  const routerNavigate = useNavigate();

  useEffect(() => {
    console.log('Shops:', shops);
  }, [shops]);

  const handleViewAllShops = () => {
    routerNavigate('/shops');
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-4 leading-tight">
            Featured Restaurants
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Discover amazing restaurants and food joints in your area
          </p>
        </div>

        {/* Responsive Grid Layout for Shops */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {shops && shops.length > 0 ? (
            shops.slice(0, 8).map((shop, index) => (
              <div 
                key={shop._id || index} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105 cursor-pointer"
                onClick={handleViewAllShops}
              >
                {/* Shop Image/Logo */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  {shop.logo ? (
                    <img 
                      src={shop.logo} 
                      alt={shop.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🏪</span>
                  )}
                </div>

                {/* Shop Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {shop.businessName}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{shop.address?.city || 'Location not specified'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{shop.averageRating || 0} ({shop.totalReviews || 0} reviews)</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {shop.description || 'Delicious food and great service'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600 font-medium text-sm">
                      {shop.cuisineType || 'Restaurant'}
                    </span>
                    <div className="flex items-center text-orange-500 text-sm font-medium">
                      View Menu
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty state message when no shops are found
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="text-center max-w-md mx-auto">
                <div className="text-8xl mb-6 opacity-60">🏪</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No Restaurants Available
                </h3>
                <p className="text-gray-600 text-lg">
                  Check back soon for amazing restaurants!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View All Shops Button */}
        {shops && shops.length > 0 && (
          <div className="flex justify-center mt-8 sm:mt-12">
            <button 
              onClick={handleViewAllShops}
              className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              View All Restaurants
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

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

export default Shops;
