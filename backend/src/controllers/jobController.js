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