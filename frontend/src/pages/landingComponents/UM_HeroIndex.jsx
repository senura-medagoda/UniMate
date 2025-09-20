import React from 'react';
import { Link } from 'react-router-dom';

const UM_HeroIndex = () => {
  return (
    <section className="bg-base-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 py-12 lg:py-24">
          
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <h1 className="text-4xl font-bold tracking-tight text-neutral sm:text-5xl md:text-6xl">
              Your All-in-One <span className="text-[#fc944c]">University Ecosystem</span>
            </h1>
            
            <p className="mt-6 text-lg text-neutral/80 max-w-3xl mx-auto lg:mx-0">
              Connect, discover, and thrive. UniMate brings everything a student needs into one seamless platform - from housing and meals to jobs and study materials. Campus life, simplified.
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
              <Link to="/join" className="btn bg-[#fc944c] hover:bg-[#ffa669] btn-lg text-white px-8">
                Get Started
              </Link>
              <Link to="/services" className="btn btn-outline btn-lg px-8">
                Explore Services
              </Link>
            </div>

            {/* Trust Indicator/Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#fc944c]">5+</div>
                <div className="text-sm text-neutral/70">Essential Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#fc944c]">1000+</div>
                <div className="text-sm text-neutral/70">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#fc944c]">50+</div>
                <div className="text-sm text-neutral/70">Partner Businesses</div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="bg-primary/10 rounded-2xl p-4 lg:p-6">
                <img 
                  src="https://placehold.co/800x600/2563eb/white?text=UniMate+App" 
                  alt="UniMate App Dashboard showing various student services"
                  className="rounded-xl shadow-2xl w-full h-auto"
                />
              </div>
              
              {/* Floating element for visual interest (optional) */}
              <div className="absolute -bottom-4 -right-4 bg-[#fc944c] text-white p-3 rounded-xl shadow-lg hidden lg:block">
                <div className="text-sm font-semibold">Join Our Community!</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UM_HeroIndex;