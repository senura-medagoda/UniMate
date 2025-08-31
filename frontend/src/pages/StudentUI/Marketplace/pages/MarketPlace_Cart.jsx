import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/M_ShopContext'
import M_Title from '../components/M_Title';
import { assets } from '../assets/assets';
import M_CartTotal from '../components/M_CartTotal';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar'
import M_Footer from '../components/M_Footer';

const MarketPlace_Cart = () => {
  const {products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);



  

  useEffect(() => {


    if(products.length > 0){

        const tempData = [];
    for(const items in cartItems) {
      for(const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
    }
    setCartData(tempData);


    
  }
  
  }, [cartItems,products])

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50/30 via-orange-50/30 to-yellow-50/30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <MarketPlace_Navbar/>
        
        <div className='py-8'>
           <div className='mb-12'>
            <div className='flex items-center justify-center max-w-md mx-auto'>
              <div className='flex items-center'>
                <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-full text-sm font-medium'>
                  1
                </div>
                <span className='ml-2 text-sm font-medium text-gray-600'>Cart</span>
              </div>
              <div className='w-16 h-px bg-gradient-to-r from-yellow-600 to-orange-600 mx-4'></div>
              <div className='flex items-center'>
                <div className='flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 rounded-full text-sm font-medium'>
                  2
                </div>
                <span className='ml-2 text-sm font-medium text-gray-500'>Checkout</span>
              </div>
              <div className='w-16 h-px bg-gray-200 mx-4'></div>
              <div className='flex items-center'>
                <div className='flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 rounded-full text-sm font-medium'>
                  3
                </div>
                <span className='ml-2 text-sm font-medium text-gray-400'>Complete</span>
              </div>
            </div>
          </div>
          {/* Header Section */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center'>
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2 8m2-8h8m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z' />
                </svg>
              </div>
              <M_Title text1={'Your '} text2={'CART'} />
            </div>
            <p className='text-gray-600'>
              {cartData.length} {cartData.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-2 space-y-4'>
              {cartData.length === 0 ? (
                /* Empty Cart State */
                <div className='bg-white rounded-2xl p-12 text-center shadow-sm border border-orange-100'>
                  <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center'>
                    <svg className='w-12 h-12 text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z' />
                    </svg>
                  </div>
                  <h3 className='text-2xl font-semibold text-gray-900 mb-2'>Your cart is empty</h3>
                  <p className='text-gray-500 mb-6'>Discover amazing products and add them to your cart</p>
                  <button 
                    onClick={() => navigate('/M_collection')}
                    className='bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200'
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartData.map((item, index) => {
                  const productData = products.find((product) => product._id === item._id);
                  
                  return (
                    <div key={index} className='bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200 group'>
                      <div className='flex flex-col sm:flex-row gap-6'>
                        {/* Product Image */}
                        <div className='flex-shrink-0'>
                          <div className='w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-xl overflow-hidden group-hover:shadow-md transition-all duration-200'>
                            <img 
                              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200' 
                              src={productData.image[0]} 
                              alt={productData.name}
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className='flex-grow'>
                          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
                            <div className='flex-grow'>
                              <h3 className='font-semibold text-gray-900 text-lg mb-2 line-clamp-2'>
                                {productData.name}
                              </h3>
                              
                              <div className='flex flex-wrap items-center gap-3 mb-4'>
                                <span className='text-xl font-bold text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text'>
                                  {currency}{productData.price}
                                </span>
                                <span className='px-3 py-1 bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-lg text-sm font-medium text-orange-800'>
                                  Size: {item.size}
                                </span>
                              </div>

                              {/* Quantity Controls */}
                              <div className='flex items-center gap-3'>
                                <span className='text-sm font-medium text-gray-700'>Quantity:</span>
                                <div className='flex items-center border border-gray-200 rounded-lg overflow-hidden'>
                                  <button 
                                    onClick={() => updateQuantity(item._id, item.size, Math.max(0, item.quantity - 1))}
                                    className='px-3 py-2 hover:bg-gray-50 text-gray-600 hover:text-orange-600 transition-colors'
                                  >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
                                    </svg>
                                  </button>
                                  <input 
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === '' || value === '0') return;
                                      updateQuantity(item._id, item.size, Number(value));
                                    }}
                                    type="number" 
                                    min={1}  
                                    value={item.quantity} 
                                    className='w-16 px-2 py-2 text-center border-none focus:outline-none focus:ring-0'
                                  />
                                  <button 
                                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                    className='px-3 py-2 hover:bg-gray-50 text-gray-600 hover:text-orange-600 transition-colors'
                                  >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => updateQuantity(item._id, item.size, 0)}
                              className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200 group/remove'
                            >
                              <svg className='w-5 h-5 group-hover/remove:scale-110 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Cart Summary */}
            {cartData.length > 0 && (
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-orange-100 sticky top-6'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2'>
                    <div className='w-6 h-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full'></div>
                    Order Summary
                  </h3>
                  
                  <M_CartTotal />
                  
                  <div className='mt-6 space-y-3'>
                    <button 
                      onClick={() => navigate('/M_placeorder')}
                      className='w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 transform hover:-translate-y-0.5'
                    >
                      Proceed to Checkout
                    </button>
                    
                    <button 
                      onClick={() => navigate('/M_collection')}
                      className='w-full border-2 border-orange-200 text-orange-600 font-medium py-3 px-6 rounded-xl hover:bg-orange-50 transition-all duration-200'
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className='mt-6 pt-6 border-t border-gray-100'>
                    <div className='flex items-center justify-center gap-4 text-sm text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' />
                        </svg>
                        Secure
                      </div>
                      <div className='flex items-center gap-1'>
                        <svg className='w-4 h-4 text-blue-500' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        Fast Delivery
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <M_Footer/>
    </div>
  )
}

export default MarketPlace_Cart