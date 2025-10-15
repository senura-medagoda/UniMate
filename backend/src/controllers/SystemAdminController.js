import SystemAdmin from "../models/SystemAdmin.js";
import Student from "../models/Student.js";
import { User } from "../models/User.js";
import AdminModel from "../models/AdminModel.js";
import JPAdmin from "../models/JPAdmin.js";
import HiringManager from "../models/HiringManager.js";
import { StudyMaterial } from "../models/StudyMaterial.js";
import { ForumPost } from "../models/ForumPost.js";
import { Complaint } from "../models/Complaint.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

// @desc Get system admin dashboard statistics
export async function getSystemAdminDashboardStats(req, res) {
    try {
        // Get student statistics
        const totalStudents = await Student.countDocuments();
        const verifiedStudents = await Student.countDocuments({ s_status: 'Verified' });
        const pendingStudents = await Student.countDocuments({ s_status: 'Unverified' });
        const rejectedStudents = await Student.countDocuments({ s_status: 'Rejected' });

        // Get admin statistics
        const totalSystemAdmins = await SystemAdmin.countDocuments();
        const activeSystemAdmins = await SystemAdmin.countDocuments({ isActive: true });
        const totalFoodAdmins = await AdminModel.countDocuments();
        const activeFoodAdmins = await AdminModel.countDocuments({ isActive: true });
        const totalJPAdmins = await JPAdmin.countDocuments();
        const activeJPAdmins = await JPAdmin.countDocuments({ jpa_status: 'Active' });

        // Get hiring manager statistics
        const totalHiringManagers = await HiringManager.countDocuments();
        const verifiedHiringManagers = await HiringManager.countDocuments({ hm_status: 'Verified' });
        const pendingHiringManagers = await HiringManager.countDocuments({ hm_status: 'Unverified' });

        // Get content statistics
        const totalStudyMaterials = await StudyMaterial.countDocuments();
        const totalForumPosts = await ForumPost.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalJobApplications = await JobApplication.countDocuments();
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

        // Get recent activity (last 10 activities)
        const recentStudents = await Student.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('s_fname s_lname s_email s_status updatedAt');

        const recentHiringManagers = await HiringManager.find()
            .sort({ updatedAt: -1 })
            .limit(3)
            .select('hm_fname hm_lname hm_email hm_status updatedAt');

        const recentJobs = await Job.find()
            .populate('postedby', 'hm_fname hm_lname')
            .sort({ updatedAt: -1 })
            .limit(2)
            .select('title status updatedAt postedby');

        // Format recent activity
        const recentActivity = [];
        
        // Add recent student activities
        recentStudents.forEach(student => {
            recentActivity.push({
                id: student._id,
                action: `Student ${student.s_status}`,
                target: `${student.s_fname} ${student.s_lname} (${student.s_email})`,
                user: 'System',
                time: getTimeAgo(student.updatedAt),
                updatedAt: student.updatedAt,
                status: student.s_status === 'Verified' ? 'success' : 
                       student.s_status === 'Rejected' ? 'error' : 'warning',
                type: 'student'
            });
        });

        // Add recent hiring manager activities
        recentHiringManagers.forEach(hm => {
            recentActivity.push({
                id: hm._id,
                action: `Hiring Manager ${hm.hm_status}`,
                target: `${hm.hm_fname} ${hm.hm_lname} (${hm.hm_email})`,
                user: 'System',
                time: getTimeAgo(hm.updatedAt),
                updatedAt: hm.updatedAt,
                status: hm.hm_status === 'Verified' ? 'success' : 
                       hm.hm_status === 'Rejected' ? 'error' : 'warning',
                type: 'hiring_manager'
            });
        });

        // Add recent job activities
        recentJobs.forEach(job => {
            recentActivity.push({
                id: job._id,
                action: `Job ${job.status}`,
                target: `${job.title} by ${job.postedby?.hm_fname} ${job.postedby?.hm_lname}`,
                user: 'System',
                time: getTimeAgo(job.updatedAt),
                updatedAt: job.updatedAt,
                status: job.status === 'live' ? 'success' : 
                       job.status === 'rejected' ? 'error' : 'info',
                type: 'job'
            });
        });

        // Sort by updatedAt (most recent first) and take first 10
        recentActivity.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const sortedRecentActivity = recentActivity.slice(0, 10);

        // Calculate system health (based on various factors)
        const systemHealth = calculateSystemHealth({
            totalStudents,
            pendingStudents,
            totalComplaints,
            pendingComplaints,
            totalJobs,
            totalStudyMaterials
        });

        res.json({
            success: true,
            data: {
                stats: {
                    totalStudents,
                    pendingVerifications: pendingStudents,
                    verifiedStudents,
                    rejectedStudents,
                    totalAdmins: totalSystemAdmins + totalFoodAdmins + totalJPAdmins,
                    activeAdmins: activeSystemAdmins + activeFoodAdmins + activeJPAdmins,
                    totalHiringManagers,
                    verifiedHiringManagers,
                    pendingHiringManagers,
                    totalStudyMaterials,
                    totalForumPosts,
                    totalJobs,
                    totalJobApplications,
                    totalComplaints,
                    pendingComplaints,
                    systemHealth
                },
                recentActivity: sortedRecentActivity
            }
        });

    } catch (error) {
        console.error("Error in getSystemAdminDashboardStats:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

// Helper function to calculate system health
function calculateSystemHealth(data) {
    const {
        totalStudents,
        pendingStudents,
        totalComplaints,
        pendingComplaints,
        totalJobs,
        totalStudyMaterials
    } = data;

    let healthScore = 100;

    // Deduct points for high pending verifications
    if (totalStudents > 0) {
        const pendingRatio = pendingStudents / totalStudents;
        if (pendingRatio > 0.1) healthScore -= 10; // More than 10% pending
        if (pendingRatio > 0.2) healthScore -= 15; // More than 20% pending
    }

    // Deduct points for high pending complaints
    if (totalComplaints > 0) {
        const complaintRatio = pendingComplaints / totalComplaints;
        if (complaintRatio > 0.3) healthScore -= 5; // More than 30% pending
        if (complaintRatio > 0.5) healthScore -= 10; // More than 50% pending
    }

    // Bonus points for good content activity
    if (totalStudyMaterials > 100) healthScore += 2;
    if (totalJobs > 50) healthScore += 2;

    return Math.max(0, Math.min(100, healthScore));
}

// @desc Get current System Admin profile (authenticated user)
export async function getCurrentSAProfile(req, res) {
    try {
        const saId = req.saId; // From authentication middleware

        const sa = await SystemAdmin.findById(saId).select('-sa_password');
        if (!sa) {
            return res.status(404).json({
                success: false,
                message: 'System Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                sa: {
                    id: sa._id,
                    firstName: sa.sa_fname,
                    lastName: sa.sa_lname,
                    name: `${sa.sa_fname} ${sa.sa_lname}`,
                    email: sa.sa_email,
                    phone: sa.sa_phone,
                    nic: sa.sa_NIC,
                    status: sa.sa_vstatus,
                    isActive: sa.isActive,
                    lastLogin: sa.lastLogin,
                    createdAt: sa.createdAt,
                    updatedAt: sa.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Get current SA profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

// @desc System Admin Login
export async function loginSA(req, res) {
    try {
        const { email, password, adminId } = req.body;

        // Input validation - accept either email or adminId
        if ((!email && !adminId) || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email/Admin ID and password are required" 
            });
        }

        // Find system admin by email or adminId (for backward compatibility)
        let sa;
        if (email) {
            sa = await SystemAdmin.findOne({ sa_email: email });
        } else if (adminId) {
            // Try to find by adminId (could be email or a different field)
            sa = await SystemAdmin.findOne({ 
                $or: [
                    { sa_email: adminId },
                    { sa_fname: { $regex: adminId, $options: 'i' } },
                    { sa_lname: { $regex: adminId, $options: 'i' } }
                ]
            });
        }

        if (!sa) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Check if admin is active
        if (!sa.isActive) {
            return res.status(401).json({ 
                success: false,
                message: "Account is deactivated" 
            });
        }

        // Verify password
        const isPasswordValid = await sa.correctPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Update last login
        sa.lastLogin = new Date();
        await sa.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                saId: sa._id, 
                saEmail: sa.sa_email,
                role: 'system_admin'
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return success response
        res.json({
            success: true,
            message: "Login successful",
            token,
            sa: {
                id: sa._id,
                sa_fname: sa.sa_fname,
                sa_lname: sa.sa_lname,
                sa_email: sa.sa_email,
                sa_vstatus: sa.sa_vstatus,
                isActive: sa.isActive,
                lastLogin: sa.lastLogin
            }
        });

    } catch (error) {
        console.error("Error in loginSA:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}