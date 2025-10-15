import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/M_ShopContext';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';
import M_Footer from '../components/M_Footer';
import { assets } from '../assets/assets';
import { Link } from 'react-router';

const M_Favorites = ({ user, setUser }) => {
  const { products, favorites, removeFromFavorites, addToCart, currency } = useContext(ShopContext);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter products that are in favorites
    const filteredProducts = products.filter(product => favorites.includes(product._id));
    setFavoriteProducts(filteredProducts);
    setLoading(false);
  }, [products, favorites]);

  const handleRemoveFromFavorites = (productId) => {
    removeFromFavorites(productId);
  };

  const handleAddToCart = (productId) => {
    addToCart(productId, 'default');
  };

  if (loading) {
    return (
      <div>
        <MarketPlace_Navbar user={user} setUser={setUser} />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
        <M_Footer />
      </div>
    );
  }

  return (
    <div>
      <MarketPlace_Navbar user={user} setUser={setUser} />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
            <p className="text-gray-600">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} in your favorites
            </p>
          </div>

          {/* Favorites Grid */}
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-6">Start adding products to your favorites by clicking the heart icon on any product.</p>
              <Link 
                to="/M_collection"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <Link to={`/M_product/${product._id}`} className="block">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img 
                        src={product.image[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/M_product/${product._id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-orange-600">
                        {currency}{product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock || 0}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={!product.stock || product.stock <= 0}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          !product.stock || product.stock <= 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {!product.stock || product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      
                      <button
                        onClick={() => handleRemoveFromFavorites(product._id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove from favorites"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <M_Footer />
    </div>
  );
};

export default M_Favorites;
