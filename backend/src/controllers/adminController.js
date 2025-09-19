import AdminModel from "../models/AdminModel.js";
import VendorModel from "../models/VendorModel.js";
import ShopModel from "../models/ShopModel.js";
import jwt from "jsonwebtoken";
import { createAdminNotification } from "../services/notificationService.js";

// Generate JWT Token for admin
const generateAdminToken = (adminId, role) => {
    return jwt.sign({ adminId, role, isAdmin: true }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

// Admin Registration (Super Admin only)
export const registerAdmin = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            fullName,
            role = 'food_admin',
            permissions = [],
            phone,
            department = 'Food Delivery'
        } = req.body;

        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email or username already exists"
            });
        }

        const admin = new AdminModel({
            username,
            email,
            password,
            fullName,
            role,
            permissions,
            phone,
            department
        });

        await admin.save();

        const token = generateAdminToken(admin._id, admin.role);

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                admin: admin.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error("Admin registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await AdminModel.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated"
            });
        }

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

        const token = generateAdminToken(admin._id, admin.role);

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
        const admin = await AdminModel.findById(req.adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            data: admin.getPublicProfile()
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

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
    try {
        const { username, email, fullName, phone, department, permissions } = req.body;
        const adminId = req.adminId;

        // Check if admin exists
        const admin = await AdminModel.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // Check if email is already taken by another admin
        if (email && email !== admin.email) {
            const existingAdmin = await AdminModel.findOne({ email, _id: { $ne: adminId } });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already taken by another admin"
                });
            }
        }

        // Check if username is already taken by another admin
        if (username && username !== admin.username) {
            const existingAdmin = await AdminModel.findOne({ username, _id: { $ne: adminId } });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    message: "Username is already taken by another admin"
                });
            }
        }

        // Update admin profile
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (fullName) updateData.fullName = fullName;
        if (phone !== undefined) updateData.phone = phone;
        if (department) updateData.department = department;
        if (permissions) updateData.permissions = permissions;

        const updatedAdmin = await AdminModel.findByIdAndUpdate(
            adminId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedAdmin.getPublicProfile()
        });

    } catch (error) {
        console.error("Update admin profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalVendors,
            activeVendors,
            totalShops,
            activeShops,
            pendingVendors,
            recentVendors
        ] = await Promise.all([
            VendorModel.countDocuments(),
            VendorModel.countDocuments({ isActive: true }),
            ShopModel.countDocuments(),
            ShopModel.countDocuments({ isActive: true }),
            VendorModel.countDocuments({ approvalStatus: 'pending' }),
            VendorModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('businessName ownerName email createdAt approvalStatus isApproved')
        ]);

        // Get shop information for each recent vendor
        const recentVendorsWithShops = await Promise.all(
            recentVendors.map(async (vendor) => {
                const shops = await ShopModel.find({ vendorId: vendor._id })
                    .select('businessName address approvalStatus isApproved createdAt')
                    .sort({ createdAt: -1 })
                    .limit(1);
                
                return {
                    ...vendor.toObject(),
                    shops: shops
                };
            })
        );

        const stats = {
            vendors: {
                total: totalVendors,
                active: activeVendors,
                pending: pendingVendors,
                inactive: totalVendors - activeVendors
            },
            shops: {
                total: totalShops,
                active: activeShops,
                inactive: totalShops - activeShops
            },
            recentVendors: recentVendorsWithShops
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

// Get All Vendors (Admin)
export const getAllVendors = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { businessName: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            if (status === 'active') query.isActive = true;
            if (status === 'inactive') query.isActive = false;
            if (status === 'pending') query.approvalStatus = 'pending';
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const vendors = await VendorModel.find(query)
            .select('-password')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await VendorModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                vendors,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            }
        });

    } catch (error) {
        console.error("Get all vendors error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get All Shops (Admin)
export const getAllShops = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { businessName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            if (status === 'active') query.isActive = true;
            if (status === 'inactive') query.isActive = false;
            if (status === 'open') query.isOpen = true;
            if (status === 'closed') query.isOpen = false;
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const shops = await ShopModel.find(query)
            .populate('vendorId', 'businessName ownerName email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ShopModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                shops,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            }
        });

    } catch (error) {
        console.error("Get all shops error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Toggle Vendor Status
export const toggleVendorStatus = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { isActive } = req.body;

        const vendor = await VendorModel.findByIdAndUpdate(
            vendorId,
            { isActive },
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Vendor ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: vendor.getPublicProfile()
        });

    } catch (error) {
        console.error("Toggle vendor status error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Toggle Shop Status
export const toggleShopStatus = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { isActive } = req.body;

        const shop = await ShopModel.findByIdAndUpdate(
            shopId,
            { isActive },
            { new: true }
        ).populate('vendorId', 'businessName ownerName email');

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Shop ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: shop
        });

    } catch (error) {
        console.error("Toggle shop status error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Vendor Details
export const getVendorDetails = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await VendorModel.findById(vendorId).select('-password');
        const shops = await ShopModel.find({ vendorId }).select('-vendorId');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                vendor,
                shops
            }
        });

    } catch (error) {
        console.error("Get vendor details error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Shop Details
export const getShopDetails = async (req, res) => {
    try {
        const { shopId } = req.params;

        const shop = await ShopModel.findById(shopId)
            .populate('vendorId', 'businessName ownerName email phone');

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        res.status(200).json({
            success: true,
            data: shop
        });

    } catch (error) {
        console.error("Get shop details error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Approve Shop
export const approveShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const adminId = req.adminId;

        const shop = await ShopModel.findById(shopId).populate('vendorId', 'businessName ownerName email');

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        if (shop.approvalStatus === 'approved') {
            return res.status(400).json({
                success: false,
                message: "Shop is already approved"
            });
        }

        // Update shop approval status
        shop.isApproved = true;
        shop.approvalStatus = 'approved';
        shop.approvedAt = new Date();
        shop.approvedBy = adminId;
        await shop.save();

        // Send notification to other admins
        try {
            await createAdminNotification(
                'shop_approved',
                'Shop Approved',
                `Shop "${shop.businessName}" has been approved and is now live.`,
                {
                    shopId: shop._id,
                    shopName: shop.businessName,
                    vendorId: shop.vendorId._id,
                    approvedAt: shop.approvedAt
                },
                'medium',
                `/admin/shops/${shopId}`
            );
        } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
        }

        res.status(200).json({
            success: true,
            message: "Shop approved successfully",
            data: shop
        });

    } catch (error) {
        console.error("Approve shop error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Reject Shop
export const rejectShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { rejectionReason } = req.body;
        const adminId = req.adminId;

        const shop = await ShopModel.findById(shopId).populate('vendorId', 'businessName ownerName email');

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        if (shop.approvalStatus === 'rejected') {
            return res.status(400).json({
                success: false,
                message: "Shop is already rejected"
            });
        }

        // Update shop rejection status
        shop.isApproved = false;
        shop.approvalStatus = 'rejected';
        shop.rejectionReason = rejectionReason || 'No reason provided';
        shop.approvedBy = adminId;
        await shop.save();

        // Send notification to other admins
        try {
            await createAdminNotification(
                'shop_rejected',
                'Shop Rejected',
                `Shop "${shop.businessName}" has been rejected. Reason: ${shop.rejectionReason}`,
                {
                    shopId: shop._id,
                    shopName: shop.businessName,
                    vendorId: shop.vendorId._id,
                    rejectionReason: shop.rejectionReason,
                    rejectedAt: new Date()
                },
                'medium',
                `/admin/shops/${shopId}`
            );
        } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
        }

        res.status(200).json({
            success: true,
            message: "Shop rejected successfully",
            data: shop
        });

    } catch (error) {
        console.error("Reject shop error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Pending Shops
export const getPendingShops = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const shops = await ShopModel.find({ approvalStatus: 'pending' })
            .populate('vendorId', 'businessName ownerName email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ShopModel.countDocuments({ approvalStatus: 'pending' });

        res.status(200).json({
            success: true,
            data: {
                shops,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            }
        });

    } catch (error) {
        console.error("Get pending shops error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Approve Vendor
export const approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const adminId = req.adminId;

        const vendor = await VendorModel.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        if (vendor.approvalStatus === 'approved') {
            return res.status(400).json({
                success: false,
                message: "Vendor is already approved"
            });
        }

        // Update vendor approval status
        vendor.isApproved = true;
        vendor.approvalStatus = 'approved';
        vendor.approvedAt = new Date();
        vendor.approvedBy = adminId;
        await vendor.save();

        // Send notification to other admins
        try {
            await createAdminNotification(
                'vendor_approved',
                'Vendor Approved',
                `Vendor "${vendor.businessName}" has been approved and can now create shops.`,
                {
                    vendorId: vendor._id,
                    businessName: vendor.businessName,
                    ownerName: vendor.ownerName,
                    approvedAt: vendor.approvedAt
                },
                'medium',
                `/admin/vendors/${vendorId}`
            );
        } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
        }

        res.status(200).json({
            success: true,
            message: "Vendor approved successfully",
            data: vendor
        });

    } catch (error) {
        console.error("Approve vendor error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Reject Vendor
export const rejectVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { rejectionReason } = req.body;
        const adminId = req.adminId;

        const vendor = await VendorModel.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        if (vendor.approvalStatus === 'rejected') {
            return res.status(400).json({
                success: false,
                message: "Vendor is already rejected"
            });
        }

        // Update vendor rejection status
        vendor.isApproved = false;
        vendor.approvalStatus = 'rejected';
        vendor.rejectionReason = rejectionReason || 'No reason provided';
        vendor.approvedBy = adminId;
        await vendor.save();

        // Send notification to other admins
        try {
            await createAdminNotification(
                'vendor_rejected',
                'Vendor Rejected',
                `Vendor "${vendor.businessName}" has been rejected. Reason: ${vendor.rejectionReason}`,
                {
                    vendorId: vendor._id,
                    businessName: vendor.businessName,
                    ownerName: vendor.ownerName,
                    rejectionReason: vendor.rejectionReason,
                    rejectedAt: new Date()
                },
                'medium',
                `/admin/vendors/${vendorId}`
            );
        } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
        }

        res.status(200).json({
            success: true,
            message: "Vendor rejected successfully",
            data: vendor
        });

    } catch (error) {
        console.error("Reject vendor error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Pending Vendors
export const getPendingVendors = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const vendors = await VendorModel.find({ approvalStatus: 'pending' })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await VendorModel.countDocuments({ approvalStatus: 'pending' });

        res.status(200).json({
            success: true,
            data: {
                vendors,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            }
        });

    } catch (error) {
        console.error("Get pending vendors error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
