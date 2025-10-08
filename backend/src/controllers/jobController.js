import Job from "../models/Job.js";

export async function createJob(req,res){
    try {
        const {title,department,jobtype,location,compensation, deadline, description,requirements, responsibilities, benefits, postedby} = req.body
        const newJob = new Job({title,department,jobtype,location,compensation, deadline, description,requirements, responsibilities, benefits, postedby})

        await newJob.save()
        res.status(201).json({message:"Job Listed successfully!"})

    } catch (error) {
        console.error("Error in createJob controller", error)
        res.status(500).json({message:"Internal server error"})
    }
}

export async function getAllJobs(req, res) {
    try {
        console.log("Getting all jobs...");
        
        // Get all jobs regardless of status for now
        const jobs = await Job.find({})
            .sort({ createdAt: -1 }); // Sort by newest first
        
        console.log(`Found ${jobs.length} jobs`);
        
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