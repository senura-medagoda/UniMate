import mongoose from "mongoose";

const openingHoursSchema = new mongoose.Schema({
    open: {
        type: String,
        required: true,
        default: "09:00"
    },
    close: {
        type: String,
        required: true,
        default: "22:00"
    },
    closed: {
        type: Boolean,
        default: false
    }
});

const shopSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodVendor',
        required: true
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    shopLicense: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    contactInfo: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },

    openingHours: {
        monday: openingHoursSchema,
        tuesday: openingHoursSchema,
        wednesday: openingHoursSchema,
        thursday: openingHoursSchema,
        friday: openingHoursSchema,
        saturday: openingHoursSchema,
        sunday: openingHoursSchema
    },
    images: [{
        type: String,
        default: []
    }],
    logo: {
        type: String,
        default: ""
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
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
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    deliveryRadius: {
        type: Number,
        default: 5, 
        min: 1,
        max: 50
    },
    minimumOrderAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    deliveryFee: {
        type: Number,
        default: 0,
        min: 0
    },
    preparationTime: {
        type: Number,
        default: 30, 
        min: 5,
        max: 120
    },
    features: [{
        type: String,
        enum: ['delivery', 'pickup', 'dine_in', 'vegetarian', 'vegan', 'gluten_free', 'halal', 'kosher']
    }],
    tags: [{
        type: String,
        trim: true
    }],
    adminRatings: [{
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodAdmin',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            default: ''
        },
        ratedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    minimize: false
});


shopSchema.index({ vendorId: 1 });
shopSchema.index({ 'address.city': 1 });
shopSchema.index({ isActive: 1, isOpen: 1 });

const ShopModel = mongoose.model('FoodShop', shopSchema);

export default ShopModel;

