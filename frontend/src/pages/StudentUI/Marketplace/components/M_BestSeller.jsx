import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/M_ShopContext'
import M_Title from './M_Title'
import M_ProductItem from './M_ProductItem'

const M_BestSeller = () => {
  const { products } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller)
      setBestSeller(bestProduct.slice(0, 5))
    }
  }, [products]) // ✅ add products so it updates when data changes

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 overflow-hidden'>
       {/* Animated background elements */}
       <div className='absolute inset-0'>
         <div className='absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-orange-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse'></div>
         <div className='absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-amber-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000'></div>
         <div className='absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full mix-blend-multiply filter blur-3xl'></div>
       </div>
       
       <div className='relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
         {/* Hero section with clean styling */}
         <div className='text-center mb-20 relative'>
           <div className='relative z-20 py-8'>
             <div className='mb-8'>
               <div className='text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 bg-clip-text tracking-tight leading-none'>
                 BEST  SELLERS
               </div>
               
             </div>
             
             <p className='w-3/4 max-w-3xl m-auto text-lg sm:text-xl text-slate-600 leading-relaxed font-light tracking-wide'>
               Discover what's trending now! These best sellers are the most popular choices among students.
             </p>
           </div>
         </div>

         {/*Rendering Products*/ }
         <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 gap-y-12 relative'>
          {/* Dynamic grid background */}
          <div className='absolute inset-0 opacity-5'>
            <div className='absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-orange-500/10 animate-pulse'></div>
          </div>
          
          {
            bestSeller.map((item) => (
              <div key={item._id} className='group relative'>
                {/* Magical glow effect */}
                <div className='absolute -inset-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 animate-pulse'></div>
                
                {/* Floating card effect */}
                <div className='relative transform transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-6 group-hover:rotate-1'>
                  {/* Glass morphism container */}
                  <div className='bg-white/80 backdrop-blur-xl rounded-3xl p-2 shadow-xl border border-white/50 group-hover:border-white/80 group-hover:shadow-2xl transition-all duration-500'>
                    {/* Inner glow */}
                    <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    
                    {/* Shimmer effect */}
                    <div className='absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-1000'></div>
                    
                    <div className='relative z-10'>
                      <M_ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                    </div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className='absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-100'></div>
                  <div className='absolute -bottom-1 -left-2 w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-300'></div>
                </div>
              </div>
            ))
          }
         </div>

       
       </div>
    </div>
  )
}

export default M_BestSeller