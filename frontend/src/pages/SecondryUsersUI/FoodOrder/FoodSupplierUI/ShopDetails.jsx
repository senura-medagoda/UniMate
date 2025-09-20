import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import VendorNavbar from './components/VendorNavbar';
import { useVendorAuth } from './context/VendorAuthContext';

const ShopDetails = () => {
  const { vendor } = useVendorAuth();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    shopLicense: '',
    address: {
      street: '',
      city: ''
    },
    contactInfo: {
      email: '',
      phone: ''
    },
    openingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '23:00', closed: false },
      saturday: { open: '10:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '22:00', closed: false }
    },
    deliveryRadius: 5,
    minimumOrderAmount: 100,
    deliveryFee: 50,
    preparationTime: 30,
    isOpen: true
  });



  useEffect(() => {
    checkShopExists();
  }, []);

  const checkShopExists = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/shop/details', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setShopData(data.data);
        setHasShop(true);
        
        setFormData({
          businessName: data.data.businessName || '',
          description: data.data.description || '',
          shopLicense: data.data.shopLicense || '',
          address: data.data.address || { street: '', city: '' },
          contactInfo: data.data.contactInfo || { email: '', phone: '' },
          openingHours: data.data.openingHours || formData.openingHours,
          deliveryRadius: data.data.deliveryRadius || 5,
          minimumOrderAmount: data.data.minimumOrderAmount || 100,
          deliveryFee: data.data.deliveryFee || 50,
          preparationTime: data.data.preparationTime || 30,
          isOpen: data.data.isOpen !== undefined ? data.data.isOpen : true
        });
        setIsShopOpen(data.data.isOpen !== undefined ? data.data.isOpen : true);
        
      } else if (response.status === 404) {
        setHasShop(false);
       
        setFormData(prev => ({
          ...prev,
          contactInfo: {
            email: vendor?.email || '',
            phone: vendor?.phone || ''
          }
        }));
      }
    } catch (error) {
      console.error('Error checking shop:', error);
      setHasShop(false);
      toastError('Failed to load shop information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: field === 'closed' ? value : value
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toastError('File too large', 'Please select an image smaller than 10MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toastError('Invalid file type', 'Please select a valid image file (JPG, PNG, WebP)');
        return;
      }
      
      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width < 800 || img.height < 300) {
          toastError(
            'Image too small', 
            'Please upload an image with at least 800x300 pixels for best quality'
          );
          return;
        }
        setSelectedImage(file);
        toastSuccess('Image selected', 'High-quality image ready for upload');
      };
      img.onerror = () => {
        toastError('Invalid image', 'Please select a valid image file');
        return;
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5001${imagePath}`;
    }
    return `http://localhost:5001/uploads/${imagePath}`;
  };

  const toggleShopStatus = async () => {
    try {
      setSubmitting(true);
      const newStatus = !isShopOpen;
      
      const response = await fetch('http://localhost:5001/api/shop/toggle-status', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isOpen: newStatus })
      });

      if (response.ok) {
        setIsShopOpen(newStatus);
        setFormData(prev => ({ ...prev, isOpen: newStatus }));
        toastSuccess(
          'Shop Status Updated!', 
          `Your shop is now ${newStatus ? 'open' : 'closed'} for orders`
        );
      } else {
        toastError('Failed to update shop status');
      }
    } catch (error) {
      console.error('Error updating shop status:', error);
      toastError('Failed to update shop status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    if (!formData.businessName.trim()) {
      toastError('Business name is required');
      return;
    }
    
    if (!formData.address.street.trim()) {
      toastError('Street address is required');
      return;
    }
    

    
    if (formData.deliveryRadius < 1) {
      toastError('Delivery radius must be at least 1 km');
      return;
    }
    
    if (formData.minimumOrderAmount < 0) {
      toastError('Minimum order amount cannot be negative');
      return;
    }
    
    if (formData.deliveryFee < 0) {
      toastError('Delivery fee cannot be negative');
      return;
    }
    
    if (formData.preparationTime < 5) {
      toastError('Preparation time must be at least 5 minutes');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const url = hasShop ? 'http://localhost:5001/api/shop/details' : 'http://localhost:5001/api/shop/create';
      const method = hasShop ? 'PUT' : 'POST';
      
      let response;
      if (selectedImage) {
        // Use FormData for image upload
        const formDataToSend = new FormData();
        
        // Add all form fields
        formDataToSend.append('businessName', formData.businessName);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('shopLicense', formData.shopLicense || '');
        formDataToSend.append('deliveryRadius', formData.deliveryRadius);
        formDataToSend.append('minimumOrderAmount', formData.minimumOrderAmount);
        formDataToSend.append('deliveryFee', formData.deliveryFee);
        formDataToSend.append('preparationTime', formData.preparationTime);
        formDataToSend.append('isOpen', formData.isOpen);
        
        // Add nested objects as JSON strings
        formDataToSend.append('address', JSON.stringify(formData.address));
        formDataToSend.append('contactInfo', JSON.stringify(formData.contactInfo));
        formDataToSend.append('openingHours', JSON.stringify(formData.openingHours));
        
        // Add the image file with correct field name
        formDataToSend.append('logo', selectedImage);
        
        console.log('Sending FormData with image:', selectedImage.name);
        console.log('Form data being sent:', formData);
        console.log('FormData entries:');
        for (let [key, value] of formDataToSend.entries()) {
          console.log(key, value);
        }
        
        response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`
            // Don't set Content-Type header for FormData - let browser set it with boundary
          },
          body: formDataToSend
        });
      } else {
        // Use JSON for regular updates
        console.log('Sending JSON data:', formData);
        response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        let data;
        try {
          data = await response.json();
          console.log('Success response:', data);
        } catch (jsonError) {
          console.error('Failed to parse response JSON:', jsonError);
          toastError('Invalid response from server. Please try again.');
          return;
        }
        
        // Update shop data with new information
        setShopData(data.data);
        setSelectedImage(null);
        setShowUpdateForm(false);
        
        if (hasShop) {
          toastSuccess(
            'Shop Updated Successfully!',
            'Your restaurant details have been updated and saved to the system.'
          );
        } else {
          toastSuccess('Shop created successfully!');
        }
        
        setHasShop(true);
        setShopData(data.data);
        
        // Refresh shop data to get the latest information
        await checkShopExists();
        
        if (!hasShop) {
          navigate('/vendor/dashboard');
        }
      } else {
        let errorData;
        try {
          errorData = await response.json();
          console.error('Error response:', errorData);
        } catch (jsonError) {
          console.error('Failed to parse error response JSON:', jsonError);
          errorData = { message: 'Unknown server error' };
        }
        
        // Check if it's an image upload error but shop creation might still succeed
        if (errorData.message && errorData.message.includes('upload') && errorData.message.includes('image')) {
          toastError(
            'Image Upload Failed', 
            'Your shop was created successfully, but the image could not be uploaded. You can add an image later in the shop settings.'
          );
          
          // Still try to refresh shop data in case shop was created without image
          await checkShopExists();
          setHasShop(true);
          setShowUpdateForm(false);
        } else {
          toastError(errorData.message || 'Operation failed');
        }
      }
    } catch (error) {
      console.error('Error saving shop:', error);
      toastError('Failed to save shop details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {hasShop ? 'Edit Shop Details' : 'Create Your Shop'}
              </h1>
              <p className="text-gray-600 mt-2">
                {hasShop 
                  ? 'Update your restaurant information and settings'
                  : 'Set up your restaurant shop to start accepting orders'
                }
              </p>
            </div>
            {hasShop && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleShopStatus}
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isShopOpen
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isShopOpen ? (
                    <>
                      <span>🟢</span>
                      Shop Open
                    </>
                  ) : (
                    <>
                      <span>🔴</span>
                      Shop Closed
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Shop Picture Display */}
        {hasShop && shopData && (
          <div className="mb-8">
            <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-2xl group">
              {shopData.logo ? (
                <div className="relative w-full h-full">
                  <img
                    src={getImageUrl(shopData.logo)}
                    alt={shopData.businessName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1200x400/f3f4f6/9ca3af?text=🏪+Shop+Image';
                    }}
                    loading="lazy"
                  />
                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Shop name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                      {shopData.businessName}
                    </h2>
                    <p className="text-white/90 text-lg drop-shadow-md">
                      {shopData.description}
                    </p>
                  </div>
                  
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-8xl mb-6 opacity-80">🏪</div>
                    <div className="text-3xl font-bold mb-2">{shopData.businessName}</div>
                    <div className="text-lg opacity-90">Upload a high-quality image to showcase your shop</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shop Details Display */}
        {hasShop && shopData && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">🏪</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Name</h3>
                    <p className="text-gray-600">{shopData.businessName}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">📝</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Description</h3>
                    <p className="text-gray-600">{shopData.description}</p>
                  </div>
                </div>
                
                {shopData.shopLicense && (
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 text-xl">📄</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Shop License</h3>
                      <p className="text-gray-600 font-mono">{shopData.shopLicense}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">📍</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      {shopData.address?.street}, {shopData.address?.city}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">📞</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Contact</h3>
                    <p className="text-gray-600">
                      {shopData.contactInfo?.email}<br/>
                      {shopData.contactInfo?.phone}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">🚚</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery Radius</h3>
                    <p className="text-gray-600">{shopData.deliveryRadius} km</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">💰</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Minimum Order</h3>
                    <p className="text-gray-600">Rs. {shopData.minimumOrderAmount}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">🚛</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery Fee</h3>
                    <p className="text-gray-600">Rs. {shopData.deliveryFee}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">⏱️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Preparation Time</h3>
                    <p className="text-gray-600">{shopData.preparationTime} minutes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowUpdateForm(true)}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm"
              >
                 Update Shop Details
              </button>
            </div>
          </div>
        )}

        {/* Shop Creation/Update Form */}
        {(!hasShop || showUpdateForm) && (
          <div className={`${!hasShop ? 'block' : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'}`}>
            <div className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${!hasShop ? 'shadow-none' : ''}`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {hasShop ? 'Update Shop Details' : 'Create Your Shop'}
                  </h2>
                  {hasShop && (
                    <button
                      onClick={() => setShowUpdateForm(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Shop Image Upload */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">📸</span>
                      High-Quality Shop Image
                    </h3>
                    <div className="space-y-6">
                      {shopData?.logo && (
                        <div className="relative group">
                          <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <img
                              src={getImageUrl(shopData.logo)}
                              alt="Current shop image"
                              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                              <span className="text-xs font-medium text-gray-700">Current</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                            <span>📷</span>
                            Current shop image
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload High-Quality Image
                          </label>
                          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors duration-200">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 file:cursor-pointer cursor-pointer p-4"
                            />
                          </div>
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <p>📐 Recommended: 1200x400px or higher</p>
                            <p>📁 Supported: JPG, PNG, WebP</p>
                            <p>💾 Max size: 10MB</p>
                          </div>
                        </div>
                        
                        {selectedImage && (
                          <div className="mt-4 space-y-3">
                            <div className="relative group">
                              <div className="relative overflow-hidden rounded-lg shadow-lg border-2 border-green-200">
                                <img
                                  src={URL.createObjectURL(selectedImage)}
                                  alt="Preview"
                                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-2 py-1">
                                  <span className="text-xs font-medium">New</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-sm text-green-600 flex items-center gap-1">
                                  <span>✅</span>
                                  High-quality image selected
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(selectedImage.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe your restaurant, specialties, and what makes you unique..."
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop License Number
              </label>
              <input
                type="text"
                name="shopLicense"
                value={formData.shopLicense}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your shop license number (optional)"
              />
              <p className="mt-1 text-sm text-gray-500">
                📄 Enter your official shop license number if you have one
              </p>
            </div>
          </div>

       
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

         
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Radius (km)
                </label>
                <input
                  type="number"
                  name="deliveryRadius"
                  value={formData.deliveryRadius}
                  onChange={handleNumberInput}
                  min="1"
                  max="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  value={formData.minimumOrderAmount}
                  onChange={handleNumberInput}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fee
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleNumberInput}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preparation Time (minutes)
              </label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleNumberInput}
                min="5"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

     
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {hasShop ? (
                  <span>💡 Make changes to your shop details and click "Update Shop" to save</span>
                ) : (
                  <span>🚀 Fill in all required fields and click "Create Shop" to get started</span>
                )}
              </div>
              <div className="flex gap-4">
                {hasShop && (
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {selectedImage ? 'Uploading Image...' : 'Saving...'}
                    </span>
                  ) : (
                    hasShop ? 'Update Shop' : 'Create Shop'
                  )}
                </button>
              </div>
            </div>
          </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetails;
