import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const SASchema = new mongoose.Schema(
    {
        sa_fname: {
            type: String,
            required: true,
        },
        sa_lname: {
            type: String,
            required: true,
        },

        sa_email: {
            type: String,
            required: true,
        },

        sa_password: {
            type: String,
            required: true,
        },

        sa_NIC: {
            type: String,
            required: false,
        },
        sa_phone: {
            type: String,
            required: false,
        },
        sa_vstatus: {
            type: String,
            default: "Verified",
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date , required: false
        },
    }, { timestamps: true }
);

// Hash password before saving
SASchema.pre('save', async function (next) {
    if (!this.isModified('sa_password')) return next();
    this.sa_password = await bcrypt.hash(this.sa_password, 12);
    next();
})

//Compare password method
SASchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.sa_password);
};

const SystemAdmin = mongoose.model("SystemAdmin", SASchema);
export default SystemAdmin