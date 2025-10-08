// Upload image through backend API instead of direct Cloudinary upload
export const uploadImageToCloudinary = async (file, uploadEndpoint = '/api/upload/image') => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${uploadEndpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.secure_url || data.url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};
