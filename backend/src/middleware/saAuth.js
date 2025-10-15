import jwt from "jsonwebtoken";
import SystemAdmin from "../models/SystemAdmin.js";

export const saAuth = async (req, res, next) => {
    try {
        console.log('=== SA AUTH MIDDLEWARE ===');
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Decoded token:', decoded);
        
        console.log('Looking up SystemAdmin with ID:', decoded.saId);
        const sa = await SystemAdmin.findById(decoded.saId).select('-sa_password');
        console.log('Found SystemAdmin:', sa ? 'Yes' : 'No');

        if (!sa) {
            console.log('SystemAdmin not found in database');
            return res.status(401).json({
                success: false,
                message: "Invalid token. System Admin not found."
            });
        }

        if (!sa.isActive) {
            console.log('SystemAdmin account is deactivated');
            return res.status(401).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        req.saId = sa._id.toString();
        req.sa = sa;
        console.log('SA Auth: Setting req.saId to:', req.saId);
        console.log('SA Auth: SA email:', sa.sa_email);
        console.log('=== SA AUTH SUCCESS ===');
        next();

    } catch (error) {
        console.error('SA Auth Error:', error);
        
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

        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication."
        });
    }
};

