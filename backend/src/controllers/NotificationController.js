import Notification from '../models/Notification.js';

// @desc    Get notifications for a user
// @route   GET /api/notifications/:userId
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipientId: req.params.userId 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: 'Failed to fetch notifications', error });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: 'Failed to mark notification as read', error });
  }
};

// @desc    Mark all notifications as read for a user
// @route   PUT /api/notifications/:userId/read-all
// @access  Private
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.params.userId, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: 'Failed to mark notifications as read', error });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: 'Failed to delete notification', error });
  }
};








