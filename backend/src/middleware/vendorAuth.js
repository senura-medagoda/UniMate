import jwt from "jsonwebtoken";
import VendorModel from "../models/VendorModel.js";

export const vendorAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const vendor = await VendorModel.findById(decoded.vendorId).select('-password');

        if (!vendor) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Vendor not found."
            });
        }

        if (!vendor.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        req.vendorId = vendor._id;
        req.vendor = vendor;
        next();

    } catch (error) {
        console.error("Vendor auth error:", error);
        
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


export const optionalVendorAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const vendor = await VendorModel.findById(decoded.vendorId).select('-password');

        if (vendor && vendor.isActive) {
            req.vendorId = vendor._id;
            req.vendor = vendor;
        }

        next();

    } catch (error) {
        
        next();
    }
};


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
        
       
        if (!decoded.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        req.adminId = decoded.adminId;
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

