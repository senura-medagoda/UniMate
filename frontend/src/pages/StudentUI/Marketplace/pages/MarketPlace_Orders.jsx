import React, { useContext } from 'react'
import { ShopContext } from '../context/M_ShopContext'
import M_Title from '../components/M_Title';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';

const MarketPlace_Orders = () => {

  const {products ,currency} =useContext(ShopContext);

  return (
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar/>
      <div className='border-t pt-16 mb-20'>
        <div className='text-2xl mb-8'>
          <M_Title  text1={'MY '} text2={'ORDERS'}/>
        </div>

        <div className='space-y-6'>
          {
            products.slice(1,4).map((item,index)=>(
              <div key={index} className='bg-gradient-to-br from-orange-50/90 to-yellow-50/90 backdrop-blur-md rounded-2xl p-6 border border-orange-200/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                  
                  {/* Product Info Section */}
                  <div className='flex items-start gap-6'>
                    <div className='relative'>
                      <img  
                        className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md border border-white/50' 
                        src={item.image[0]} 
                        alt="" 
                      />
                      <div className='absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-xs font-bold'>1</span>
                      </div>
                    </div>
                    
                    <div className='flex-1'>
                      <h3 className='text-lg font-bold text-gray-800 mb-2'>{item.name}</h3>
                      
                      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3'>
                        <div className='flex items-center gap-2'>
                          <span className='text-2xl font-bold text-orange-600'>{currency}{item.price}</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <div className='w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center'>
                            <span className='text-xs font-semibold text-orange-700'>Q</span>
                          </div>
                          <span className='font-medium'>Qty: 1</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <div className='w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center'>
                            <span className='text-xs font-semibold text-orange-700'>M</span>
                          </div>
                          <span className='font-medium'>Size: M</span>
                        </div>
                      </div>
                      
                      <div className='flex items-center gap-2 text-sm text-gray-500'>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                        </svg>
                        <span>Order Date: </span>
                        <span className='font-semibold text-gray-700'>25 Jul, 2025</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Action Section */}
                  <div className='flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-4 lg:min-w-fit'>
                    
                    {/* Status Indicator */}
                    <div className='flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-200'>
                      <div className='relative'>
                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                        <div className='absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75'></div>
                      </div>
                      <span className='text-green-700 font-semibold text-sm'>Ready to Ship</span>
                    </div>
                    
                    {/* Track Button */}
                    <button className='bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2'>
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                      Track Order
                    </button>
                    
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default MarketPlace_Orders