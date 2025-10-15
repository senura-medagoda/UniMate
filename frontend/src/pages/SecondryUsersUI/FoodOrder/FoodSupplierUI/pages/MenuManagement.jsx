import React, { useState, useEffect } from 'react';
import { useVendorAuth } from '../context/VendorAuthContext';
import VendorNavbar from '../components/VendorNavbar';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit, Trash2, Search, Filter, PlusCircle, CheckCircle, AlertCircle, Info } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const MenuManagement = () => {
  const { vendor, refreshMenuData } = useVendorAuth();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  
 
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes enter {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      @keyframes leave {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      .animate-enter {
        animation: enter 0.3s ease-out;
      }
      .animate-leave {
        animation: leave 0.3s ease-in;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [hasShop, setHasShop] = useState(false);

  
  const getImageUrl = (imagePath) => {
    console.log('getImageUrl called with:', imagePath);
    
    if (!imagePath) {
      console.log('No image path provided, returning null');
      return null;
    }
    
    
    if (imagePath.startsWith('http')) {
      console.log('Full URL detected, returning as is:', imagePath);
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads')) {
      const fullUrl = `http://localhost:5001${imagePath}`;
      console.log('Local path detected, constructed full URL:', fullUrl);
      return fullUrl;
    }
    
   
    const fullUrl = `http://localhost:5001/uploads/${imagePath}`;
    console.log('Filename detected, constructed full URL:', fullUrl);
    return fullUrl;
  };

  
  const showToast = (type, title, message, duration = 4000) => {
    if (type === 'success') {
      toastSuccess(title, message);
    } else if (type === 'error') {
      toastError(title, message);
    } else if (type === 'info') {
      toastInfo(title, message);
    }
  };

  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    isPopular: false,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isSpicy: false,
    preparationTime: 15,
    calories: '',
    image: '',
    images: []
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const categories = [
    'Burgers', 'Pizza', 'Salads', 'Pasta', 'Desserts', 
    'Beverages', 'Appetizers', 'Main Course', 'Sides', 'Drinks'
  ];


  useEffect(() => {
    fetchMenuItems();
    checkVendorShop();
  }, []);

  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkVendorShop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const checkVendorShop = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/shop/details', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHasShop(true); 
      } else if (response.status === 404) {
        setHasShop(false); 
      } else {
        setHasShop(false);
      }
    } catch (error) {
      console.error('Error checking vendor shop:', error);
      setHasShop(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/menu/vendor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
          'Content-Type': 'application/json'
        }
      });

             if (response.ok) {
         const data = await response.json();
         console.log('Fetched menu items data:', data);
         
         
         let items = [];
         if (data.data && Array.isArray(data.data)) {
           items = data.data;
         } else if (data.data && data.data.menuItems) {
           items = data.data.menuItems;
         } else if (Array.isArray(data)) {
           items = data;
         } else {
           items = [];
         }
         
         console.log('Processed menu items:', items);
         console.log('Image paths in items:', items.map(item => ({ name: item.name, image: item.image })));
         
         setMenuItems(items);
             } else {
         const errorData = await response.json();
         showToast(
           'error',
           'Fetch Failed',
           errorData.message || 'Failed to fetch menu items'
         );
       }
            } catch (error) {
         console.error('Error fetching menu items:', error);
         showToast(
           'error',
           'Network Error',
           'Failed to fetch menu items. Please check your connection.',
           5000
         );
       } finally {
         setLoading(false);
       }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInput = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    
    // Required field validations
    if (!formData.name.trim()) {
      errors.name = 'Menu item name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Menu item name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.price || formData.price === '') {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a valid positive number';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    // Optional field validations
    if (formData.calories && formData.calories !== '') {
      if (isNaN(parseFloat(formData.calories)) || parseFloat(formData.calories) < 0) {
        errors.calories = 'Calories must be a valid positive number';
      }
    }
    
    if (formData.preparationTime && (isNaN(parseInt(formData.preparationTime)) || parseInt(formData.preparationTime) < 1)) {
      errors.preparationTime = 'Preparation time must be a valid positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toastError('Please fix the form errors before submitting');
      return;
    }
    
         try {
       setSubmitting(true);
       
          
        // Show loading message
        toastInfo('Processing...', editingItem ? 'Updating menu item...' : 'Creating menu item...');
       
               const url = editingItem 
          ? `http://localhost:5001/api/menu/vendor/${editingItem._id}`
          : 'http://localhost:5001/api/menu/create';
       
       const method = editingItem ? 'PUT' : 'POST';
       
       console.log('Request details:', { url, method, editingItem: editingItem?._id });
      
    
      const formDataToSend = new FormData();
      
      // Handle text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      
      // Handle numeric fields
      formDataToSend.append('price', parseFloat(formData.price) || 0);
      formDataToSend.append('preparationTime', parseInt(formData.preparationTime) || 15);
      if (formData.calories && formData.calories !== '') {
        formDataToSend.append('calories', parseFloat(formData.calories) || 0);
      }
      
      // Handle boolean fields
      formDataToSend.append('isAvailable', formData.isAvailable ? 'true' : 'false');
      formDataToSend.append('isPopular', formData.isPopular ? 'true' : 'false');
      formDataToSend.append('isVegetarian', formData.isVegetarian ? 'true' : 'false');
      formDataToSend.append('isVegan', formData.isVegan ? 'true' : 'false');
      formDataToSend.append('isGlutenFree', formData.isGlutenFree ? 'true' : 'false');
      formDataToSend.append('isSpicy', formData.isSpicy ? 'true' : 'false');
      
      
      // Handle existing images for updates
      if (editingItem && !selectedImage) {
        const existingImages = [];
        if (editingItem.originalImage) {
          existingImages.push(editingItem.originalImage);
        }
        if (editingItem.originalImages && editingItem.originalImages.length > 0) {
          existingImages.push(...editingItem.originalImages);
        }
        if (existingImages.length > 0) {
          formDataToSend.append('existingImages', JSON.stringify(existingImages));
        }
      }
      
      // Handle new image upload
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }
      
         
       console.log('Sending FormData with image:', selectedImage);
       console.log('Form data being sent:', formData);
       console.log('Editing item ID:', editingItem?._id);
       console.log('Editing item original image:', editingItem?.originalImage);
       console.log('Editing item original images:', editingItem?.originalImages);
       
      
       for (let [key, value] of formDataToSend.entries()) {
         console.log(`FormData ${key}:`, value);
       }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
        
        },
        body: formDataToSend
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response ok:', response.ok);

             if (response.ok) {
         let data;
         try {
           data = await response.json();
           console.log('Success response:', data);
         } catch (jsonError) {
           console.error('Failed to parse response JSON:', jsonError);
           showToast(
             'error',
             'Response Error',
             'Invalid response from server. Please try again.',
             5000
           );
           return;
         }
         
       
         // Loading completed
         
       
         showToast(
           'success',
           editingItem ? 'Menu Item Updated!' : 'Menu Item Created!',
           editingItem ? 'Your menu item has been updated successfully' : 'Your new menu item has been added to the menu'
         );
         
         if (editingItem) {
           setMenuItems(prev => prev.map(item => 
             item._id === editingItem._id ? data.data : item
           ));
         } else {
        
           setMenuItems(prev => [data.data, ...prev]);
         }
         
         resetForm();
       
         fetchMenuItems();
       
         refreshMenuData();
               } else {
          let errorData;
          try {
            errorData = await response.json();
            console.error('Error response:', errorData);
          } catch (jsonError) {
            console.error('Failed to parse error response JSON:', jsonError);
            errorData = { message: 'Unknown server error' };
          }
          console.error('Response status:', response.status);
          console.error('Response headers:', response.headers);
          
        
          // Loading completed
          
        
          if (errorData.message === "Please create a shop first") {
            showToast(
              'error',
              'Shop Required',
              'Please create a shop first before adding menu items',
              5000
            );
          } else if (response.status === 404) {
            showToast(
              'error',
              'Menu Item Not Found',
              'The menu item you are trying to update could not be found',
              5000
            );
          } else if (response.status === 400) {
            showToast(
              'error',
              'Invalid Data',
              errorData.message || 'Please check your input data',
              5000
            );
          } else {
            showToast(
              'error',
              'Operation Failed',
              errorData.message || `Server error: ${response.status}`,
              5000
            );
          }
        }
                  } catch (error) {
        console.error('Error saving menu item:', error);
        
    
        // Loading completed
        
        showToast(
          'error',
          'Network Error',
          'Failed to save menu item. Please check your connection.',
          5000
        );
      } finally {
        setSubmitting(false);
      }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/menu/vendor/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
          'Content-Type': 'application/json'
        }
      });

             if (response.ok) {
         showToast(
           'success',
           'Menu Item Deleted!',
           'The menu item has been removed from your menu'
         );
         setMenuItems(prev => prev.filter(item => item._id !== itemId));
       
         refreshMenuData();
       } else {
         showToast(
           'error',
           'Delete Failed',
           'Failed to delete menu item. Please try again.'
         );
       }
            } catch (error) {
         console.error('Error deleting menu item:', error);
         showToast(
           'error',
           'Network Error',
           'Failed to delete menu item. Please check your connection.',
           5000
         );
       }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/menu/vendor/${itemId}/availability`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendorToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });

             if (response.ok) {
         setMenuItems(prev => prev.map(item => 
           item._id === itemId ? { ...item, isAvailable: !currentStatus } : item
         ));
         showToast(
           'success',
           'Availability Updated!',
           `Menu item is now ${!currentStatus ? 'available' : 'unavailable'}`,
           3000
         );
      
         refreshMenuData();
       } else {
         showToast(
           'error',
           'Update Failed',
           'Failed to update availability. Please try again.'
         );
       }
            } catch (error) {
         console.error('Error updating availability:', error);
         showToast(
           'error',
           'Network Error',
           'Failed to update availability. Please check your connection.',
           5000
         );
       }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isAvailable: true,
      isPopular: false,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 15,
      calories: '',
      image: '',
      images: []
    });
    setSelectedImage(null);
    setEditingItem(null);
    setShowAddForm(false);
    setFormErrors({});
  };

  const editItem = (item) => {
    console.log('Editing item:', item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isAvailable: item.isAvailable,
      isPopular: item.isPopular,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      isSpicy: item.isSpicy,
      preparationTime: item.preparationTime,
      calories: item.calories?.toString() || '',
      image: item.image || '',
      images: item.images || []
    });
    setFormErrors({});
    setEditingItem({
      ...item,
      // Preserve the original image data for existing images handling
      originalImage: item.image,
      originalImages: item.images
    });
    setSelectedImage(null); // Clear any previously selected image
    setShowAddForm(true);
    console.log('Form data set for editing:', {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      _id: item._id,
      originalImage: item.image,
      originalImages: item.images
    });
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesAvailability = !showAvailableOnly || item.isAvailable;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
       
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 mt-2">Manage your restaurant's menu items</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={!hasShop}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
              hasShop 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <PlusCircle size={20} />
            Add Menu Item
          </button>
        </div>

       
        {!hasShop && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Shop Required
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You need to create a shop first before you can add menu items. 
                  <a href="/vendor/shop-details" className="font-medium underline hover:text-yellow-600 ml-1">
                    Create Shop Now
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

      
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              Available Only
            </label>
            
          </div>
        </div>

        
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {!hasShop ? (
              <div className="text-center py-8">
                <div className="text-yellow-600 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Shop Required</h3>
                <p className="text-gray-600 mb-4">
                  You need to create a shop first before you can add menu items.
                </p>
                <a
                  href="/vendor/shop-details"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Create Shop Now
                </a>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter menu item name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter price"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      formErrors.preparationTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter preparation time in minutes"
                  />
                  {formErrors.preparationTime && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.preparationTime}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter detailed description of the menu item"
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  Available
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  Popular
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  Vegetarian
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isVegan"
                    checked={formData.isVegan}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  Vegan
                </label>
              </div>
              
               
            
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <ImageUpload
                   onImageChange={setSelectedImage}
                   currentImage={editingItem ? (editingItem.originalImage || formData.image) : formData.image}
                   label="Menu Item Image"
                 />
                 <div className="flex items-end">
                   <p className="text-sm text-gray-500">
                     Upload a high-quality image for your menu item. Recommended size: 800x600px
                   </p>
                 </div>
               </div>
               
               <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
            )}
          </div>
        )}

      
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading menu items...</p>
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No menu items found.</p>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add Your First Menu Item
                </button>
              )}
            </div>
          ) : (
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenuItems.map((item) => (
                  <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                   
                    <div className="relative">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=🍽️+No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center text-4xl">
                          🍽️
                        </div>
                      )}
                      
                     
                      <div className="absolute top-2 right-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      
                  
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-orange-600">Rs.{item.price}</span>
                        <span className="text-xs text-gray-500">{item.preparationTime || 15} min</span>
                      </div>
                      
                     
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => editItem(item)}
                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => toggleAvailability(item._id, item.isAvailable)}
                            className={`p-2 rounded-lg transition-colors ${
                              item.isAvailable
                                ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                            }`}
                            title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                          >
                            {item.isAvailable ? '🟡' : '🟢'}
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MenuManagement;
