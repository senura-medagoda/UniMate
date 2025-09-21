import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        // Check if Cloudinary credentials are properly set
        if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
            console.error('⚠️  Cloudinary credentials are missing!');
            console.error('Please check your .env file contains:');
            console.error('CLOUDINARY_NAME=your_cloud_name');
            console.error('CLOUDINARY_API_KEY=your_api_key');
            console.error('CLOUDINARY_SECRET_KEY=your_secret_key');
            console.error('');
            console.error('📝 To get Cloudinary credentials:');
            console.error('1. Go to https://cloudinary.com/');
            console.error('2. Sign up for a free account');
            console.error('3. Go to Dashboard and copy your credentials');
            console.error('4. Add them to your .env file');
            console.error('');
            console.error('🔄 Image uploads will be disabled until Cloudinary is configured.');
            return false;
        }

        if (process.env.CLOUDINARY_NAME === 'demo' || process.env.CLOUDINARY_API_KEY === 'demo_key') {
            console.error('⚠️  Demo Cloudinary credentials detected!');
            console.error('Please replace demo values with real Cloudinary credentials in your .env file');
            console.error('🔄 Image uploads will be disabled until real credentials are provided.');
            return false;
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
            secure: true
        });
        
        // Test Cloudinary connection
        try {
            const result = await cloudinary.api.ping();
            console.log('✅ Cloudinary connected successfully!');
            return true;
        } catch (pingError) {
            console.error('❌ Cloudinary ping failed:', pingError.message);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Cloudinary configuration error:', error.message);
        console.error('🔧 Please check your Cloudinary credentials and try again');
        console.error('📝 Make sure your .env file has the correct values:');
        console.error('   CLOUDINARY_NAME=your_actual_cloud_name');
        console.error('   CLOUDINARY_API_KEY=your_actual_api_key');
        console.error('   CLOUDINARY_SECRET_KEY=your_actual_secret_key');
        return false;
    }
}


export default connectCloudinary;


