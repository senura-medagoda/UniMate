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
