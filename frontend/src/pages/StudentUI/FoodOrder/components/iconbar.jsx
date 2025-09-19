import React from 'react';
import { assets } from '../assets/assets';

const IconBar = () => {
  return (
    <div className="relative -mt-32 sm:-mt-40 lg:-mt-48 xl:-mt-56 z-10 py-16 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 relative leading-tight">
            How It Works
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Ordering delicious food has never been easier. Follow these simple steps to get your meal delivered right to your door.
          </p>
        </div>

        {/* Responsive Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Step 1: Choose Food */}
          <div className="group text-center p-6 sm:p-8 lg:p-10 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 active:scale-95">
            <div className="mb-4 sm:mb-6 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-4 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
                <img 
                  src={assets.choose_food} 
                  alt="Choose your food" 
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">
                1
              </div>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
              Choose Your Food
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Browse through our extensive menu and pick tasty meals crafted with fresh, high-quality ingredients. 
              From local favorites to international cuisine, we have something for everyone.
            </p>
            
            {/* Hover effect border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-300 transition-all duration-500 pointer-events-none"></div>
          </div>

          {/* Step 2: Place Order */}
          <div className="group text-center p-6 sm:p-8 lg:p-10 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 active:scale-95">
            <div className="mb-4 sm:mb-6 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <img 
                  src={assets.order} 
                  alt="Place your order" 
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">
                2
              </div>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
              Place Your Order
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Add your favorite dishes to cart, customize your order with special requests, 
              and proceed to checkout with our secure payment system. It's that simple!
            </p>
            
            {/* Hover effect border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-all duration-500 pointer-events-none"></div>
          </div>

          {/* Step 3: Wait for Delivery */}
          <div className="group text-center p-6 sm:p-8 lg:p-10 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 active:scale-95">
            <div className="mb-4 sm:mb-6 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                <img 
                  src={assets.delivery} 
                  alt="Wait for delivery" 
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">
                3
              </div>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-green-600 transition-colors duration-300 leading-tight">
              Wait for Delivery
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Relax and track your order in real-time. Our dedicated delivery partners will bring 
              your fresh, hot meal right to your doorstep within the promised time.
            </p>
            
            {/* Hover effect border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-300 transition-all duration-500 pointer-events-none"></div>
          </div>
        </div>

        {/* Additional Features - Responsive */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Why Choose Our Service?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col items-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl sm:text-3xl">🚚</span>
              </div>
              <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-2">Fast Delivery</h4>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Quick and reliable delivery service</p>
            </div>
            <div className="flex flex-col items-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl sm:text-3xl">🍽️</span>
              </div>
              <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-2">Fresh Food</h4>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Quality ingredients and fresh preparation</p>
            </div>
            <div className="flex flex-col items-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl sm:text-3xl">💳</span>
              </div>
              <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-2">Secure Payment</h4>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Safe and secure payment options</p>
            </div>
            <div className="flex flex-col items-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl sm:text-3xl">⭐</span>
              </div>
              <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-2">Best Quality</h4>
              <p className="text-xs sm:text-sm text-gray-600 text-center">Premium quality food and service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconBar;
