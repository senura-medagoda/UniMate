import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImageToCloudinary } from "../../../../utils/cloudinary";
import axios from "axios";
import toast from "react-hot-toast";
import { useOwnerAuth } from "../../../../context/ownerAuthContext";

const EditBoardingPlace = () => {
  const { placeId } = useParams();
  const { owner, token } = useOwnerAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    amenities: "",
    availableFrom: "",
    contactNumber: "",
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImage, setExistingImage] = useState("");
  // Removed Additional Services feature

  // Fetch the boarding place data
  useEffect(() => {
    const fetchBoardingPlace = async () => {
      if (!token) {
        toast.error("Please log in to edit a boarding place.");
        navigate("/owner/dashboard");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5001/api/boarding-places/${placeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const place = res.data;
        setFormData({
          title: place.title || "",
          description: place.description || "",
          location: place.location || "",
          price: place.price || "",
          amenities: place.amenities ? place.amenities.join(", ") : "",
          availableFrom: place.availableFrom ? place.availableFrom.split('T')[0] : "",
          contactNumber: place.contactNumber || "",
        });

        if (place.images && place.images.length > 0) {
          setExistingImage(place.images[0]);
        }

        // Additional Services removed

        setLoading(false);
      } catch (err) {
        toast.error("Failed to load boarding place details");
        navigate("/owner/dashboard");
      }
    };

    fetchBoardingPlace();
  }, [placeId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Removed handlers for Additional Services

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!token || !owner?.ownerId) {
      toast.error("Please log in to edit a boarding place.");
      return;
    }

    try {
      let imageUrl = existingImage; // Keep existing image by default
      
      if (image) {
        toast.loading("Uploading new image...");
        imageUrl = await uploadImageToCloudinary(image);
        toast.dismiss();
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        amenities: formData.amenities ? formData.amenities.split(",").map((item) => item.trim()) : [],
        images: imageUrl ? [imageUrl] : [],
        // additionalServices removed
        createdBy: "owner",
      };

      await axios.put(`http://localhost:5001/api/boarding-places/${placeId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Boarding place updated successfully!");

      // Set session storage flag as backup
      sessionStorage.setItem('refreshDashboard', 'true');
      // Redirect to dashboard with refresh state
      navigate("/owner/dashboard", { state: { refresh: true } });

    } catch (err) {
      toast.error("Failed to update boarding place");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading boarding place details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Listing</h1>
            <p className="text-gray-600">Update your boarding place information</p>
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
              <p className="text-sm text-gray-500 mt-2">Leave empty to keep the current image</p>
              
              {/* Show existing image or new preview */}
              {(existingImage || previewUrl) && (
                <div className="mt-4">
                  <img 
                    src={previewUrl || existingImage} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg shadow-md" 
                  />
                </div>
              )}
            </div>

            {/* Additional Services removed */}
            
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => navigate("/owner-dashboard")}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Update Listing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBoardingPlace;
