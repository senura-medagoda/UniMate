import mongoose from "mongoose";


const studentSchema = new mongoose.Schema(
    {
        s_fname:{
            type:String,
            required:true,
        },
        s_lname:{
            type:String,
            required:true,
        },
        
    },

    {timestapms:true}

);

const Student = mongoose.model("Student", studentSchema);

export default Student