import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodVendor',
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodShop',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Burgers', 'Pizza', 'Salads', 'Pasta', 'Desserts', 'Beverages', 'Appetizers', 'Main Course', 'Sides', 'Drinks']
    },
    image: {
        type: String,
        default: ""
    },
    images: [{
        type: String,
        default: []
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isVegetarian: {
        type: Boolean,
        default: false
    },
    isVegan: {
        type: Boolean,
        default: false
    },
    isGlutenFree: {
        type: Boolean,
        default: false
    },
    isSpicy: {
        type: Boolean,
        default: false
    },
    preparationTime: {
        type: Number,
        default: 15,
        min: 1,
        max: 120
    },
    calories: {
        type: Number,
        min: 0
    },
    allergens: [{
        type: String,
        enum: ['dairy', 'eggs', 'fish', 'shellfish', 'tree_nuts', 'peanuts', 'wheat', 'soy']
    }],
    ingredients: [{
        type: String,
        trim: true
    }],
    nutritionalInfo: {
        protein: {
            type: Number,
            min: 0
        },
        carbs: {
            type: Number,
            min: 0
        },
        fat: {
            type: Number,
            min: 0
        },
        fiber: {
            type: Number,
            min: 0
        }
    },
    customizationOptions: [{
        name: {
            type: String,
            required: true
        },
        options: [{
            name: String,
            price: {
                type: Number,
                default: 0
            }
        }]
    }],
    tags: [{
        type: String,
        trim: true
    }],
    orderCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    discount: {
        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        validUntil: {
            type: Date
        }
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    minimize: false
});


menuItemSchema.index({ vendorId: 1 });
menuItemSchema.index({ shopId: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ isPopular: 1 });
menuItemSchema.index({ 'tags': 1 });


menuItemSchema.virtual('discountedPrice').get(function() {
    if (this.discount && this.discount.percentage > 0 && 
        (!this.discount.validUntil || this.discount.validUntil > new Date())) {
        return this.price * (1 - this.discount.percentage / 100);
    }
    return this.price;
});


menuItemSchema.set('toJSON', { virtuals: true });
menuItemSchema.set('toObject', { virtuals: true });

const MenuItemModel = mongoose.model('FoodMenu', menuItemSchema);

export default MenuItemModel;

