import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] overflow-hidden pt-12 sm:pt-16 md:pt-20 lg:pt-24">
      {/* Background Image - Responsive */}
      <div className="absolute inset-0">
        <img
          src={assets.banner}
          alt="Food delivery banner"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content Container - Responsive */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Text Content */}
        <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl">
          {/* Main Heading - Responsive */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 md:mb-8 drop-shadow-lg">
            Satisfy every craving with our exceptional online food delivery service
          </h1>
          
          {/* Subtitle - Responsive */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl leading-relaxed drop-shadow-md">
            Discover delicious meals from the best restaurants and cafes in your area. 
            Fast delivery, fresh ingredients, and amazing taste guaranteed.
          </p>

          {/* CTA Button - Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 text-sm sm:text-base md:text-lg shadow-lg"
            >
              Order Now
              <img
                src={assets.arrow}
                alt="arrow"
                className="w-4 sm:w-5 md:w-6 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            
            {/* Secondary Button for Mobile */}
            <Link
              to="/shops"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 text-sm sm:text-base md:text-lg border border-white/30 backdrop-blur-sm"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>

        {/* Mobile Features - Only visible on small screens */}
        <div className="mt-8 sm:hidden">
          <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              Fast Delivery
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              Fresh Food
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              Best Prices
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Responsive */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12 lg:top-16 lg:right-16 hidden sm:block">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-orange-500/20 rounded-full backdrop-blur-sm border border-orange-400/30 animate-pulse"></div>
      </div>

      {/* Bottom Decorative Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600"></div>
    </div>
  );
};

export default MainBanner;