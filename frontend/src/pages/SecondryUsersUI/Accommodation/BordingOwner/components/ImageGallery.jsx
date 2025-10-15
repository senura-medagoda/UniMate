import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../../../../../utils/cloudinary';
import { getImageUrl } from '../../../../../utils/imageUtils';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImageGallery = ({ place, onUpdate, onClose, token }) => {
  const [images, setImages] = useState(place.images || []);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleAddImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadImageToCloudinary(file));
      const newImageUrls = await Promise.all(uploadPromises);
      
      const updatedImages = [...images, ...newImageUrls];
      setImages(updatedImages);
      
      // Update the boarding place with new images
      await axios.put(`http://localhost:5001/api/boarding-places/${place._id}`, {
        images: updatedImages
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`${files.length} image(s) added successfully!`);
      onUpdate(updatedImages);
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageIndex) => {
    try {
      const updatedImages = images.filter((_, index) => index !== imageIndex);
      setImages(updatedImages);
      
      // Update the boarding place with removed image
      await axios.put(`http://localhost:5001/api/boarding-places/${place._id}`, {
        images: updatedImages
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Image removed successfully!');
      onUpdate(updatedImages);
    } catch (error) {
      toast.error('Failed to remove image');
      console.error('Remove error:', error);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{place.title}</h2>
            <p className="text-gray-600">Manage Property Images</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Add Images Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Add New Images
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                onChange={handleAddImages}
                accept="image/*"
                multiple
                disabled={uploading}
                className="hidden"
                id="add-images"
              />
              <label
                htmlFor="add-images"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-orange-300 hover:border-orange-400 cursor-pointer transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-orange-600 font-medium">
                  {uploading ? 'Uploading...' : 'Add Images'}
                </span>
              </label>
              <span className="text-sm text-gray-500">
                {images.length} image(s) total
              </span>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={getImageUrl(imageUrl)}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => openImageModal(imageUrl)}
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No images uploaded yet</p>
              <p className="text-gray-400 text-sm">Add some images to showcase your property</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={getImageUrl(selectedImage)}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
