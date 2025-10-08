import AdminModel from '../models/AdminModel.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (adminId) => {
    return jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await AdminModel.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated"
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate token
        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                admin: admin.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await AdminModel.findById(req.adminId).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            data: admin
        });

    } catch (error) {
        console.error("Get admin profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        // Import models
        const VendorModel = (await import('../models/VendorModel.js')).default;
        const ShopModel = (await import('../models/ShopModel.js')).default;
        
        // Fetch real data from MongoDB
        const totalVendors = await VendorModel.countDocuments();
        const activeVendors = await VendorModel.countDocuments({ isActive: true });
        const approvedVendors = await VendorModel.countDocuments({ isApproved: true });
        const pendingVendors = await VendorModel.countDocuments({ approvalStatus: 'pending' });
        
        const totalShops = await ShopModel.countDocuments();
        const activeShops = await ShopModel.countDocuments({ isActive: true });
        const approvedShops = await ShopModel.countDocuments({ isApproved: true });
        const pendingShops = await ShopModel.countDocuments({ approvalStatus: 'pending' });
        
        // Get recent vendors (last 5)
        const recentVendors = await VendorModel.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent shops (last 5)
        const recentShops = await ShopModel.find()
            .populate('vendorId', 'businessName ownerName')
            .sort({ createdAt: -1 })
            .limit(5);

        const stats = {
            totalVendors,
            activeVendors,
            approvedVendors,
            pendingVendors,
            totalShops,
            activeShops,
            approvedShops,
            pendingShops,
            totalOrders: 0, // TODO: Add order model integration
            pendingOrders: 0,
            totalRevenue: 0, // TODO: Add revenue calculation
            recentVendors,
            recentShops
        };

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
