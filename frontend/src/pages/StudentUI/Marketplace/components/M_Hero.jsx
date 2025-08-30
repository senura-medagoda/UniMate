import React from 'react'
import { assets } from '../assets/assets'

const M_Hero = () => {
  return (
    <div className='relative overflow-hidden mr-10 ml-10 '>
      {/* Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
        <div className='absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div className='absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-yellow-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div className='absolute -bottom-8 left-40 w-80 h-80 bg-gradient-to-r from-blue-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
      </div>

      {/* Original content with rounded border */}
      <div className='relative z-10 flex flex-col sm:flex-row border border-gray-400 rounded-2xl overflow-hidden'>
        {/* Hero left */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
          <div className='text-[#414141]'>
            <div className='flex items-center gap-2'>
              <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
              <p className='font-medium text-sm md:text-base'>CAMPUS ESSENTIALS</p>
            </div>
            <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
              Everything in One Place
            </h1>
            <div className='flex items-center gap-2'>
              <p className='font-semibold text-sm md:text-base'>Shop Today</p>
              <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            </div>
          
       
        {/* Stats Section */}
            <div className='flex justify-center sm:justify-start gap-8 mt-8'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-[#414141]'>10K+</div>
                <div className='text-sm text-gray-600'>Happy Students</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-[#414141]'>500+</div>
                <div className='text-sm text-gray-600'>Products</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-[#414141]'>4.9★</div>
                <div className='text-sm text-gray-600'>Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero right */}
        <img src={assets.homepage} className='w-full sm:w-1/2 object-cover ' alt='' />
      </div>
    </div>
  )
}

export default M_Hero