import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.log('⚠️ Missing Cloudinary credentials!');
      return false;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    try {
      const result = await cloudinary.api.ping();
      console.log('✅ Cloudinary connected successfully!', result.status);
      return true;
    } catch (pingError) {
      console.error('❌ Cloudinary ping failed:', pingError.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Cloudinary configuration error:', error.message);
    return false;
  }
};

export default connectCloudinary;
