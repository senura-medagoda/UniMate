import mongoose from "mongoose";
import bcrypt from "bcryptjs"

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

        s_email:{
            type:String,
            required:true,
        },

        s_password:{
            type:String,
            required:true,
        },
        s_uni:{
            type:String,
            required:true,
        },
        s_uniID:{
            type:String,
            required:true,
        },
        s_NIC:{
            type:String,
            required:false, 
        },
        s_phone:{
            type:String,
            required:false,
        },
        s_status:{
            type:String,
            default:"Unverified",
        },  
        s_homeaddress:{
            type:String,
            required:false,
        }, 
        s_gender:{
            type:String,
            required:false,
        }, 
        s_faculty:{
            type:String,
            required:false,
        },   
        s_studyprogram:{
            type:String,
            required:false,
        },  
        s_dob:{
            type:Date,
            required:false,
        }, 
        s_id_document:{
            type:String,
            required:false,
        },  
    },  {timestamps:true}
);

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('s_password')) return next();
  this.s_password = await bcrypt.hash(this.s_password, 12);
  next();
})

//Compare password method
studentSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.s_password);
};

const Student = mongoose.model("Student", studentSchema);
export default Student