import React, { useContext } from 'react'
import { ShopContext } from '../context/M_ShopContext'
// ⚠️ If you only have react-router, Link won’t work for web apps.
// Use <a> as a fallback. If you install react-router-dom, switch back to Link.

const M_ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <a
      href={`/M_product/${id}`} 
      className="text-gray-700 cursor-pointer block group"
    >
      <div className="overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Enhanced image container with better aspect ratio */}
        <div className="w-full aspect-[4/5] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          <img
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
            src={image[0]}
            alt={name}
          />
          {/* Overlay effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Enhanced product details */}
        <div className="p-4 text-center">
          <p className="pt-2 pb-2 text-base font-semibold text-gray-800 line-clamp-2 leading-tight">{name}</p>
          <p className="text-lg font-bold text-orange-600 mb-2">{currency}{price}</p>
          
          {/* Add to cart button */}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 opacity-0 group-hover:opacity-100">
            Quick View
          </button>
        </div>
      </div>
    </a>
  )
}

export default M_ProductItem
