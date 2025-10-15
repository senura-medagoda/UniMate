import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdminModel from './src/models/AdminModel.js';

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unimate');
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({ email: 'admin@fooddelivery.com' });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new AdminModel({
            username: 'admin',
            email: 'admin@fooddelivery.com',
            password: 'admin123',
            fullName: 'System Administrator',
            role: 'super_admin',
            permissions: [
                'manage_vendors',
                'manage_shops',
                'manage_orders',
                'view_analytics',
                'manage_categories',
                'manage_promotions',
                'manage_users',
                'system_settings'
            ],
            isActive: true,
            department: 'Food Delivery'
        });

        console.log('Creating admin with data:', {
            username: admin.username,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions
        });

        await admin.save();
        console.log('Admin user created successfully:', admin.email);
        process.exit(0);

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
