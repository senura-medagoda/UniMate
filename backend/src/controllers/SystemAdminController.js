import SystemAdmin from "../models/SystemAdmin.js";
import bcrypt from "bcryptjs";

export async function addSA(req, res) {
    try {
        const { sa_fname, sa_lname, sa_email, sa_password, sa_NIC, sa_phone } = req.body;

        // Input validation
        if (!sa_fname || !sa_lname || !sa_email || !sa_password) {
            return res.status(400).json({ 
                message: "Missing required fields: sa_fname, sa_lname, sa_email, and sa_password are required" 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sa_email)) {
            return res.status(400).json({ 
                message: "Please provide a valid email address" 
            });
        }

        // Password validation
        if (sa_password.length < 6) {
            return res.status(400).json({ 
                message: "Password must be at least 6 characters long" 
            });
        }

        // Check if email already exists
        const existingAdmin = await SystemAdmin.findOne({ sa_email });
        if (existingAdmin) {
            return res.status(409).json({ 
                message: "System admin with this email already exists" 
            });
        }

        // Create new system admin (password will be hashed by pre-save hook)
        const newSysAd = new SystemAdmin({
            sa_fname,
            sa_lname,
            sa_email,
            sa_password, // Will be hashed by pre-save hook
            sa_NIC,
            sa_phone
        });

        await newSysAd.save();
        
        res.status(201).json({
            message: "New System admin added successfully!",
            data: {
                id: newSysAd._id,
                sa_fname: newSysAd.sa_fname,
                sa_lname: newSysAd.sa_lname,
                sa_email: newSysAd.sa_email,
                sa_vstatus: newSysAd.sa_vstatus,
                isActive: newSysAd.isActive
            }
        });

    } catch (error) {
        console.error("Error in addSA:", error);
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Validation error", 
                errors 
            });
        }
        
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
}