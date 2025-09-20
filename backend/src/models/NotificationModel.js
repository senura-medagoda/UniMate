import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodAdmin',
        required: true
    },
    type: {
        type: String,
        enum: [
            'shop_pending_approval',
            'shop_approved',
            'shop_rejected',
            'vendor_registered',
            'vendor_activated',
            'vendor_deactivated',
            'order_placed',
            'order_cancelled',
            'system_alert'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    actionUrl: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
    minimize: false
});

// Index for better performance
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;


