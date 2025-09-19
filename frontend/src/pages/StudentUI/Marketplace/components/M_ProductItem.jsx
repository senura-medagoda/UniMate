import React, { useContext } from 'react'
import { ShopContext } from '../context/M_ShopContext'
// ⚠️ If you only have react-router, Link won’t work for web apps.
// Use <a> as a fallback. If you install react-router-dom, switch back to Link.

const M_ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <a
      href={`/M_product/${id}`} 
      className="text-gray-700 cursor-pointer block"
    >
      <div className="overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
        {/* Fixed square image container */}
        <div className="w-full aspect-square flex items-center justify-center bg-gray-50">
          <img
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            src={image[0]}
            alt={name}
          />
        </div>

        {/* Product details */}
        <div className="p-3 text-center">
          <p className="pt-2 pb-1 text-sm font-medium truncate">{name}</p>
          <p className="text-sm font-bold text-amber-600">{currency}{price}</p>
        </div>
      </div>
    </a>
  )
}

export default M_ProductItem
