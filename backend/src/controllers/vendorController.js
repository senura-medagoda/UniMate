import VendorModel from "../models/VendorModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { createAdminNotification } from "../services/notificationService.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../services/emailService.js";

// Generate JWT Token
const generateToken = (vendorId) => {
    return jwt.sign({ vendorId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Vendor Registration
export const registerVendor = async (req, res) => {
    try {
        const {
            businessName = "",
            ownerName,
            email,
            phone,
            password,
            businessLicense = "",
            address
        } = req.body;

        
        // Check for existing vendor by email
        const existingVendor = await VendorModel.findOne({ email });

        if (existingVendor) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Check for existing vendor by business license only if provided
        if (businessLicense && businessLicense.trim() !== "") {
            const existingLicense = await VendorModel.findOne({ businessLicense });
            if (existingLicense) {
                return res.status(400).json({
                    success: false,
                    message: "Business license already registered"
                });
            }
        }

        // Prepare vendor data - set businessLicense to null if empty
        const vendorData = {
            businessName,
            ownerName,
            email,
            phone,
            password,
            businessLicense: businessLicense && businessLicense.trim() !== "" ? businessLicense : null,
            address
        };

        const vendor = new VendorModel(vendorData);

        await vendor.save();

        // Send welcome email to vendor
        try {
            const emailResult = await sendWelcomeEmail(
                vendor.email, 
                vendor.businessName || vendor.ownerName
            );
            
            if (emailResult.success) {
                console.log(`Welcome email sent successfully to ${vendor.email}`);
            } else {
                console.error('Failed to send welcome email:', emailResult.error);
            }
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
        }

        // Send notification to admins about new vendor pending approval
        console.log('Sending notification for new vendor:', vendor.businessName);
        try {
            await createAdminNotification(
                'vendor_registered',
                'New Vendor Registration',
                `A new vendor "${vendor.businessName}" has registered and is waiting for approval.`,
                {
                    vendorId: vendor._id,
                    businessName: vendor.businessName,
                    ownerName: vendor.ownerName,
                    email: vendor.email,
                    createdAt: vendor.createdAt
                },
                'high',
                `/admin/vendors?status=pending`
            );
            console.log('Vendor notification sent successfully');
        } catch (notificationError) {
            console.error('Error sending vendor notification:', notificationError);
            // Don't fail the vendor registration if notification fails
        }

        const token = generateToken(vendor._id);

        res.status(201).json({
            success: true,
            message: "Vendor registered successfully and is pending approval",
            data: {
                vendor: vendor.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error("Vendor registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Vendor Login
export const loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const vendor = await VendorModel.findOne({ email });

        if (!vendor) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        
        if (!vendor.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated"
            });
        }

        
        const isPasswordValid = await vendor.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

       
        const token = generateToken(vendor._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                vendor: vendor.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error("Vendor login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Get Vendor Profile
export const getVendorProfile = async (req, res) => {
    try {
        const vendor = await VendorModel.findById(req.vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.status(200).json({
            success: true,
            data: vendor.getPublicProfile()
        });

    } catch (error) {
        console.error("Get vendor profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const vendor = await VendorModel.findOne({ email });

        if (!vendor) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({
                success: true,
                message: "If an account with that email exists, we've sent password reset instructions."
            });
        }

        // Generate a secure reset token
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Store reset token and expiry (24 hours from now)
        vendor.resetPasswordToken = resetToken;
        vendor.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await vendor.save();

        // Send password reset email
        try {
            const emailResult = await sendPasswordResetEmail(
                email, 
                resetToken, 
                vendor.businessName || vendor.ownerName
            );
            
            if (emailResult.success) {
                console.log(`Password reset email sent successfully to ${email}`);
            } else {
                console.error('Failed to send password reset email:', emailResult.error);
                // Still return success to user, but log the error
            }
        } catch (emailError) {
            console.error('Error sending password reset email:', emailError);
            // Still return success to user, but log the error
        }

        res.status(200).json({
            success: true,
            message: "If an account with that email exists, we've sent password reset instructions."
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const vendor = await VendorModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Update password
        vendor.password = password;
        vendor.resetPasswordToken = undefined;
        vendor.resetPasswordExpires = undefined;
        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Update Vendor Profile
export const updateVendorProfile = async (req, res) => {
    try {
        const updates = req.body;
        const vendorId = req.vendorId;

        
        delete updates.password;
        delete updates.email;
        delete updates.businessLicense;
        delete updates.isVerified;

        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'vendor-profiles',
                width: 300,
                crop: "scale"
            });
            updates.profileImage = result.secure_url;
        }

        const vendor = await VendorModel.findByIdAndUpdate(
            vendorId,
            updates,
            { new: true, runValidators: true }
        );

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: vendor.getPublicProfile()
        });

    } catch (error) {
        console.error("Update vendor profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//// Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const vendorId = req.vendorId;

        const vendor = await VendorModel.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        
        const isCurrentPasswordValid = await vendor.comparePassword(currentPassword);

        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

       
        vendor.password = newPassword;
        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/// Get All Vendor
export const getAllVendors = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { businessName: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.isActive = status === 'active';
        }

        const vendors = await VendorModel.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await VendorModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                vendors,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
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

/// Toggle Vendor Status (Admin only)
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

/// Approve Vendor (Admin only)
export const approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const adminId = req.adminId; // From adminAuth middleware

        const vendor = await VendorModel.findByIdAndUpdate(
            vendorId,
            {
                isApproved: true,
                approvalStatus: 'approved',
                approvedAt: new Date(),
                approvedBy: adminId,
                rejectionReason: '' // Clear any previous rejection reason
            },
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        // Send notification to vendor about approval
        try {
            await createAdminNotification(
                'vendor_approved',
                'Vendor Account Approved',
                `Your vendor account "${vendor.businessName || vendor.ownerName}" has been approved and you can now start using the platform.`,
                {
                    vendorId: vendor._id,
                    businessName: vendor.businessName,
                    ownerName: vendor.ownerName,
                    email: vendor.email,
                    approvedAt: vendor.approvedAt
                },
                'high',
                `/vendor/dashboard`
            );
            console.log('Vendor approval notification sent successfully');
        } catch (notificationError) {
            console.error('Error sending vendor approval notification:', notificationError);
            // Don't fail the approval if notification fails
        }

        res.status(200).json({
            success: true,
            message: "Vendor approved successfully",
            data: vendor.getPublicProfile()
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

/// Reject Vendor (Admin only)
export const rejectVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { rejectionReason } = req.body;
        const adminId = req.adminId; // From adminAuth middleware

        if (!rejectionReason || rejectionReason.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const vendor = await VendorModel.findByIdAndUpdate(
            vendorId,
            {
                isApproved: false,
                approvalStatus: 'rejected',
                rejectionReason: rejectionReason.trim(),
                approvedBy: adminId
            },
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        // Send notification to vendor about rejection
        try {
            await createAdminNotification(
                'vendor_rejected',
                'Vendor Account Rejected',
                `Your vendor account "${vendor.businessName || vendor.ownerName}" has been rejected. Reason: ${rejectionReason}`,
                {
                    vendorId: vendor._id,
                    businessName: vendor.businessName,
                    ownerName: vendor.ownerName,
                    email: vendor.email,
                    rejectionReason: rejectionReason,
                    rejectedAt: new Date()
                },
                'high',
                `/vendor/registration`
            );
            console.log('Vendor rejection notification sent successfully');
        } catch (notificationError) {
            console.error('Error sending vendor rejection notification:', notificationError);
            // Don't fail the rejection if notification fails
        }

        res.status(200).json({
            success: true,
            message: "Vendor rejected successfully",
            data: vendor.getPublicProfile()
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

/// Get Vendor by ID (Admin only)
export const getVendorById = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await VendorModel.findById(vendorId).select('-password');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.status(200).json({
            success: true,
            data: vendor
        });

    } catch (error) {
        console.error("Get vendor by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

