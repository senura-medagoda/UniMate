import React, { useContext } from 'react'
import { ShopContext } from '../context/M_ShopContext'
// ⚠️ If you only have react-router, Link won't work for web apps.
// Use <a> as a fallback. If you install react-router-dom, switch back to Link.

const M_ProductItem = ({ id, image, name, price }) => {
  const { currency, addToFavorites, removeFromFavorites, isFavorite } = useContext(ShopContext);

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
          
          {/* Favorites button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isFavorite(id) ? removeFromFavorites(id) : addToFavorites(id);
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorite(id)
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
            title={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
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
