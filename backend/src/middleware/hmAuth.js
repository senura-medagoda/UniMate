import jwt from "jsonwebtoken";
import HiringManager from "../models/HiringManager.js";

export const hmAuth = async (req, res, next) => {
    try {
        console.log('=== HM AUTH MIDDLEWARE ===');
        console.log('Request URL:', req.url);
        console.log('Request method:', req.method);
        console.log('Authorization header:', req.header('Authorization'));
        
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        console.log('Verifying JWT token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        console.log('Looking up HM with ID:', decoded.id);
        const hm = await HiringManager.findById(decoded.id).select('-hm_password');
        console.log('Found HM:', hm ? 'Yes' : 'No');

        if (!hm) {
            console.log('HM not found in database');
            return res.status(401).json({
                success: false,
                message: "Invalid token. Hiring Manager not found."
            });
        }

        if (hm.hm_status === 'Banned' || hm.hm_status === 'Suspended') {
            console.log('HM account is deactivated:', hm.hm_status);
            return res.status(401).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        req.hmId = hm._id.toString(); // Convert to string to match Job model
        req.hm = hm;
        console.log('HM Auth: Setting req.hmId to:', req.hmId);
        console.log('HM Auth: HM email:', hm.hm_email);
        console.log('=== HM AUTH SUCCESS ===');
        next();

    } catch (error) {
        console.error("Hiring Manager auth error:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        
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

