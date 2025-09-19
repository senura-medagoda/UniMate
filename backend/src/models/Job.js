import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },

    jobtype:{
        type:String,
        required:true,
    },

    location:{
        type:String,
        required:true,
    },

    compensation:{
        type:String,
        required:false,
    },

    deadline:{
        type:Date,
        required:true,
    },

    description:{
        type:String,
        required:true,
    },

    responsibilities:{
        type:String,
        required:true,
    },

    requirements:{
        type:String,
        required:true,
    },

    benefits:{
        type:String,
        required:false,
    },

    status:{
        type:String,
        required:true,
        default:"pending",
    },

    postedby:{
        type:String,
        required:true,
    }

},
    {timestamps:true});

const Job = mongoose.model("Job",jobSchema)
export default Job 