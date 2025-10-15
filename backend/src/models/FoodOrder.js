import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    foodItemId: { type: mongoose.Schema.Types.ObjectId, required: false },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Legacy field
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

// Pre-save middleware to handle legacy itemId field
foodItemSchema.pre('save', function(next) {
  // If we have itemId but no foodItemId, copy itemId to foodItemId
  if (this.itemId && !this.foodItemId) {
    this.foodItemId = this.itemId;
  }
  // If we have foodItemId but no itemId, copy foodItemId to itemId for backward compatibility
  if (this.foodItemId && !this.itemId) {
    this.itemId = this.foodItemId;
  }
  next();
});

const foodOrderSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    foodItems: { type: [foodItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refund Pending', 'Refunded'], default: 'Pending' },
    orderStatus: {
      type: String,
      enum: ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Placed',
    },
    address: { type: String, required: true },
    stripeSessionId: { type: String, default: null },
  },
  { timestamps: true }
);

// cancellation fields
foodOrderSchema.add({
  cancelRequested: { type: Boolean, default: false },
  cancelReason: { type: String, default: null },
  cancelStatus: { type: String, enum: ['Requested','Approved','Rejected',null], default: null },
  cancelRequestedAt: { type: Date, default: null },
  cancelResolvedAt: { type: Date, default: null },
  // idempotency key from client to avoid duplicates
  clientOrderKey: { type: String, index: true, unique: true, sparse: true },
  // soft delete fields
  deletedByStudent: { type: Boolean, default: false },
  deletedByStudentAt: { type: Date, default: null },
  deletedByAdmin: { type: Boolean, default: false },
  deletedByAdminAt: { type: Date, default: null },
  // shipping fields
  shippedAt: { type: Date, default: null },
  trackingNumber: { type: String, default: null },
  estimatedDeliveryTime: { type: Date, default: null },
  shippingNotes: { type: String, default: null },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },
});

const FoodOrder = mongoose.model('foodOrder', foodOrderSchema);

export default FoodOrder;


