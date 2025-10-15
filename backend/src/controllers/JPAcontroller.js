import JPAdmin from '../models/JPAdmin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Job from '../models/Job.js';
import HiringManager from '../models/HiringManager.js';
import JobApplication from '../models/JobApplication.js';
import { generatePDFReport } from '../utils/pdfGenerator.js';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'pzUuguyJKW';

// Register new Job Portal Admin
export const registerJPAdmin = async (req, res) => {
    try {
        const {
            jpa_fname,
            jpa_lname,
            jpa_email,
            jpa_password,
            jpa_workID,
            jpa_phone,
            department,
            position,
            bio
        } = req.body;

        // Check if admin already exists
        const existingAdmin = await JPAdmin.findOne({
            $or: [
                { jpa_email: jpa_email },
                { jpa_workID: jpa_workID }
            ]
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: existingAdmin.jpa_email === jpa_email 
                    ? 'Job Portal Admin with this email already exists' 
                    : 'Job Portal Admin with this Work ID already exists'
            });
        }

        // Create new admin
        const newAdmin = new JPAdmin({
            jpa_fname,
            jpa_lname,
            jpa_email,
            jpa_password,
            jpa_workID,
            jpa_phone,
            department,
            position,
            bio
        });

        await newAdmin.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: newAdmin._id, 
                email: newAdmin.jpa_email,
                role: 'job_portal_admin'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Job Portal Admin registered successfully',
            data: {
                token,
                admin: {
                    id: newAdmin._id,
                    firstName: newAdmin.jpa_fname,
                    lastName: newAdmin.jpa_lname,
                    name: `${newAdmin.jpa_fname} ${newAdmin.jpa_lname}`,
                    email: newAdmin.jpa_email,
                    workID: newAdmin.jpa_workID,
                    status: newAdmin.jpa_status,
                    department: newAdmin.department,
                    position: newAdmin.position
                }
            }
        });

    } catch (error) {
        console.error('JP Admin Registration error:', error);
        
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

// Login Job Portal Admin
export const loginJPAdmin = async (req, res) => {
    try {
        const { jpa_email, jpa_password } = req.body;

        // Find admin by email
        const admin = await JPAdmin.findOne({ jpa_email });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Job Portal Admin not found'
            });
        }

        // Check if account is active
        if (admin.jpa_status === 'Banned') {
            return res.status(403).json({
                success: false,
                message: 'Account has been banned'
            });
        }

        if (admin.jpa_status === 'Suspended') {
            return res.status(403).json({
                success: false,
                message: 'Account has been suspended'
            });
        }

        if (admin.jpa_status === 'Inactive') {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive'
            });
        }

        // Check password
        const isPasswordValid = await admin.correctPassword(jpa_password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update login information
        admin.lastLogin = new Date();
        admin.loginCount += 1;
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin._id, 
                email: admin.jpa_email,
                role: 'job_portal_admin'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                admin: {
                    id: admin._id,
                    firstName: admin.jpa_fname,
                    lastName: admin.jpa_lname,
                    name: `${admin.jpa_fname} ${admin.jpa_lname}`,
                    email: admin.jpa_email,
                    workID: admin.jpa_workID,
                    status: admin.jpa_status,
                    department: admin.department,
                    position: admin.position,
                    lastLogin: admin.lastLogin
                }
            }
        });

    } catch (error) {
        console.error('JP Admin Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get current JP Admin profile (authenticated user)
export const getCurrentJPAdminProfile = async (req, res) => {
    try {
        const jpAdminId = req.jpAdminId; // From authentication middleware

        const jpAdmin = await JPAdmin.findById(jpAdminId).select('-jpa_password');
        if (!jpAdmin) {
            return res.status(404).json({
                success: false,
                message: 'JP Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                jpAdmin: {
                    id: jpAdmin._id,
                    firstName: jpAdmin.jpa_fname,
                    lastName: jpAdmin.jpa_lname,
                    name: `${jpAdmin.jpa_fname} ${jpAdmin.jpa_lname}`,
                    email: jpAdmin.jpa_email,
                    workID: jpAdmin.jpa_workID,
                    phone: jpAdmin.jpa_phone,
                    status: jpAdmin.jpa_status,
                    department: jpAdmin.department,
                    position: jpAdmin.position,
                    bio: jpAdmin.bio,
                    profilePicture: jpAdmin.profilePicture,
                    lastLogin: jpAdmin.lastLogin,
                    loginCount: jpAdmin.loginCount,
                    createdAt: jpAdmin.createdAt,
                    updatedAt: jpAdmin.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Get current JP Admin profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update current JP Admin profile (authenticated user)
export const updateCurrentJPAdminProfile = async (req, res) => {
    try {
        const jpAdminId = req.jpAdminId; // From authentication middleware
        const { jpa_phone, bio } = req.body;

        // Validate phone number if provided
        if (jpa_phone && !/^[0-9]{10}$/.test(jpa_phone)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be exactly 10 digits'
            });
        }

        // Validate bio length if provided
        if (bio && bio.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Bio cannot exceed 500 characters'
            });
        }

        // Find and update the JP Admin
        const jpAdmin = await JPAdmin.findById(jpAdminId);
        if (!jpAdmin) {
            return res.status(404).json({
                success: false,
                message: 'JP Admin not found'
            });
        }

        // Update only allowed fields
        if (jpa_phone !== undefined) {
            jpAdmin.jpa_phone = jpa_phone;
        }
        if (bio !== undefined) {
            jpAdmin.bio = bio;
        }

        await jpAdmin.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                jpAdmin: {
                    id: jpAdmin._id,
                    firstName: jpAdmin.jpa_fname,
                    lastName: jpAdmin.jpa_lname,
                    name: `${jpAdmin.jpa_fname} ${jpAdmin.jpa_lname}`,
                    email: jpAdmin.jpa_email,
                    workID: jpAdmin.jpa_workID,
                    phone: jpAdmin.jpa_phone,
                    status: jpAdmin.jpa_status,
                    department: jpAdmin.department,
                    position: jpAdmin.position,
                    bio: jpAdmin.bio,
                    profilePicture: jpAdmin.profilePicture,
                    lastLogin: jpAdmin.lastLogin,
                    loginCount: jpAdmin.loginCount,
                    createdAt: jpAdmin.createdAt,
                    updatedAt: jpAdmin.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Update current JP Admin profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get Reports Data
export const getReportsData = async (req, res) => {
    try {
        console.log('Reports endpoint called with period:', req.query.period);
        const { period = '30days' } = req.query;
        
        // Calculate date range based on period
        const now = new Date();
        let startDate;
        
        switch (period) {
            case '7days':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30days':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90days':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get job statistics
        console.log('Fetching job statistics...');
        const totalJobs = await Job.countDocuments();
        const jobsInPeriod = await Job.countDocuments({ createdAt: { $gte: startDate } });
        const liveJobs = await Job.countDocuments({ status: 'live' });
        const pendingJobs = await Job.countDocuments({ status: 'pending' });
        const rejectedJobs = await Job.countDocuments({ status: 'rejected' });
        console.log('Job stats:', { totalJobs, jobsInPeriod, liveJobs, pendingJobs, rejectedJobs });

        // Get manager statistics
        console.log('Fetching manager statistics...');
        const totalManagers = await HiringManager.countDocuments();
        const verifiedManagers = await HiringManager.countDocuments({ hm_status: 'Verified' });
        const unverifiedManagers = await HiringManager.countDocuments({ hm_status: 'Unverified' });
        const rejectedManagers = await HiringManager.countDocuments({ hm_status: 'Rejected' });
        console.log('Manager stats:', { totalManagers, verifiedManagers, unverifiedManagers, rejectedManagers });

        // Get application statistics
        console.log('Fetching application statistics...');
        const totalApplications = await JobApplication.countDocuments();
        const applicationsInPeriod = await JobApplication.countDocuments({ appliedAt: { $gte: startDate } });
        const pendingApplications = await JobApplication.countDocuments({ status: 'pending' });
        const shortlistedApplications = await JobApplication.countDocuments({ status: 'shortlisted' });
        const hiredApplications = await JobApplication.countDocuments({ status: 'hired' });
        const rejectedApplications = await JobApplication.countDocuments({ status: 'rejected' });
        console.log('Application stats:', { totalApplications, applicationsInPeriod, pendingApplications, shortlistedApplications, hiredApplications, rejectedApplications });

        // Calculate success rate
        const successRate = totalApplications > 0 ? Math.round((hiredApplications / totalApplications) * 100) : 0;

        // Get recent activity (last 10 activities)
        const recentJobs = await Job.find({ createdAt: { $gte: startDate } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title company status createdAt postedby');

        const recentManagers = await HiringManager.find({ createdAt: { $gte: startDate } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('hm_fname hm_lname hm_company hm_status createdAt');

        const recentApplications = await JobApplication.find({ appliedAt: { $gte: startDate } })
            .sort({ appliedAt: -1 })
            .limit(5)
            .select('studentName status appliedAt')
            .populate('jobId', 'title');

        // Format recent activity
        const recentActivity = [
            ...recentJobs.map(job => ({
                id: `job-${job._id}`,
                action: job.status === 'live' ? 'Job Approved' : job.status === 'rejected' ? 'Job Rejected' : 'New Job Posted',
                details: `${job.title} at ${job.company}`,
                time: job.createdAt,
                type: job.status === 'live' ? 'job' : job.status === 'rejected' ? 'rejection' : 'job',
                icon: 'Briefcase'
            })),
            ...recentManagers.map(manager => ({
                id: `manager-${manager._id}`,
                action: manager.hm_status === 'Verified' ? 'Manager Verified' : manager.hm_status === 'Rejected' ? 'Manager Rejected' : 'New Manager Registered',
                details: `${manager.hm_fname} ${manager.hm_lname} from ${manager.hm_company}`,
                time: manager.createdAt,
                type: manager.hm_status === 'Verified' ? 'manager' : manager.hm_status === 'Rejected' ? 'rejection' : 'manager',
                icon: 'Users'
            })),
            ...recentApplications.map(app => ({
                id: `app-${app._id}`,
                action: app.status === 'hired' ? 'Application Hired' : app.status === 'rejected' ? 'Application Rejected' : 'New Application',
                details: `${app.studentName} applied for ${app.jobId?.title || 'Unknown Position'}`,
                time: app.appliedAt,
                type: app.status === 'hired' ? 'job' : app.status === 'rejected' ? 'rejection' : 'job',
                icon: 'FileText'
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

        res.status(200).json({
            success: true,
            message: 'Reports data retrieved successfully',
            data: {
                period,
                stats: {
                    totalJobs,
                    jobsInPeriod,
                    liveJobs,
                    pendingJobs,
                    rejectedJobs,
                    totalManagers,
                    verifiedManagers,
                    unverifiedManagers,
                    rejectedManagers,
                    totalApplications,
                    applicationsInPeriod,
                    pendingApplications,
                    shortlistedApplications,
                    hiredApplications,
                    rejectedApplications,
                    successRate
                },
                recentActivity
            }
        });

    } catch (error) {
        console.error('Get reports data error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve reports data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Test PDF Generation
export const testPDFGeneration = async (req, res) => {
    try {
        console.log('Testing PDF generation...');
        
        // Try a very simple HTML first
        const simpleHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Test Report</title>
        </head>
        <body>
            <h1>Test PDF Report</h1>
            <p>This is a simple test to verify PDF generation works.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
        </body>
        </html>
        `;
        
        // Try html-pdf-node directly
        const htmlPdf = await import('html-pdf-node');
        const options = {
            format: 'A4',
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        };
        
        const file = { content: simpleHTML };
        const pdfBuffer = await htmlPdf.default.generatePdf(file, options);
        
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('Generated PDF buffer is empty');
        }
        
        console.log('Simple test PDF generated successfully, size:', pdfBuffer.length);
        
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="simple_test.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Cache-Control', 'no-cache');
        
        // Send PDF buffer
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('Simple test PDF generation error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to generate simple test PDF',
            error: error.message
        });
    }
};

// Generate Report (PDF/Excel)
export const generateReport = async (req, res) => {
    try {
        const { reportType, format = 'pdf', period = '30days' } = req.body;
        
        // Calculate date range based on period
        const now = new Date();
        let startDate;
        
        switch (period) {
            case '7days':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30days':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90days':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        let reportData = {};

        switch (reportType) {
            case 'overview':
                // Get comprehensive overview data
                const totalJobs = await Job.countDocuments();
                const totalManagers = await HiringManager.countDocuments();
                const totalApplications = await JobApplication.countDocuments();
                const liveJobs = await Job.countDocuments({ status: 'live' });
                const verifiedManagers = await HiringManager.countDocuments({ hm_status: 'Verified' });
                const hiredApplications = await JobApplication.countDocuments({ status: 'hired' });
                
                reportData = {
                    title: 'Platform Overview Report',
                    period,
                    generatedAt: new Date(),
                    summary: {
                        totalJobs,
                        totalManagers,
                        totalApplications,
                        liveJobs,
                        verifiedManagers,
                        hiredApplications
                    }
                };
                break;

            case 'jobs':
                // Get detailed job analytics
                const jobsInPeriod = await Job.find({ createdAt: { $gte: startDate } })
                    .sort({ createdAt: -1 });
                
                const jobStats = {
                    total: jobsInPeriod.length,
                    live: jobsInPeriod.filter(job => job.status === 'live').length,
                    pending: jobsInPeriod.filter(job => job.status === 'pending').length,
                    rejected: jobsInPeriod.filter(job => job.status === 'rejected').length
                };

                reportData = {
                    title: 'Job Analytics Report',
                    period,
                    generatedAt: new Date(),
                    stats: jobStats,
                    jobs: jobsInPeriod
                };
                break;

            case 'managers':
                // Get manager activity data
                const managersInPeriod = await HiringManager.find({ createdAt: { $gte: startDate } })
                    .sort({ createdAt: -1 });
                
                const managerStats = {
                    total: managersInPeriod.length,
                    verified: managersInPeriod.filter(m => m.hm_status === 'Verified').length,
                    unverified: managersInPeriod.filter(m => m.hm_status === 'Unverified').length,
                    rejected: managersInPeriod.filter(m => m.hm_status === 'Rejected').length
                };

                reportData = {
                    title: 'Manager Activity Report',
                    period,
                    generatedAt: new Date(),
                    stats: managerStats,
                    managers: managersInPeriod
                };
                break;

            case 'applications':
                // Get application trends
                const applicationsInPeriod = await JobApplication.find({ appliedAt: { $gte: startDate } })
                    .populate('jobId', 'title company')
                    .sort({ appliedAt: -1 });
                
                const applicationStats = {
                    total: applicationsInPeriod.length,
                    pending: applicationsInPeriod.filter(app => app.status === 'pending').length,
                    shortlisted: applicationsInPeriod.filter(app => app.status === 'shortlisted').length,
                    hired: applicationsInPeriod.filter(app => app.status === 'hired').length,
                    rejected: applicationsInPeriod.filter(app => app.status === 'rejected').length
                };

                reportData = {
                    title: 'Application Trends Report',
                    period,
                    generatedAt: new Date(),
                    stats: applicationStats,
                    applications: applicationsInPeriod
                };
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid report type'
                });
        }

        // Generate PDF if format is PDF
        if (format === 'pdf') {
            try {
                console.log('Generating PDF for:', reportType, period);
                console.log('Report data keys:', Object.keys(reportData));
                
                const pdfBuffer = await generatePDFReport(reportData, reportType, period);
                
                if (!pdfBuffer || pdfBuffer.length === 0) {
                    throw new Error('Generated PDF buffer is empty');
                }
                
                console.log('PDF generated successfully, size:', pdfBuffer.length);
                
                // Set headers for PDF download
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${reportType}_report_${period}.pdf"`);
                res.setHeader('Content-Length', pdfBuffer.length);
                res.setHeader('Cache-Control', 'no-cache');
                
                // Send PDF buffer
                res.send(pdfBuffer);
                return;
            } catch (pdfError) {
                console.error('PDF generation error:', pdfError);
                console.error('PDF error stack:', pdfError.stack);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to generate PDF report',
                    error: process.env.NODE_ENV === 'development' ? pdfError.message : 'Internal server error'
                });
            }
        }
        
        // For other formats, return JSON data
        res.status(200).json({
            success: true,
            message: `${reportType} report generated successfully`,
            data: {
                reportType,
                format,
                period,
                reportData,
                downloadUrl: `#` // Placeholder for actual file download URL
            }
        });

    } catch (error) {
        console.error('Generate report error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate report',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get JP Admin Dashboard Statistics
export const getJPDashboardStats = async (req, res) => {
    try {
        // Get job statistics
        const totalJobs = await Job.countDocuments();
        const pendingJobs = await Job.countDocuments({ status: 'pending' });
        const liveJobs = await Job.countDocuments({ status: 'live' });
        const rejectedJobs = await Job.countDocuments({ status: 'rejected' });
        const archivedJobs = await Job.countDocuments({ status: 'archived' });

        // Get hiring manager statistics
        const totalManagers = await HiringManager.countDocuments();
        const verifiedManagers = await HiringManager.countDocuments({ hm_status: 'Verified' });
        const unverifiedManagers = await HiringManager.countDocuments({ hm_status: 'Unverified' });
        const rejectedManagers = await HiringManager.countDocuments({ hm_status: 'Rejected' });

        // Get application statistics
        const totalApplications = await JobApplication.countDocuments();
        const recentApplications = await JobApplication.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        });

        // Get recent activity (last 10 activities)
        const recentJobs = await Job.find()
            .populate('postedby', 'hm_fname hm_lname hm_email')
            .sort({ updatedAt: -1 })
            .limit(10)
            .select('title status updatedAt postedby');

        const recentManagers = await HiringManager.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('hm_fname hm_lname hm_status updatedAt');

        // Format recent activity
        const recentActivity = [];
        
        // Add recent job activities
        recentJobs.forEach(job => {
            let action = '';
            let status = '';
            
            switch (job.status) {
                case 'live':
                    action = 'Job Approved';
                    status = 'success';
                    break;
                case 'rejected':
                    action = 'Job Rejected';
                    status = 'error';
                    break;
                case 'pending':
                    action = 'New Job Posted';
                    status = 'info';
                    break;
                case 'archived':
                    action = 'Job Archived';
                    status = 'info';
                    break;
            }
            
            if (action) {
                recentActivity.push({
                    id: `job_${job._id}`,
                    action,
                    target: job.title,
                    user: job.postedby ? `${job.postedby.hm_fname} ${job.postedby.hm_lname}` : 'Unknown',
                    time: formatTimeAgo(job.updatedAt),
                    type: 'job',
                    status
                });
            }
        });

        // Add recent manager activities
        recentManagers.forEach(manager => {
            let action = '';
            let status = '';
            
            switch (manager.hm_status) {
                case 'Verified':
                    action = 'Manager Verified';
                    status = 'success';
                    break;
                case 'Rejected':
                    action = 'Manager Rejected';
                    status = 'error';
                    break;
                case 'Unverified':
                    action = 'New Manager Registered';
                    status = 'info';
                    break;
            }
            
            if (action) {
                recentActivity.push({
                    id: `manager_${manager._id}`,
                    action,
                    target: `${manager.hm_fname} ${manager.hm_lname}`,
                    user: 'System',
                    time: formatTimeAgo(manager.updatedAt),
                    type: 'manager',
                    status
                });
            }
        });

        // Sort by time and limit to 10 most recent
        recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
        recentActivity.splice(10);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    pendingJobs,
                    totalManagers,
                    totalJobs,
                    pendingVerifications: unverifiedManagers,
                    liveJobs,
                    rejectedJobs,
                    archivedJobs,
                    verifiedManagers,
                    rejectedManagers,
                    totalApplications,
                    recentApplications
                },
                recentActivity
            }
        });

    } catch (error) {
        console.error('JP Admin Dashboard Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
};

