import React, { useState, useEffect } from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context';
import FoodNavbar from '../components/navbar/FoodNavbar';
import Footer from '../components/Footer';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, MapPin, Edit3, Check, X } from 'lucide-react';

const CartContent = () => {
  const { cartItems, addToCart, removeFromCart, updateCartItems, currency, menuItems, placeOrder, user } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddressInput, setShowAddressInput] = useState(false);
  // address form fields
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrCity, setAddrCity] = useState('');
  
  // validation states
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Load saved address on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('food_delivery_address');
    if (savedAddress) {
      setSelectedAddress(savedAddress);
    }
    
    // Load saved address details for editing
    const savedDetails = localStorage.getItem('food_delivery_address_details');
    if (savedDetails) {
      try {
        const details = JSON.parse(savedDetails);
        setAddrName(details.name || '');
        setAddrPhone(details.phone || '');
        setAddrLine1(details.address || '');
        setAddrCity(details.city || '');
      } catch (error) {
        console.error('Failed to parse saved address details:', error);
      }
    }
  }, []);

  // Load saved address details for editing
  const loadSavedAddressDetails = () => {
    const savedDetails = localStorage.getItem('food_delivery_address_details');
    if (savedDetails) {
      try {
        const details = JSON.parse(savedDetails);
        setAddrName(details.name || '');
        setAddrPhone(details.phone || '');
        setAddrLine1(details.address || '');
        setAddrCity(details.city || '');
      } catch (error) {
        console.error('Failed to parse saved address details:', error);
      }
    }
  };

  // Handle edit address
  const handleEditAddress = () => {
    loadSavedAddressDetails();
    setShowAddressInput(true);
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setShowAddressInput(false);
    setValidationErrors({});
    loadSavedAddressDetails(); // Reset to saved values
  };

  // Validation functions
  const validateField = (field, value) => {
    const errors = {};
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          errors.phone = 'Phone number is required';
        } else if (!/^[0-9+\-\s()]{10,15}$/.test(value.trim())) {
          errors.phone = 'Please enter a valid phone number';
        }
        break;
      case 'address':
        if (!value.trim()) {
          errors.address = 'Address is required';
        } else if (value.trim().length < 5) {
          errors.address = 'Address must be at least 5 characters';
        }
        break;
      case 'city':
        if (!value.trim()) {
          errors.city = 'City is required';
        } else if (value.trim().length < 2) {
          errors.city = 'City must be at least 2 characters';
        }
        break;
    }
    
    return errors;
  };

  const validateAllFields = () => {
    const errors = {
      ...validateField('name', addrName),
      ...validateField('phone', addrPhone),
      ...validateField('address', addrLine1),
      ...validateField('city', addrCity)
    };
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getCartItems = () => {
    console.log('getCartItems called with:');
    console.log('cartItems:', cartItems);
    console.log('menuItems:', menuItems);
    
    const items = Object.entries(cartItems).map(([itemId, quantity]) => {
      const item = menuItems.find(menuItem => menuItem._id === itemId);
      console.log(`Processing item ${itemId}:`, { item, quantity });
      return { ...item, quantity };
    }).filter(item => item._id);
    
    console.log('Final cart items:', items);
    return items;
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
    setIsValidating(true);
    
    // Validate all fields
    if (!validateAllFields()) {
      setIsValidating(false);
      return;
    }
    
    const parts = [addrName, addrPhone, addrLine1, addrCity]
      .map(p => (p || '').trim())
      .filter(Boolean);
    const formatted = parts.join(', ');
    
    setSelectedAddress(formatted);
    // persist for future use
    try { 
      localStorage.setItem('food_delivery_address', formatted);
      // Also save individual fields for editing
      localStorage.setItem('food_delivery_address_details', JSON.stringify({
        name: addrName.trim(),
        phone: addrPhone.trim(),
        address: addrLine1.trim(),
        city: addrCity.trim()
      }));
    } catch (error) {
      console.error('Failed to save address:', error);
    }
    
    setShowAddressInput(false);
    setIsValidating(false);
    setValidationErrors({});
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please log in to place an order');
      return;
    }

    if (!selectedAddress) {
      alert('Please select or add a delivery address');
      return;
    }

    const cartItemsList = getCartItems();
    console.log('Cart items for order:', cartItemsList);
    console.log('Cart items object:', cartItems);
    console.log('Menu items:', menuItems);
    console.log('Total price:', getTotalPrice());

    if (cartItemsList.length === 0) {
      alert('Your cart is empty. Please add some items before placing an order.');
      return;
    }

    const orderData = {
      items: cartItemsList,
      totalAmount: getTotalPrice(),
      paymentMethod,
      deliveryAddress: selectedAddress,
      orderDate: new Date().toISOString(),
    };

    console.log('Order data being sent:', orderData);

    const result = await placeOrder(orderData);
    
    if (result.success) {
      // success navigation handled in context for COD, Stripe redirects for Online
    } else {
      console.error('Order placement failed:', result.message);
    }
  };

  const cartItemsList = getCartItems();

  if (cartItemsList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
        <FoodNavbar />
        <div className="pt-24 pb-12">
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
      
      {/* Cart Header Section */}
      <div className="pt-24 pb-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
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
      </div>

      {/* Cart Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">

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
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h3>
                  {!showAddressInput ? (
                    <div>
                      {selectedAddress ? (
                        <div className="space-y-3">
                          <div className="p-4 border rounded-lg bg-green-50 border-green-200 text-sm text-gray-800">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-green-800 mb-1">Saved Address</div>
                                <div className="text-gray-700">{selectedAddress}</div>
                              </div>
                              <button 
                                onClick={handleEditAddress}
                                className="ml-3 p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
                                title="Edit address"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Address saved - you won't need to enter it again
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No address added.</div>
                      )}
                      <button 
                        onClick={() => setShowAddressInput(true)}
                        className="text-orange-600 hover:text-orange-700 text-sm mt-2 flex items-center gap-1"
                      >
                        <MapPin className="w-4 h-4" />
                        {selectedAddress ? 'Change Address' : 'Add Address +'}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            value={addrName}
                            onChange={(e) => {
                              setAddrName(e.target.value);
                              if (validationErrors.name) {
                                setValidationErrors(prev => ({ ...prev, name: '' }));
                              }
                            }}
                            placeholder="Full name"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                              validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {validationErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="tel"
                            value={addrPhone}
                            onChange={(e) => {
                              setAddrPhone(e.target.value);
                              if (validationErrors.phone) {
                                setValidationErrors(prev => ({ ...prev, phone: '' }));
                              }
                            }}
                            placeholder="Phone number"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                              validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {validationErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={addrLine1}
                          onChange={(e) => {
                            setAddrLine1(e.target.value);
                            if (validationErrors.address) {
                              setValidationErrors(prev => ({ ...prev, address: '' }));
                            }
                          }}
                          placeholder="Address line 1"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                            validationErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.address && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            value={addrCity}
                            onChange={(e) => {
                              setAddrCity(e.target.value);
                              if (validationErrors.city) {
                                setValidationErrors(prev => ({ ...prev, city: '' }));
                              }
                            }}
                            placeholder="City"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                              validationErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {validationErrors.city && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddAddress}
                          disabled={isValidating}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isValidating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Validating...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Save Address
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
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
                
                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#fc944c] hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
                >
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

const CartPage = ({ user, setUser }) => {
  return (
    <AppContextProvider user={user} setUser={setUser}>
      <CartContent />
    </AppContextProvider>
  );
};

export default CartPage;
