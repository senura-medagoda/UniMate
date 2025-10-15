import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const jpAdminSchema = new mongoose.Schema(
    {
        jpa_fname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"]
        },
        jpa_lname: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"]
        },
        jpa_email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
        },
        jpa_password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },
        jpa_workID: {
            type: String,
            required: [true, "Work ID is required"],
            trim: true,
            unique: true,
            maxlength: [50, "Work ID cannot exceed 50 characters"]
        },
        jpa_phone: {
            type: String,
            required: false,
            trim: true,
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
        },
        jpa_status: {
            type: String,
            enum: ["Active", "Inactive", "Suspended", "Banned"],
            default: "Active"
        },
        lastLogin: {
            type: Date
        },
        loginCount: {
            type: Number,
            default: 0
        },
        profilePicture: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [500, "Bio cannot exceed 500 characters"]
        },
        department: {
            type: String,
            trim: true,
            maxlength: [100, "Department cannot exceed 100 characters"]
        },
        position: {
            type: String,
            trim: true,
            maxlength: [100, "Position cannot exceed 100 characters"]
        }
    }, 
    { timestamps: true }
);

// Hash password before saving
jpAdminSchema.pre('save', async function(next) {
    if (!this.isModified('jpa_password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.jpa_password = await bcrypt.hash(this.jpa_password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
jpAdminSchema.methods.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.jpa_password);
};

// Indexes for efficient querying (jpa_email and jpa_workID already have unique indexes)
jpAdminSchema.index({ jpa_status: 1 });

const JPAdmin = mongoose.model("JPAdmin", jpAdminSchema);
export default JPAdmin;

