import React, { useState } from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context';
import FoodNavbar from '../components/navbar/FoodNavbar';
import Footer from '../components/Footer';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, MapPin } from 'lucide-react';

const CartContent = () => {
  const { cartItems, addToCart, removeFromCart, updateCartItems, currency, menuItems } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [newAddress, setNewAddress] = useState('');


  const getCartItems = () => {
    return Object.entries(cartItems).map(([itemId, quantity]) => {
      const item = menuItems.find(menuItem => menuItem._id === itemId);
      return { ...item, quantity };
    }).filter(item => item._id);
  };

  const getTotalPrice = () => {
    return getCartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      // Use updateCartItems instead of multiple addToCart calls
      updateCartItems(itemId, newQuantity);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setSelectedAddress(newAddress);
      setShowAddressInput(false);
      setNewAddress('');
    }
  };

  const cartItemsList = getCartItems();

  if (cartItemsList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
        <FoodNavbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
                <ShoppingCart className="w-12 h-12 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 text-lg mb-8">
                Looks like you haven't added any delicious items to your cart yet. 
                Start exploring our menu to find something tasty!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </button>
                <button 
                  onClick={() => window.location.href = '/menu'}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold"
                >
                  Browse Menu
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FoodNavbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Cart</h1>
            <p className="text-gray-600 text-sm">
              {getTotalItems()} items in your cart
              <span 
                className="text-orange-600 ml-2 cursor-pointer hover:underline"
                onClick={() => window.location.href = '/menu'}
              >
                Add more →
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-3">Total Price</div>
                    <div className="col-span-2">Remove</div>
                  </div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {cartItemsList.map((item) => (
                    <div key={item._id} className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Product Column */}
                        <div className="col-span-5 flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={item.image || item.images?.[0] || 'https://via.placeholder.com/60x60/f3f4f6/9ca3af?text=🍽️'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-gray-600 text-sm mb-1">Food & Beverage</p>
                            <span className="text-orange-600 font-bold text-lg">
                              {currency} {item.price}
                            </span>
                          </div>
                        </div>
                        
                        {/* Quantity Column */}
                        <div className="col-span-2">
                          <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center py-2 border-0 focus:ring-0"
                              min="1"
                            />
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Total Price Column */}
                        <div className="col-span-3">
                          <span className="text-lg font-bold text-gray-900">
                            {currency} {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        {/* Remove Column */}
                        <div className="col-span-2">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
        
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Summary</h2>
                
                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">COD</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="Online"
                        checked={paymentMethod === 'Online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">Online Payment</span>
                    </label>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
                  <div className="relative">
                    <select
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select Address</option>
                      <option value="home">Home Address</option>
                      <option value="office">Office Address</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {!showAddressInput ? (
                    <button 
                      onClick={() => setShowAddressInput(true)}
                      className="text-orange-600 hover:text-orange-700 text-sm mt-2 flex items-center gap-1"
                    >
                      <MapPin className="w-4 h-4" />
                      Add Address +
                    </button>
                  ) : (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Enter your address..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddAddress}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowAddressInput(false);
                            setNewAddress('');
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Cost Breakdown */}
                <div className="mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>{currency} {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>
                </div>


                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span>{currency} {getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="w-full bg-[#fc944c] hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const CartPage = () => {
  return (
    <AppContextProvider>
      <CartContent />
    </AppContextProvider>
  );
};

export default CartPage;
