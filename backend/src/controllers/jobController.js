import Job from "../models/Job.js";

export async function createJob(req,res){
    try {
        console.log('=== CREATE JOB REQUEST ===');
        console.log('HM ID:', req.hmId);
        console.log('Request body:', req.body);
        console.log('========================');
        
        const {title,department,jobtype,location,compensation, deadline, description,requirements, responsibilities, benefits} = req.body
        const postedby = req.hm.hm_email; // Get HM email from auth middleware
        
        // Validate required fields
        if (!title || !department || !jobtype || !location || !deadline || !description || !requirements || !responsibilities) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                required: ["title", "department", "jobtype", "location", "deadline", "description", "requirements", "responsibilities"]
            });
        }
        
        console.log('Creating job with data:', {
            title, department, jobtype, location, compensation, deadline, description, requirements, responsibilities, benefits, postedby
        });
        
        const newJob = new Job({
            title,
            department,
            jobtype,
            location,
            compensation, 
            deadline, 
            description,
            requirements, 
            responsibilities, 
            benefits, 
            postedby
        })

        await newJob.save()
        console.log('Job created successfully:', newJob._id);
        
        res.status(201).json({
            success: true,
            message:"Job Listed successfully!",
            data: newJob
        })

    } catch (error) {
        console.error("Error in createJob controller", error)
        console.error("Error details:", error.message)
        console.error("Error stack:", error.stack)
        
        // Check if it's a validation error
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: validationErrors
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

export async function getAllJobs(req, res) {
    try {
        console.log("Getting all jobs...");
        
        // First, archive any expired jobs
        await archiveExpiredJobs();
        
        // Get only live jobs for students
        const jobs = await Job.find({ status: "live" })
            .sort({ createdAt: -1 }); // Sort by newest first
        
        console.log(`Found ${jobs.length} live jobs`);
        
        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length
        });
    } catch (error) {
        console.error("Error in getAllJobs controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Helper function to archive expired jobs
async function archiveExpiredJobs() {
    try {
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

export async function getHMJobs(req, res) {
    try {
        console.log('=== GET HM JOBS REQUEST ===');
        console.log('HM ID:', req.hmId);
        console.log('HM Object:', req.hm);
        console.log('Request headers:', req.headers);
        console.log('========================');
        
        // First, archive any expired jobs
        await archiveExpiredJobs();
        
        const hiringManagerEmail = req.hm.hm_email; // Get HM email from hmAuth middleware
        
        if (!hiringManagerEmail) {
            console.error('No HM email found in request');
            return res.status(400).json({
                success: false,
                message: "Hiring Manager email not found"
            });
        }
        
        console.log('About to query jobs for HM email:', hiringManagerEmail);
        
        // Find jobs using email since postedby is stored as email
        const jobs = await Job.find({ postedby: hiringManagerEmail })
            .sort({ createdAt: -1 });
        
        console.log(`Found ${jobs.length} jobs for HM:`, hiringManagerEmail);
        console.log('Jobs data:', jobs);
        
        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length
        });
    } catch (error) {
        console.error("Error in getHMJobs controller", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Error name:", error.name);
        
        // Check if it's a database connection error
        if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
            console.error("Database connection error detected");
            return res.status(500).json({
                success: false,
                message: "Database connection error",
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export async function getAllJobsForAdmin(req, res) {
    try {
        const jobs = await Job.find({})
            .populate('postedby', 'name email') // Populate hiring manager details
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length
        });
    } catch (error) {
        console.error("Error in getAllJobsForAdmin controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function updateJobStatus(req, res) {
    try {
        const { jobId } = req.params;
        const { status } = req.body;
        
        const job = await Job.findByIdAndUpdate(
            jobId,
            { status },
            { new: true }
        );
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Job status updated successfully",
            data: job
        });
    } catch (error) {
        console.error("Error in updateJobStatus controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function updateJob(req, res) {
    try {
        const { jobId } = req.params;
        const { title, department, jobtype, location, compensation, deadline, description, requirements, responsibilities, benefits } = req.body;
        const hmEmail = req.hm.hm_email; // Get HM email from auth middleware
        
        // Validate required fields
        if (!title || !department || !jobtype || !location || !deadline || !description || !requirements || !responsibilities) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                required: ["title", "department", "jobtype", "location", "deadline", "description", "requirements", "responsibilities"]
            });
        }
        
        // Check if job exists and belongs to this hiring manager
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        
        if (existingJob.postedby !== hmEmail) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own jobs"
            });
        }

        // Prevent editing rejected jobs
        if (existingJob.status === 'rejected') {
            return res.status(403).json({
                success: false,
                message: "Cannot edit rejected jobs"
            });
        }
        
        // Update the job
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                title,
                department,
                jobtype,
                location,
                compensation,
                deadline,
                description,
                requirements,
                responsibilities,
                benefits
            },
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });
    } catch (error) {
        console.error("Error in updateJob controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getJobById(req, res) {
    try {
        const { jobId } = req.params;
        
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error("Error in getJobById controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function deleteJob(req, res) {
    try {
        const { jobId } = req.params;
        
        const job = await Job.findByIdAndDelete(jobId);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteJob controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function deleteHMJob(req, res) {
    try {
        const { jobId } = req.params;
        const hmEmail = req.hm.hm_email; // Get HM email from auth middleware
        
        // Check if job exists and belongs to this hiring manager
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        
        if (existingJob.postedby !== hmEmail) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own jobs"
            });
        }
        
        // Delete the job
        await Job.findByIdAndDelete(jobId);
        
        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteHMJob controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}