import React, { useState } from 'react';

const MenuPopUp = ({ selectedItem, onClose, onAddToOrder }) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to order
  const handleAddToOrder = () => {
    onAddToOrder({
      item: selectedItem,
      quantity: quantity,
      specialInstructions: specialInstructions,
      totalPrice: selectedItem.price * quantity
    });
    // Reset form
    setQuantity(1);
    setSpecialInstructions('');
  };

  // Handle close modal
  const handleClose = () => {
    setQuantity(1);
    setSpecialInstructions('');
    onClose();
  };

  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-1/2">
            <img
              className="w-full h-64 lg:h-full object-cover"
              src={selectedItem.image || selectedItem.images?.[0] || 'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=🍽️+No+Image'}
              alt={selectedItem.name}
            />
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-between">
            <div>
              {/* Item Name */}
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                {selectedItem.name}
              </h2>

              {/* Price */}
              <p className="text-2xl font-bold text-orange-500 mb-4">
                ${selectedItem.price.toFixed(2)}
              </p>

              {/* Popularity Badge */}
              {selectedItem.isPopular && (
                <div className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full mb-4">
                  #1 most liked
                </div>
              )}

              {/* Description */}
              {selectedItem.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {selectedItem.description}
                </p>
              )}

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You may be charged for extras.
                </p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-4 py-2 text-gray-700 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add to Order Button */}
              <button
                onClick={handleAddToOrder}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
              >
                Add {quantity} to order • ${(selectedItem.price * quantity).toFixed(2)}
              </button>

              {/* See Details Link */}
              <button className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                See details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPopUp;


