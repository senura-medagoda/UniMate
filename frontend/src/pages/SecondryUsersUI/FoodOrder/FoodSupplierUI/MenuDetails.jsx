import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import VendorNavbar from './components/VendorNavbar';
import { useVendorAuth } from './context/VendorAuthContext';

// API Base URL
const API_BASE_URL = 'http://localhost:5001/api';

const MenuDetails = () => {
  const { vendor, token } = useVendorAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    available: true,
    popular: false,
    images: [],
    imageFiles: []
  });

  const categories = ['Burgers', 'Pizza', 'Salads', 'Pasta', 'Desserts', 'Beverages'];

  // Fetch menu items on component mount
  useEffect(() => {
    if (vendor && token) {
      fetchMenuItems();
    }
  }, [vendor, token]);

  // Initialize imageFiles when editing an item
  useEffect(() => {
    if (editingItem) {
      setEditingItem(prev => ({
        ...prev,
        imageFiles: [] 
      }));
    }
  }, [editingItem?._id]); 

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/vendor`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems(data.data);
      } else {
        toastError('Failed to load menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toastError('Failed to load menu items');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    setNewItem(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
      imageFiles: [...(prev.imageFiles || []), ...files]
    }));
  };

  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    setEditingItem(prev => ({
      ...prev,
      images: [...(prev.images || []), ...imageUrls],
      imageFiles: [...(prev.imageFiles || []), ...files] 
    }));
  };

  const removeImage = (index) => {
    setNewItem(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles ? prev.imageFiles.filter((_, i) => i !== index) : []
    }));
  };

  const removeEditImage = (index) => {
    setEditingItem(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles ? prev.imageFiles.filter((_, i) => i !== index) : []
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    
    if (!newItem.name.trim()) {
      toastError('Item name is required');
      return;
    }
    
    if (!newItem.description.trim()) {
      toastError('Item description is required');
      return;
    }
    
    if (!newItem.price || newItem.price <= 0) {
      toastError('Valid price is required');
      return;
    }
    
    if (!newItem.category) {
      toastError('Please select a category');
      return;
    }
    
    if (!newItem.preparationTime || newItem.preparationTime <= 0) {
      toastError('Preparation time must be greater than 0');
      return;
    }
    
    setLoading(true);

    try {
     
      const formData = new FormData();
      
    
      formData.append('name', newItem.name);
      formData.append('description', newItem.description);
      formData.append('price', parseFloat(newItem.price));
      formData.append('category', newItem.category);
      formData.append('preparationTime', parseInt(newItem.preparationTime));
      formData.append('available', newItem.available);
      formData.append('popular', newItem.popular);
      
     
      if (newItem.imageFiles && newItem.imageFiles.length > 0) {
        newItem.imageFiles.forEach((file, index) => {
          formData.append('image', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/menu/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems(prev => [...prev, data.data]);
        resetNewItemForm();
        setShowAddForm(false);
        toastSuccess('Item added successfully!');
      } else {
        toastError(data.message || 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      toastError('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    
   
    if (!editingItem.name.trim()) {
      toastError('Item name is required');
      return;
    }
    
    if (!editingItem.description.trim()) {
      toastError('Item description is required');
      return;
    }
    
    if (!editingItem.price || editingItem.price <= 0) {
      toastError('Valid price is required');
      return;
    }
    
    if (!editingItem.category) {
      toastError('Please select a category');
      return;
    }
    
    if (!editingItem.preparationTime || editingItem.preparationTime <= 0) {
      toastError('Preparation time must be greater than 0');
      return;
    }
    
    setLoading(true);

    try {
     
      const formData = new FormData();
      
    
      formData.append('name', editingItem.name);
      formData.append('description', editingItem.description);
      formData.append('price', parseFloat(editingItem.price));
      formData.append('category', editingItem.category);
      formData.append('preparationTime', parseInt(editingItem.preparationTime));
      formData.append('available', editingItem.available);
      formData.append('popular', editingItem.popular);
      
      
      if (editingItem.imageFiles && editingItem.imageFiles.length > 0) {
        editingItem.imageFiles.forEach((file, index) => {
          formData.append('image', file);
        });
      }
      
 
      if ((!editingItem.imageFiles || editingItem.imageFiles.length === 0) && editingItem.images && editingItem.images.length > 0) {
        formData.append('existingImages', JSON.stringify(editingItem.images));
      } else if ((!editingItem.imageFiles || editingItem.imageFiles.length === 0) && (!editingItem.images || editingItem.images.length === 0)) {
     
        formData.append('existingImages', JSON.stringify([]));
      }
      
  
      console.log('Sending FormData for update:');
      console.log('Image files:', editingItem.imageFiles);
      console.log('Existing images:', editingItem.images);
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      const response = await fetch(`${API_BASE_URL}/menu/vendor/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems(prev => prev.map(item => 
          item._id === editingItem._id ? data.data : item
        ));
        setEditingItem(null);
        toastSuccess('Item updated successfully!');
      } else {
        toastError(data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      toastError('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const resetNewItemForm = () => {
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      preparationTime: '',
      available: true,
      popular: false,
      images: [],
      imageFiles: []
    });
  };

  const resetEditForm = () => {
    setEditingItem(null);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/menu/vendor/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setMenuItems(prev => prev.filter(item => item._id !== id));
          toastSuccess('Item deleted successfully!');
        } else {
          toastError(data.message || 'Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toastError('Failed to delete item');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleAvailability = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/menu/vendor/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems(prev => prev.map(item => 
          item._id === id ? { ...item, available: !item.available } : item
        ));
        toastSuccess('Availability updated!');
      } else {
        toastError(data.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toastError('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const renderAddForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Add New Item</h2>
            <button
              onClick={() => {
                setShowAddForm(false);
                resetNewItemForm();
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
              <input
                type="number"
                name="preparationTime"
                value={newItem.preparationTime}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Images</label>
              <div className="space-y-3">
               
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-gray-600">
                      <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm">Click to upload images</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </label>
                </div>

             
                {newItem.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {newItem.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setNewItem(prev => ({ ...prev, images: [], imageFiles: [] }))}
                      className="col-span-2 mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Clear All Images
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={newItem.available}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Available</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="popular"
                  checked={newItem.popular}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Popular</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  resetNewItemForm();
                }}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderEditForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Edit Item</h2>
            <button
              onClick={() => resetEditForm()}
              className="text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleUpdateItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input
                type="text"
                name="name"
                value={editingItem.name}
                onChange={handleEditInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={editingItem.description}
                onChange={handleEditInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={editingItem.price}
                  onChange={handleEditInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={editingItem.category}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
              <input
                type="number"
                name="preparationTime"
                value={editingItem.preparationTime}
                onChange={handleEditInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Images</label>
              <div className="space-y-3">
               
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                    id="edit-image-upload"
                  />
                  <label htmlFor="edit-image-upload" className="cursor-pointer">
                    <div className="text-gray-600">
                      <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm">Click to upload images</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </label>
                </div>

            
                {editingItem.images && editingItem.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {editingItem.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeEditImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEditingItem(prev => ({ ...prev, images: [], imageFiles: [] }))}
                      className="col-span-2 mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Clear All Images
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={editingItem.available}
                  onChange={handleEditInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Available</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="popular"
                  checked={editingItem.popular}
                  onChange={handleEditInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Popular</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => resetEditForm()}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavbar />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
         
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
                <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add New Item
              </button>
            </div>
          </div>

       
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

       
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1504674900240-9d8838d6d7c8?w=400'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => toggleAvailability(item._id)}
                      disabled={loading}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                    {item.popular && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-orange-600">${item.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.preparationTime} min</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      disabled={loading}
                      className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your filters or add a new menu item.</p>
            </div>
          )}

       
          {showAddForm && renderAddForm()}
          {editingItem && renderEditForm()}
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;
