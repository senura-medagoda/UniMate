import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from './context/context';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Individual Product Card Component
const ProductCard = ({ product, onCardClick }) => {
  const { cartItems, addToCart, removeFromCart, currency } = useAppContext();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get the count from cartItems, default to 0 if product isn't in the cart
  const count = cartItems[product._id] || 0;

  // Handle missing product data
  if (!product || !product.name) {
    return (
      <div className="border border-gray-200 rounded-2xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 min-w-48 max-w-full w-full h-72 flex items-center justify-center backdrop-blur-sm animate-pulse">
        <div className="text-center text-gray-500">
          <span className="text-3xl animate-bounce">⚠️</span>
          <p className="text-sm mt-2 animate-pulse font-medium">Invalid menu item</p>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (product.loading) {
    return (
      <div className="border border-gray-200 rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50 min-w-48 max-w-full w-full h-72 flex items-center justify-center backdrop-blur-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3 animate-pulse font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product._id);
      // Add success feedback
      setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      await removeFromCart(product._id);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    product && (
      <div 
        className="group relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 w-72 h-96 flex flex-col cursor-pointer"
        onClick={() => onCardClick && onCardClick(product)}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden h-40 flex-shrink-0">
          {product.image || product.images?.[0] ? (
            <>
              {/* Loading skeleton */}
              {isImageLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse z-10"></div>
              )}
              <img
                className={`w-full h-full object-cover transition-all duration-700 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                src={product.image || product.images?.[0]}
                alt={product.name || 'Food Item'}
                onLoad={() => setIsImageLoading(false)}
                onError={(e) => {
                  setIsImageLoading(false);
                  e.target.style.display = 'none';
                  const placeholder = e.target.nextElementSibling;
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
            </>
          ) : null}
          
          {/* Fallback placeholder - always present but hidden if image loads */}
          <div className={`w-full h-full bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 flex items-center justify-center ${product.image || product.images?.[0] ? 'hidden' : ''}`}>
            <span className="text-4xl">🍽️</span>
          </div>
          
          {/* Rating Badge - Top Right */}
          <div className="absolute top-3 right-3 bg-yellow-400 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <span className="text-white">★</span>
            <span className="font-bold">{product.rating?.toFixed(2) || '4.25'}</span>
          </div>
          
          {/* Like Badge - Bottom Right */}
          <div className="absolute bottom-3 right-3 bg-black text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <span className="text-white">♥</span>
            <span className="font-bold">{product.likes || '12'}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Restaurant Name */}
          <h3 className="text-base font-bold text-black mb-2 line-clamp-1">
            {product.shopName || product.name || 'Restaurant Name'}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-xs mb-3 leading-relaxed line-clamp-2 flex-1">
            {product.description || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'}
          </p>

          {/* Price and Order Button */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-black">
              {currency} {product.price || '85.00'}
            </span>
                <button
                  className="bg-black hover:bg-[#fc944c] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={isAddingToCart}
                >
                  ORDER NOW
                </button>
                </div>

          {/* Shop Info */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {(product.shopId?.businessName || product.vendorId?.businessName || 'S').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-black truncate">
                {product.shopId?.businessName || product.vendorId?.businessName || 'Shop Name'}
              </p>
              <p className="text-xs text-orange-500 truncate">
                {product.shopId?.address?.street || product.shopId?.address?.city || product.vendorId?.address?.city || 'Location'}
              </p>
            </div>
          </div>
        </div>

      </div>
    )
  );
};

// Main ShopCards Component
const ShopCards = ({ product }) => {
  const { menuItems, fetchMenuItems, isLoading, addToCart, cartItems, currency } = useAppContext();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Handle card click to show popup
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSpecialInstructions('');
    setShowPopup(true);
  };

  // Handle popup close
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
    setQuantity(1);
    setSpecialInstructions('');
  };

  // Handle quantity changes
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart from popup
  const handleAddToCartFromPopup = async () => {
    if (!selectedProduct) return;
    
    setIsAddingToCart(true);
    try {
      // Add multiple items to cart based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart(selectedProduct._id);
      }
      handleClosePopup();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -288, // Width of one card (288px) + gap (24px)
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 288, // Width of one card (288px) + gap (24px)
        behavior: 'smooth'
      });
    }
  };

  const loadMoreMenuItems = async () => {
    if (isLoading || !hasMoreItems) return;
    
    try {
      const result = await fetchMenuItems(currentPage + 1, 6);
      
      if (result && result.items.length > 0) {
        setAllMenuItems(prev => {
          // Filter out duplicates based on _id
          const existingIds = new Set(prev.map(item => item._id));
          const newItems = result.items.filter(item => !existingIds.has(item._id));
          return [...prev, ...newItems];
        });
        setCurrentPage(prev => prev + 1);
        setHasMoreItems(result.pagination.hasNextPage);
      } else {
        setHasMoreItems(false);
      }
    } catch (error) {
      console.error('Failed to load more menu items:', error);
    }
  };

  // Initialize scroll button states and load more items
  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    
    // Set initial menu items and reset pagination state
    if (menuItems && menuItems.length > 0) {
      // Remove duplicates based on _id before setting
      const uniqueItems = menuItems.filter((item, index, self) => 
        index === self.findIndex(t => t._id === item._id)
      );
      setAllMenuItems(uniqueItems);
      setCurrentPage(1);
      setHasMoreItems(true);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [menuItems]);

  // Load more items when scrolling near the end
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth;
        
        // Load more items when 80% scrolled
        if (scrollPercentage > 0.8 && hasMoreItems && !isLoading) {
          loadMoreMenuItems();
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMoreItems, isLoading, currentPage]);

  // If product prop is provided, render single product card
  if (product) {
    return <ProductCard product={product} onCardClick={handleCardClick} />;
  }

  // Otherwise render the scrollable menu items section
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-red-500 mb-2" style={{fontFamily: 'cursive'}}>
            Your Favourite Food
          </h2>
          <h3 className="text-2xl font-bold text-black uppercase tracking-wide">
            CHOOSE & ENJOY
          </h3>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Left Arrow Button - Only show when there are items */}
          {allMenuItems && allMenuItems.length > 0 && (
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${
              canScrollLeft 
                ? 'hover:bg-gray-50 hover:shadow-xl text-gray-700 hover:text-orange-600' 
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          )}

          {/* Right Arrow Button - Only show when there are items */}
          {allMenuItems && allMenuItems.length > 0 && (
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${
              canScrollRight 
                ? 'hover:bg-gray-50 hover:shadow-xl text-gray-700 hover:text-orange-600' 
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          )}

          {/* Scrollable Menu Items */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className={`flex gap-6 overflow-x-auto scrollbar-hide pb-4 ${
              allMenuItems && allMenuItems.length > 0 ? 'px-12' : 'px-4'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allMenuItems && allMenuItems.length > 0 ? (
              allMenuItems.map((item, index) => (
                <div key={`menu-item-${item._id}-${index}`} className="flex-shrink-0">
                  <ProductCard product={item} onCardClick={handleCardClick} />
                </div>
              ))
            ) : !isLoading ? (
              // Empty state message when no menu items are found
              <div className="w-full flex items-center justify-center py-16">
                <div className="text-center max-w-md mx-auto">
                  <div className="text-8xl mb-6 opacity-60">🍽️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    No Menu Items Available
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Check back soon for delicious food options!
                  </p>
                </div>
              </div>
            ) : (
              // Loading skeleton when data is being fetched
              <div className="flex gap-6 w-full">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-lg h-96 w-72 animate-pulse">
                      <div className="h-40 bg-gray-300 rounded-t-lg"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Loading indicator for more items */}
            {isLoading && hasMoreItems && (
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg h-96 w-72 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                    <p className="text-xs text-gray-500 mt-2">Loading more items...</p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Menu Detail Popup */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Side - Image */}
              <div className="lg:w-1/2 h-80 lg:h-auto lg:min-h-[500px]">
                <img
                  src={selectedProduct.image || selectedProduct.images?.[0] || 'https://via.placeholder.com/600x500/f3f4f6/9ca3af?text=🍽️'}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x500/f3f4f6/9ca3af?text=🍽️';
                  }}
                />
              </div>

              {/* Right Side - Details */}
              <div className="lg:w-1/2 p-8 flex flex-col justify-between min-h-[500px]">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      {selectedProduct.name || 'Menu Item'}
                    </h2>
                    <p className="text-3xl font-bold text-orange-500">
                      {currency} {selectedProduct.price || '0.00'}
                    </p>
                  </div>
                  <button
                    onClick={handleClosePopup}
                    className="text-gray-500 hover:text-gray-700 text-3xl font-light hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Popularity Badge */}
                <div className="mb-6">
                  <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    #1 most liked
                  </span>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {selectedProduct.description || 'Delicious food item description goes here. This is a mouth-watering dish that will satisfy your cravings.'}
                  </p>
                </div>

                {/* Special Instructions */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Special Instructions</h3>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  />
                  <p className="text-sm text-gray-500 mt-2">You may be charged for extras.</p>
                </div>

                {/* Quantity Control */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors text-lg font-medium"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-20 text-center py-3 border-0 focus:ring-0 text-lg font-medium"
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors text-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Order Button */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCartFromPopup}
                    disabled={isAddingToCart}
                    className="w-full bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Adding to cart...
                      </span>
                    ) : (
                      `Add ${quantity} to order • ${currency} ${((selectedProduct.price || 0) * quantity).toFixed(2)}`
                    )}
                  </button>
                  
                  <button className="text-gray-500 text-base hover:text-gray-700 transition-colors">
                    See details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCards;
