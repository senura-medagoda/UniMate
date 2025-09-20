import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const vendorSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    businessLicense: {
        type: String,
        required: false,
        unique: false,
        trim: true,
        default: null
    },

    address: {
        type: String,
        required: true,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedAt: {
        type: Date
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodAdmin'
    },
    rejectionReason: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    }
}, {
    timestamps: true,
    minimize: false
});


vendorSchema.pre('save', async function(next) {
    // Handle business license - set to null if empty string
    if (this.businessLicense === '') {
        this.businessLicense = null;
    }
    
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


vendorSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


vendorSchema.methods.getPublicProfile = function() {
    const vendorObject = this.toObject();
    delete vendorObject.password;
    return vendorObject;
};

const VendorModel = mongoose.model('FoodVendor', vendorSchema);

export default VendorModel;

