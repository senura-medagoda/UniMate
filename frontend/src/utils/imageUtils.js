// Utility function to get the correct image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "https://via.placeholder.com/400x300?text=No+Image";
  }
  
  // If it's already a full URL (starts with http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative URL (starts with /), prefix with backend URL
  if (imageUrl.startsWith('/')) {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    return `${backendUrl}${imageUrl}`;
  }
  
  // If it's just a filename, assume it's in uploads folder
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  return `${backendUrl}/uploads/${imageUrl}`;
};

// Utility function to get the first image from an array
export const getFirstImage = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }
  return images[0];
};
