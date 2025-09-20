import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ onImageChange, currentImage = '', label = "Upload Image" }) => {
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
    
      onImageChange(file);
    }
  };

  const removeImage = () => {
    setPreview('');
    onImageChange(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
        </div>
        
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
      
      {!preview && (
        <div className="flex items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">Click to upload image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
