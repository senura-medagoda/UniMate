// SM - Study Material Admin Controller
import jwt from 'jsonwebtoken';

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Simple hardcoded admin credentials for Study Material admin
        const adminCredentials = {
            email: 'smadmin@unimate.com',
            password: 'smadmin123',
            name: 'Study Material Admin',
            role: 'study_material_admin'
        };

        if (email === adminCredentials.email && password === adminCredentials.password) {
            // Generate JWT token
            const token = jwt.sign(
                { 
                    adminId: 'sm_admin_001',
                    email: adminCredentials.email,
                    role: adminCredentials.role,
                    isAdmin: true
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
                admin: {
                    id: 'sm_admin_001',
                    name: adminCredentials.name,
                    email: adminCredentials.email,
                    role: adminCredentials.role
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Verify Admin Token
export const verifyAdmin = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        if (!decoded.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token is valid',
            admin: {
                id: decoded.adminId,
                email: decoded.email,
                role: decoded.role
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};
