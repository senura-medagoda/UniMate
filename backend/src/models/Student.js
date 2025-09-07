import mongoose from "mongoose";
import bcrypt from "bcrypt"

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
        s_phone:{
            type:String,
            required:true,
        },   
    },  {timestapms:true}
);

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
})

//Compare password method
studentSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Student = mongoose.model("Student", studentSchema);
export default Student