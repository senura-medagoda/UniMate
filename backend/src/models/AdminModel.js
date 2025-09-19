import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'food_admin', 'support_admin'],
        default: 'food_admin'
    },
    permissions: [{
        type: String,
        enum: [
            'manage_vendors',
            'manage_shops',
            'manage_orders',
            'view_analytics',
            'manage_categories',
            'manage_promotions',
            'manage_users',
            'system_settings'
        ]
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    profileImage: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        default: "Food Delivery"
    }
}, {
    timestamps: true,
    minimize: false
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (without password)
adminSchema.methods.getPublicProfile = function() {
    const adminObject = this.toObject();
    delete adminObject.password;
    return adminObject;
};

// Index for better performance (email and username already indexed by unique: true)
adminSchema.index({ role: 1, isActive: 1 });

const AdminModel = mongoose.model('FoodAdmin', adminSchema);

export default AdminModel;
