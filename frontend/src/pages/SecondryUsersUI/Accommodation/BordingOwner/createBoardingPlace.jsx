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

  // Removed Additional Services feature

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Removed handlers for Additional Services

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !owner?.ownerId) {
      toast.error("Please log in to create a boarding place.");
      return;
    }

    try {
      let imageUrl = "";
      if (image) {
        toast.loading("Uploading image...");
        imageUrl = await uploadImageToCloudinary(image);
        toast.dismiss();
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        amenities: formData.amenities.split(",").map((item) => item.trim()),
        images: imageUrl ? [imageUrl] : [],
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
      setImage(null);
      setPreviewUrl("");

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
                  type="number" 
                  name="price" 
                  placeholder="Enter price" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200" 
                  onChange={handleChange} 
                  value={formData.price} 
                  required 
                />
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
                  placeholder="Enter contact number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200" 
                  onChange={handleChange} 
                  value={formData.contactNumber} 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Image</label>
              <input 
                type="file" 
                onChange={handleImageChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
                accept="image/*" 
              />
              {previewUrl && (
                <div className="mt-4">
                  <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-lg shadow-md" />
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
