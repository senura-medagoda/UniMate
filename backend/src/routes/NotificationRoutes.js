import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../controllers/NotificationController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get notifications for a user
router.get('/:userId', getUserNotifications);

// Mark notification as read
router.put('/:id/read', markNotificationAsRead);

// Mark all notifications as read for a user
router.put('/:userId/read-all', markAllNotificationsAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

export default router;








