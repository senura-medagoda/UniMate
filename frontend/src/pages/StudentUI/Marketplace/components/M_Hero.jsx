import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const M_Hero = () => {
  const navigate = useNavigate();

  const handleStartShopping = () => {
    navigate('/M_collection');
  };

  const handleTopCollections = () => {
    // Scroll to the best sellers section
    const bestSellersSection = document.getElementById('best-sellers');
    if (bestSellersSection) {
      bestSellersSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className='relative w-full h-screen overflow-hidden'>
      {/* Clean background */}
      <div className='absolute inset-0'>
        <img 
          src={assets.homepage} 
          className='w-full h-full object-cover' 
          alt='Campus Marketplace Hero' 
        />
        {/* Dark overlay for better text readability */}
        <div className='absolute inset-0 bg-black/60'></div>
      </div>

      {/* Content overlay */}
      <div className='relative z-10 h-full flex flex-col justify-center px-0 pt-28'>
        <div className='max-w-full mx-0 w-full px-8 sm:px-12 lg:px-16 xl:px-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
            
            {/* Left side - Clean text content */}
            <div className='text-white space-y-6 lg:space-y-8'>
              {/* Top badge */}
              <div className='flex items-center gap-3'>
                <div className='w-12 h-[3px] bg-orange-500'></div>
                <p className='font-semibold text-sm sm:text-base tracking-wider text-orange-500'>
                  CAMPUS ESSENTIALS
                </p>
                <div className='w-12 h-[3px] bg-orange-500'></div>
              </div>
              
              {/* Main heading */}
              <h1 className='prata-regular text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight drop-shadow-2xl'>
                <span className='block text-white drop-shadow-lg'>We are digital</span>
                <span className='block text-white drop-shadow-lg'>meets <span className='text-orange-500 drop-shadow-lg'>fashion</span></span>
              </h1>
              
              {/* Subtitle */}
              <p className='text-lg sm:text-xl text-white max-w-lg leading-relaxed drop-shadow-md font-medium'>
                Show your campus pride, get high-quality essentials directly from the marketplace foundation.
                <span className='inline-block ml-2'>→</span>
              </p>
              
              {/* Clean CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <button 
                  onClick={handleStartShopping}
                  className='bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                >
                  Start Shopping
                </button>
                
                <button 
                  onClick={handleTopCollections}
                  className='text-white text-lg font-semibold hover:text-orange-300 transition-colors duration-300 drop-shadow-md'
                >
                  Top Collections
                </button>
              </div>

              {/* Stats or features */}
              <div className='flex items-center gap-8 pt-6 text-sm text-white drop-shadow-md'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                  <span className='font-medium'>1000+ Products</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
                  <span className='font-medium'>Fast Delivery</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'></div>
                  <span className='font-medium'>Premium Quality</span>
                </div>
              </div>
            </div>

            {/* Right side - Remove empty showcase area */}
            <div className='relative hidden lg:block'>
              <div className='relative w-full h-96 xl:h-[500px] flex items-center justify-end'>
                <div className='text-right text-white/60'>
                  <p className='text-lg font-light'>
                    Premium Campus Fashion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Enhanced mobile indicators */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden flex gap-3'>
        <div className='w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg'></div>
        <div className='w-3 h-3 bg-white/30 rounded-full hover:bg-white/50 transition-colors duration-300 cursor-pointer'></div>
        <div className='w-3 h-3 bg-white/30 rounded-full hover:bg-white/50 transition-colors duration-300 cursor-pointer'></div>
      </div>

      {/* Custom CSS animations - Add this to your CSS file */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(3deg); }
          66% { transform: translateY(5px) rotate(-3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fade-in-left {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes expand {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-fade-in-left { animation: fade-in-left 1s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 1s ease-out 0.3s both; }
        .animate-expand { animation: expand 2s ease-out; }
        .animate-gradient { 
          background-size: 200% 200%; 
          animation: gradient 3s ease infinite; 
        }
      `}</style>
    </div>
  )
}

export default M_Hero