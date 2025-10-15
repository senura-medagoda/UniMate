import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";

// Apply for a job
export async function applyForJob(req, res) {
    try {
        console.log('=== JOB APPLICATION REQUEST ===');
        console.log('Job ID:', req.params.jobId);
        console.log('Student ID:', req.std._id);
        console.log('Student Status:', req.std.s_status);
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);
        
        const { jobId } = req.params;
        const { studentName, studentEmail, studentPhone, coverLetter } = req.body;
        
        // Get student ID from the authenticated user
        const studentId = req.std._id;
        
        // Get uploaded resume file
        const resumeFile = req.file;
        console.log('Resume file:', resumeFile);

        // Check if student is verified
        if (req.std.s_status !== 'Verified') {
            return res.status(403).json({
                success: false,
                message: "Only verified students can apply for jobs. Please complete your verification process first."
            });
        }

        // Check if job exists and is live
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        if (job.status !== 'live') {
            return res.status(400).json({
                success: false,
                message: "This job is no longer accepting applications"
            });
        }

        // Check if student has already applied for this job
        const existingApplication = await JobApplication.findOne({
            jobId: jobId,
            studentId: studentId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // Validate required fields
        if (!resumeFile) {
            return res.status(400).json({
                success: false,
                message: "Resume is required to apply for this job"
            });
        }

        // Create new application
        const newApplication = new JobApplication({
            jobId,
            studentId,
            studentName,
            studentEmail,
            studentPhone,
            coverLetter,
            resume: resumeFile.filename // Store the filename of the uploaded file
        });

        console.log('Creating application:', newApplication);
        await newApplication.save();
        console.log('Application saved successfully:', newApplication._id);

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: newApplication
        });

    } catch (error) {
        console.error("Error in applyForJob controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Get applications for a specific job (for hiring managers)
export async function getJobApplications(req, res) {
    try {
        const { jobId } = req.params;

        const applications = await JobApplication.find({ jobId })
            .populate('studentId', 'name email phone university course')
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            data: applications,
            count: applications.length
        });

    } catch (error) {
        console.error("Error in getJobApplications controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Get student's applications
export async function getStudentApplications(req, res) {
    try {
        // Get student ID from the authenticated user
        const studentId = req.std._id;

        const applications = await JobApplication.find({ studentId })
            .populate('jobId', 'title department location status deadline')
            .sort({ appliedAt: -1 });

        res.status(200).json({
            success: true,
            data: applications,
            count: applications.length
        });

    } catch (error) {
        console.error("Error in getStudentApplications controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Check if student has already applied for a specific job
export async function checkApplicationStatus(req, res) {
    try {
        const { jobId } = req.params;
        const studentId = req.std._id;

        console.log('Checking application status for job:', jobId, 'student:', studentId);

        const existingApplication = await JobApplication.findOne({
            jobId: jobId,
            studentId: studentId
        });

        console.log('Existing application found:', !!existingApplication);

        res.status(200).json({
            success: true,
            hasApplied: !!existingApplication,
            application: existingApplication || null
        });

    } catch (error) {
        console.error("Error in checkApplicationStatus controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Update application status (for hiring managers)
export async function updateApplicationStatus(req, res) {
    try {
        const { applicationId } = req.params;
        const { status, notes } = req.body;

        const application = await JobApplication.findByIdAndUpdate(
            applicationId,
            { 
                status, 
                notes,
                reviewedAt: new Date(),
                reviewedBy: req.user?.email || 'Unknown'
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application
        });

    } catch (error) {
        console.error("Error in updateApplicationStatus controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Get all applications for hiring manager's jobs
export async function getHMApplications(req, res) {
    try {
        console.log('=== GET HM APPLICATIONS REQUEST ===');
        console.log('HM ID:', req.hmId);
        console.log('HM Object:', req.hm);
        console.log('================================');

        const hmEmail = req.hm.hm_email; // Get HM email from hmAuth middleware
        
        if (!hmEmail) {
            console.error('No HM email found in request');
            return res.status(400).json({
                success: false,
                message: "Hiring Manager email not found"
            });
        }

        // First, get all jobs posted by this hiring manager
        const hmJobs = await Job.find({ postedby: hmEmail }).select('_id title department');
        const jobIds = hmJobs.map(job => job._id);
        
        if (jobIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                count: 0,
                message: "No jobs found for this hiring manager"
            });
        }

        // Get all applications for these jobs
        const applications = await JobApplication.find({ 
            jobId: { $in: jobIds } 
        })
        .populate('jobId', 'title department location status deadline')
        .populate('studentId', 's_fname s_lname s_email s_phone s_homeaddress s_uni s_faculty s_studyprogram s_gender s_dob s_status')
        .sort({ appliedAt: -1 });

        console.log(`Found ${applications.length} applications for HM:`, hmEmail);
        
        // Debug: Log the first application to see the populated data
        if (applications.length > 0) {
            console.log('First application data:', JSON.stringify(applications[0], null, 2));
            console.log('StudentId populated data:', applications[0].studentId);
        }

        res.status(200).json({
            success: true,
            data: applications,
            count: applications.length
        });

    } catch (error) {
        console.error("Error in getHMApplications controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Delete job application (for students)
export async function deleteJobApplication(req, res) {
    try {
        const { applicationId } = req.params;
        const studentId = req.std._id;

        console.log('=== DELETE APPLICATION REQUEST ===');
        console.log('Application ID:', applicationId);
        console.log('Student ID:', studentId);
        console.log('================================');

        // Find the application
        const application = await JobApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Check if the application belongs to the current student
        if (application.studentId.toString() !== studentId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own applications"
            });
        }

        // Delete the application
        await JobApplication.findByIdAndDelete(applicationId);

        console.log('Application deleted successfully:', applicationId);

        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteJobApplication controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
