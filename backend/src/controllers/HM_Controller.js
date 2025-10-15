import HiringManager from '../models/HiringManager.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'pzUuguyJKW';

// Register new Hiring Manager
export const registerHM = async (req, res) => {
    try {
        const {
            hm_fname,
            hm_lname,
            hm_email,
            hm_password,
            hm_company,
            hm_company_address,
            hm_workID,
            hm_NIC,
            hm_phone,
            department,
            position
        } = req.body;

        // Get uploaded proof document file
        const proofDocumentFile = req.file;

        // Validate required fields
        if (!hm_fname || !hm_lname || !hm_email || !hm_password || !hm_company || !hm_company_address || !hm_workID || !hm_phone) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Validate proof document
        if (!proofDocumentFile) {
            return res.status(400).json({
                success: false,
                message: 'Proof document (Service letter) is required'
            });
        }

        // Check if hiring manager already exists
        const existingHM = await HiringManager.findOne({
            $or: [
                { hm_email: hm_email },
                { hm_workID: hm_workID }
            ]
        });

        if (existingHM) {
            return res.status(400).json({
                success: false,
                message: existingHM.hm_email === hm_email 
                    ? 'Hiring Manager with this email already exists' 
                    : 'Hiring Manager with this Work ID already exists'
            });
        }

        // Create new hiring manager
        const newHM = new HiringManager({
            hm_fname,
            hm_lname,
            hm_email,
            hm_password,
            hm_company,
            hm_company_address,
            hm_workID,
            hm_NIC,
            hm_phone,
            department,
            position,
            proof_document: proofDocumentFile.filename,
            proof_document_original_name: proofDocumentFile.originalname
        });

        await newHM.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: newHM._id, 
                email: newHM.hm_email,
                role: 'hiring_manager'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Hiring Manager registered successfully',
            data: {
                token,
                hm: {
                    id: newHM._id,
                    name: `${newHM.hm_fname} ${newHM.hm_lname}`,
                    email: newHM.hm_email,
                    company: newHM.hm_company,
                    workID: newHM.hm_workID,
                    status: newHM.hm_status
                }
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Login Hiring Manager
export const loginHM = async (req, res) => {
    try {
        const { hm_email, hm_password } = req.body;

        // Find hiring manager by email
        const hm = await HiringManager.findOne({ hm_email });
        if (!hm) {
            return res.status(404).json({
                success: false,
                message: 'Hiring Manager not found'
            });
        }

        // Check if account is active
        if (hm.hm_status === 'Banned') {
            return res.status(403).json({
                success: false,
                message: 'Account has been banned'
            });
        }

        if (hm.hm_status === 'Suspended') {
            return res.status(403).json({
                success: false,
                message: 'Account has been suspended'
            });
        }

        // Check password
        const isPasswordValid = await hm.correctPassword(hm_password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update login information
        hm.lastLogin = new Date();
        hm.loginCount += 1;
        await hm.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: hm._id, 
                email: hm.hm_email,
                role: 'hiring_manager'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                hm: {
                    id: hm._id,
                    firstName: hm.hm_fname,
                    lastName: hm.hm_lname,
                    name: `${hm.hm_fname} ${hm.hm_lname}`,
                    email: hm.hm_email,
                    company: hm.hm_company,
                    workID: hm.hm_workID,
                    status: hm.hm_status,
                    lastLogin: hm.lastLogin
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Helper function to archive expired jobs
async function archiveExpiredJobs() {
    try {
        const Job = (await import('../models/Job.js')).default;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const result = await Job.updateMany(
            { 
                deadline: { $lt: today },
                status: { $in: ['pending', 'live'] }
            },
            { 
                status: 'archived' 
            }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`Archived ${result.modifiedCount} expired jobs`);
        }
        
        return result.modifiedCount;
    } catch (error) {
        console.error('Error archiving expired jobs:', error);
        return 0;
    }
}

// Get Hiring Manager dashboard statistics
export const getHMDashboardStats = async (req, res) => {
    try {
        const hmId = req.hmId; // From authentication middleware
        const hmEmail = req.hm.hm_email;

        // Import models
        const Job = (await import('../models/Job.js')).default;
        const JobApplication = (await import('../models/JobApplication.js')).default;
        
        // First, archive any expired jobs
        await archiveExpiredJobs();
        
        // Get job statistics for this hiring manager
        const totalJobs = await Job.countDocuments({ postedby: hmEmail });
        const activeJobs = await Job.countDocuments({ postedby: hmEmail, status: 'live' });
        const pendingJobs = await Job.countDocuments({ postedby: hmEmail, status: 'pending' });
        
        // Get all jobs posted by this hiring manager to calculate applicant stats
        const hmJobs = await Job.find({ postedby: hmEmail }).select('_id');
        const jobIds = hmJobs.map(job => job._id);
        
        // Get applicant statistics
        const totalApplicants = await JobApplication.countDocuments({ 
            jobId: { $in: jobIds } 
        });
        
        // Get new applicants from the last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newApplicants = await JobApplication.countDocuments({ 
            jobId: { $in: jobIds },
            appliedAt: { $gte: oneWeekAgo }
        });
        
        // Get recent jobs (last 5)
        const recentJobs = await Job.find({ postedby: hmEmail })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title status createdAt deadline');

        // Get recent applications (last 5)
        const recentApplications = await JobApplication.find({ 
            jobId: { $in: jobIds } 
        })
        .populate('jobId', 'title')
        .sort({ appliedAt: -1 })
        .limit(5)
        .select('studentName studentEmail appliedAt status jobId');

        const stats = {
            totalJobs,
            activeJobs,
            pendingJobs,
            totalApplicants,
            newApplicants,
            recentJobs,
            recentApplications
        };

        res.status(200).json({
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: stats
        });

    } catch (error) {
        console.error('Get HM dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve dashboard statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get current Hiring Manager profile (authenticated user)
export const getCurrentHMProfile = async (req, res) => {
    try {
        const hmId = req.hmId; // From authentication middleware

        const hm = await HiringManager.findById(hmId).select('-hm_password');
        if (!hm) {
            return res.status(404).json({
                success: false,
                message: 'Hiring Manager not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                hm: {
                    id: hm._id,
                    firstName: hm.hm_fname,
                    lastName: hm.hm_lname,
                    email: hm.hm_email,
                    company: hm.hm_company,
                    workID: hm.hm_workID,
                    nic: hm.hm_NIC,
                    phone: hm.hm_phone,
                    status: hm.hm_status,
                    department: hm.department,
                    position: hm.position,
                    bio: hm.bio,
                    linkedin: hm.linkedin,
                    profilePicture: hm.profilePicture,
                    lastLogin: hm.lastLogin,
                    loginCount: hm.loginCount,
                    createdAt: hm.createdAt,
                    updatedAt: hm.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Get current HM profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update current Hiring Manager profile (authenticated user)
export const updateCurrentHMProfile = async (req, res) => {
    try {
        const hmId = req.hmId; // From authentication middleware
        const { bio, linkedin } = req.body;

        // Only allow updating bio and linkedin fields
        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (linkedin !== undefined) updateData.linkedin = linkedin;

        // Check if hiring manager exists
        const existingHM = await HiringManager.findById(hmId);
        if (!existingHM) {
            return res.status(404).json({
                success: false,
                message: 'Hiring Manager not found'
            });
        }

        // Update the hiring manager
        const updatedHM = await HiringManager.findByIdAndUpdate(
            hmId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-hm_password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                hm: {
                    id: updatedHM._id,
                    firstName: updatedHM.hm_fname,
                    lastName: updatedHM.hm_lname,
                    email: updatedHM.hm_email,
                    company: updatedHM.hm_company,
                    workID: updatedHM.hm_workID,
                    nic: updatedHM.hm_NIC,
                    phone: updatedHM.hm_phone,
                    status: updatedHM.hm_status,
                    department: updatedHM.department,
                    position: updatedHM.position,
                    bio: updatedHM.bio,
                    linkedin: updatedHM.linkedin,
                    profilePicture: updatedHM.profilePicture,
                    lastLogin: updatedHM.lastLogin,
                    loginCount: updatedHM.loginCount,
                    updatedAt: updatedHM.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Update current HM profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get Hiring Manager profile statistics
export const getHMProfileStats = async (req, res) => {
    try {
        const hmId = req.hmId; // From authentication middleware
        const hmEmail = req.hm.hm_email;

        // Import models
        const Job = (await import('../models/Job.js')).default;
        const JobApplication = (await import('../models/JobApplication.js')).default;
        
        // Get job statistics for this hiring manager
        const totalJobs = await Job.countDocuments({ postedby: hmEmail });
        const activeJobs = await Job.countDocuments({ postedby: hmEmail, status: 'live' });
        
        // Get all jobs posted by this hiring manager to calculate applicant stats
        const hmJobs = await Job.find({ postedby: hmEmail }).select('_id');
        const jobIds = hmJobs.map(job => job._id);
        
        // Get applicant statistics
        const totalApplicants = await JobApplication.countDocuments({ 
            jobId: { $in: jobIds } 
        });
        
        // Get hired/approved applicants
        const hiredApplicants = await JobApplication.countDocuments({ 
            jobId: { $in: jobIds },
            status: 'hired'
        });
        
        // Calculate hiring rate
        const hiringRate = totalApplicants > 0 ? Math.round((hiredApplicants / totalApplicants) * 100) : 0;

        const stats = {
            jobsPosted: totalJobs,
            applicantsReviewed: totalApplicants,
            hiringRate: `${hiringRate}%`,
            activePositions: activeJobs
        };

        res.status(200).json({
            success: true,
            message: 'Profile statistics retrieved successfully',
            data: stats
        });

    } catch (error) {
        console.error('Get HM profile stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get specific Hiring Manager details
export const getHMDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const hm = await HiringManager.findById(id).select('-hm_password');
        if (!hm) {
            return res.status(404).json({
                success: false,
                message: 'Hiring Manager not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Hiring Manager details retrieved successfully',
            data: {
                hm: {
                    id: hm._id,
                    firstName: hm.hm_fname,
                    lastName: hm.hm_lname,
                    email: hm.hm_email,
                    company: hm.hm_company,
                    workID: hm.hm_workID,
                    nic: hm.hm_NIC,
                    phone: hm.hm_phone,
                    status: hm.hm_status,
                    department: hm.department,
                    position: hm.position,
                    bio: hm.bio,
                    profilePicture: hm.profilePicture,
                    lastLogin: hm.lastLogin,
                    loginCount: hm.loginCount,
                    createdAt: hm.createdAt,
                    updatedAt: hm.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Get HM details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve Hiring Manager details',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update Hiring Manager details
export const updateHMDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.hm_password;
        delete updateData.hm_email; // Email should be updated through a separate process
        delete updateData.hm_workID; // Work ID should not be changed
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        // Check if hiring manager exists
        const existingHM = await HiringManager.findById(id);
        if (!existingHM) {
            return res.status(404).json({
                success: false,
                message: 'Hiring Manager not found'
            });
        }

        // Update the hiring manager
        const updatedHM = await HiringManager.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-hm_password');

        res.status(200).json({
            success: true,
            message: 'Hiring Manager details updated successfully',
            data: {
                hm: {
                    id: updatedHM._id,
                    firstName: updatedHM.hm_fname,
                    lastName: updatedHM.hm_lname,
                    email: updatedHM.hm_email,
                    company: updatedHM.hm_company,
                    workID: updatedHM.hm_workID,
                    nic: updatedHM.hm_NIC,
                    phone: updatedHM.hm_phone,
                    status: updatedHM.hm_status,
                    department: updatedHM.department,
                    position: updatedHM.position,
                    bio: updatedHM.bio,
                    profilePicture: updatedHM.profilePicture,
                    lastLogin: updatedHM.lastLogin,
                    loginCount: updatedHM.loginCount,
                    updatedAt: updatedHM.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Update HM details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update Hiring Manager details',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Delete Hiring Manager
export const deleteHM = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if hiring manager exists
        const existingHM = await HiringManager.findById(id);
        if (!existingHM) {
            return res.status(404).json({
                success: false,
                message: 'Hiring Manager not found'
            });
        }

        // Soft delete by changing status to 'Banned' instead of actually deleting
        // This preserves data integrity for related records
        await HiringManager.findByIdAndUpdate(id, {
            hm_status: 'Banned',
            bannedAt: new Date()
        });

        res.status(200).json({
            success: true,
            message: 'Hiring Manager account has been deactivated successfully'
        });

    } catch (error) {
        console.error('Delete HM error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete Hiring Manager',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all Hiring Managers (for admin purposes)
export const getAllHMs = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const skip = (page - 1) * limit;

        // Build query
        let query = {};
        if (status) {
            query.hm_status = status;
        }
        if (search) {
            query.$or = [
                { hm_fname: { $regex: search, $options: 'i' } },
                { hm_lname: { $regex: search, $options: 'i' } },
                { hm_email: { $regex: search, $options: 'i' } },
                { hm_company: { $regex: search, $options: 'i' } }
            ];
        }

        const hms = await HiringManager.find(query)
            .select('-hm_password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await HiringManager.countDocuments(query);

        res.status(200).json({
            success: true,
            message: 'Hiring Managers retrieved successfully',
            data: {
                hms,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalHMs: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get all HMs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve Hiring Managers',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const hm = await HiringManager.findById(id);
        if (!hm) {
            return res.status(404).json({
                success: false,
                message: 'Hiring Manager not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await hm.correctPassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        hm.hm_password = newPassword;
        await hm.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// JP Admin functions for HM management
export const getAllHMsForAdmin = async (req, res) => {
    try {
        console.log("Getting all hiring managers for JP Admin...");
        
        // Get all hiring managers
        const hms = await HiringManager.find({})
            .select('-hm_password') // Exclude password
            .sort({ createdAt: -1 }); // Sort by newest first
        
        console.log(`Found ${hms.length} hiring managers for JP Admin`);
        
        res.status(200).json({
            success: true,
            data: hms,
            count: hms.length
        });
    } catch (error) {
        console.error("Error in getAllHMsForAdmin controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const updateHMStatus = async (req, res) => {
    try {
        const { hmId } = req.params;
        const { status } = req.body;
        
        console.log(`Updating HM ${hmId} status to ${status}`);
        
        // Validate status
        const validStatuses = ['Unverified', 'Verified', 'Rejected', 'Suspended', 'Banned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: Unverified, Verified, Rejected, Suspended, Banned'
            });
        }
        
        const hm = await HiringManager.findByIdAndUpdate(
            hmId,
            { hm_status: status },
            { new: true, runValidators: true }
        ).select('-hm_password');
        
        if (!hm) {
            return res.status(404).json({
                success: false,
                message: 'Hiring Manager not found'
            });
        }
        
        console.log(`HM ${hmId} status updated to ${status}`);
        
        res.status(200).json({
            success: true,
            message: `Hiring Manager status updated to ${status}`,
            data: hm
        });
    } catch (error) {
        console.error("Error in updateHMStatus controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

