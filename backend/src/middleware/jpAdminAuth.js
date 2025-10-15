import jwt from "jsonwebtoken";
import JPAdmin from "../models/JPAdmin.js";

const JWT_SECRET = process.env.JWT_SECRET || 'pzUuguyJKW';

export const jpAdminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const jpAdmin = await JPAdmin.findById(decoded.id).select('-jpa_password');

        if (!jpAdmin) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. JP Admin not found."
            });
        }

        if (jpAdmin.jpa_status === 'Banned' || jpAdmin.jpa_status === 'Suspended') {
            return res.status(403).json({
                success: false,
                message: `Account is ${jpAdmin.jpa_status}. Access denied.`
            });
        }

        req.jpAdminId = jpAdmin._id;
        req.jpAdmin = jpAdmin; // Attach full JP Admin object
        next();

    } catch (error) {
        console.error("JP Admin auth error:", error);
        
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

