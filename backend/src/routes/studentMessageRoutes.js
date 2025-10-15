// SM - Student Message Routes
import express from 'express';
import { 
  sendMessageToAdmin, 
  getAllMessages, 
  getStudentMessages, 
  getMessage, 
  markAsRead, 
  replyToMessage, 
  deleteMessage, 
  updateMessageStatus,
  acceptMessage,
  rejectMessage
} from '../controllers/StudentMessageController.js';
import { protect as authSTDMW } from '../middleware/authSTDMW.js';
import smAdminAuth from '../middleware/smAdminAuth.js';

const router = express.Router();

// Student routes
router.post('/send', authSTDMW, sendMessageToAdmin);
router.get('/student', authSTDMW, getStudentMessages);
router.get('/:messageId', authSTDMW, getMessage);
router.delete('/:messageId', authSTDMW, deleteMessage);

// Admin routes
router.get('/admin/all', smAdminAuth, getAllMessages);
router.get('/admin/:messageId', smAdminAuth, getMessage);
router.put('/admin/mark-read/:messageId', smAdminAuth, markAsRead);
router.put('/admin/reply/:messageId', smAdminAuth, replyToMessage);
router.put('/admin/status/:messageId', smAdminAuth, updateMessageStatus);
router.put('/admin/accept/:messageId', smAdminAuth, acceptMessage);
router.put('/admin/reject/:messageId', smAdminAuth, rejectMessage);

export default router;
