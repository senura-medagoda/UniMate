import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js";

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's an admin token
        if (!decoded.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const admin = await AdminModel.findById(decoded.adminId).select('-password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Admin not found."
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        req.adminId = admin._id;
        req.admin = admin;
        next();

    } catch (error) {
        console.error("Admin auth error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired."
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Check specific permissions
export const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        // Super admin has all permissions
        if (req.admin.role === 'super_admin') {
            return next();
        }

        // Check if admin has the required permission
        if (!req.admin.permissions.includes(permission)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required permission: ${permission}`
            });
        }

        next();
    };
};

// Check if admin can manage vendors
export const canManageVendors = checkPermission('manage_vendors');

// Check if admin can manage shops
export const canManageShops = checkPermission('manage_shops');

// Check if admin can view analytics
export const canViewAnalytics = checkPermission('view_analytics');


