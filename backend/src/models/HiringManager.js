import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const hmSchema = new mongoose.Schema(
    {
        hm_fname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"]
        },
        hm_lname: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"]
        },
        hm_email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
        },
        hm_password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },
        hm_company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            maxlength: [100, "Company name cannot exceed 100 characters"]
        },
        hm_workID: {
            type: String,
            required: [true, "Work ID is required"],
            trim: true,
            unique: true,
            maxlength: [50, "Work ID cannot exceed 50 characters"]
        },
        hm_NIC: {
            type: String,
            required: false,
            trim: true,
            match: [/^[0-9]{9}[vVxX]|[0-9]{12}$/, "Please enter a valid NIC"]
        },
        hm_phone: {
            type: String,
            required: false,
            trim: true,
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
        },
        hm_status: {
            type: String,
            enum: ["Unverified", "Verified", "Suspended", "Banned"],
            default: "Unverified"
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
hmSchema.pre('save', async function(next) {
    if (!this.isModified('hm_password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.hm_password = await bcrypt.hash(this.hm_password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
hmSchema.methods.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.hm_password);
};

// Indexes for efficient querying
// Note: hm_email and hm_workID already have unique indexes from unique: true
hmSchema.index({ hm_status: 1 });

const HiringManager = mongoose.model("HiringManager", hmSchema);
export default HiringManager;