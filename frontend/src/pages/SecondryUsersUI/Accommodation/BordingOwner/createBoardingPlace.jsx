import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../../../../utils/cloudinary";
import axios from "axios";
import toast from "react-hot-toast";
import { useOwnerAuth } from "../../../../context/ownerAuthContext";

const CreateBoardingPlace = () => {
  const { owner, token } = useOwnerAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    amenities: "",
    availableFrom: "",
    contactNumber: "",
  });

  const [errors, setErrors] = useState({});

  // Removed Additional Services feature

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const validateForm = () => {
    const newErrors = {};

    // Price validation
    if (!formData.price || formData.price === "") {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number greater than 0";
    }

    // Contact number validation
    if (!formData.contactNumber || formData.contactNumber === "") {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\s/g, ""))) {
      newErrors.contactNumber = "Contact number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Special handling for price - only allow positive numbers
    if (name === "price") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      if (numericValue === "" || (parseFloat(numericValue) > 0)) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
      return;
    }

    // Special handling for contact number - only allow digits
    if (name === "contactNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  // Removed handlers for Additional Services

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !owner?.ownerId) {
      toast.error("Please log in to create a boarding place.");
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      let imageUrls = [];
      if (images.length > 0) {
        toast.loading(`Uploading ${images.length} image(s)...`);
        const uploadPromises = images.map(image => uploadImageToCloudinary(image));
        imageUrls = await Promise.all(uploadPromises);
        toast.dismiss();
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        amenities: formData.amenities.split(",").map((item) => item.trim()),
        images: imageUrls,
        // additionalServices removed
        createdBy: "owner",
      };

      const res = await axios.post("http://localhost:5001/api/boarding-places", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Boarding place created!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        price: "",
        amenities: "",
        availableFrom: "",
        contactNumber: "",
      });
      setImages([]);
      setPreviewUrls([]);
      setErrors({});

      // Set session storage flag as backup
      sessionStorage.setItem('refreshDashboard', 'true');
      // Redirect to dashboard with refresh state
      navigate("/owner/dashboard", { state: { refresh: true } });

    } catch (err) {
      toast.error("Failed to create boarding place");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
            <p className="text-gray-600">Add your boarding place to help students find accommodation</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="Enter a catchy title for your listing" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200" 
                onChange={handleChange} 
                value={formData.title} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea 
                name="description" 
                placeholder="Describe your boarding place in detail" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none" 
                rows="4"
                onChange={handleChange} 
                value={formData.description} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  placeholder="Enter location" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200" 
                  onChange={handleChange} 
                  value={formData.location} 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.)</label>
                <input 
                  type="text" 
                  name="price" 
                  placeholder="Enter price (e.g., 15000)" 
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange} 
                  value={formData.price} 
                  required 
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
              <input 
                type="text" 
                name="amenities" 
                placeholder="WiFi, Kitchen, Laundry (comma separated)" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200" 
                onChange={handleChange} 
                value={formData.amenities} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available From</label>
                <input 
                  type="date" 
                  name="availableFrom" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200" 
                  onChange={handleChange} 
                  value={formData.availableFrom} 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                <input 
                  type="text" 
                  name="contactNumber" 
                  placeholder="Enter 10-digit contact number" 
                  maxLength="10"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange} 
                  value={formData.contactNumber} 
                  required 
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Images</label>
              <input 
                type="file" 
                onChange={handleImageChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
                accept="image/*" 
                multiple
              />
              <p className="text-sm text-gray-500 mt-1">You can select multiple images at once</p>
              
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg shadow-md" 
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {previewUrls.length} image(s) selected
                  </p>
                </div>
              )}
            </div>

            {/* Additional Services removed */}
            
            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardingPlace;
