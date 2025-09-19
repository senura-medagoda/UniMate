import NotificationModel from "../models/NotificationModel.js";
import AdminModel from "../models/AdminModel.js";

// Create notification for admins
export const createAdminNotification = async (type, title, message, data = {}, priority = 'medium', actionUrl = '') => {
    try {
        // Get all active admins who can manage shops
        const admins = await AdminModel.find({
            isActive: true,
            $or: [
                { role: 'super_admin' },
                { permissions: { $in: ['manage_shops'] } }
            ]
        }).select('_id');

        console.log('Found admins for notification:', admins.length);
        if (admins.length === 0) {
            console.log('No admins found to send notification to');
            return;
        }

        // Create notifications for all eligible admins
        const notifications = admins.map(admin => ({
            recipient: admin._id,
            type,
            title,
            message,
            data,
            priority,
            actionUrl
        }));

        await NotificationModel.insertMany(notifications);
        console.log(`✅ Created ${notifications.length} notifications for type: ${type}`);
        
        return notifications;
    } catch (error) {
        console.error('Error creating admin notification:', error);
        throw error;
    }
};

// Get notifications for admin
export const getAdminNotifications = async (adminId, limit = 50, skip = 0) => {
    try {
        const notifications = await NotificationModel.find({ recipient: adminId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const unreadCount = await NotificationModel.countDocuments({
            recipient: adminId,
            isRead: false
        });

        return {
            notifications,
            unreadCount,
            total: await NotificationModel.countDocuments({ recipient: adminId })
        };
    } catch (error) {
        console.error('Error getting admin notifications:', error);
        throw error;
    }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId, adminId) => {
    try {
        const notification = await NotificationModel.findOneAndUpdate(
            { _id: notificationId, recipient: adminId },
            { 
                isRead: true,
                readAt: new Date()
            },
            { new: true }
        );

        return notification;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

// Mark all notifications as read for admin
export const markAllNotificationsAsRead = async (adminId) => {
    try {
        const result = await NotificationModel.updateMany(
            { recipient: adminId, isRead: false },
            { 
                isRead: true,
                readAt: new Date()
            }
        );

        return result;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

// Delete old notifications (cleanup)
export const deleteOldNotifications = async (daysOld = 30) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await NotificationModel.deleteMany({
            createdAt: { $lt: cutoffDate },
            isRead: true
        });

        console.log(`✅ Deleted ${result.deletedCount} old notifications`);
        return result;
    } catch (error) {
        console.error('Error deleting old notifications:', error);
        throw error;
    }
};
