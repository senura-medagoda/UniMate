import express from 'express';
import { 
    submitResellRequest, 
    getAllResellRequests, 
    getUserResellRequests,
    approveResellRequest, 
    rejectResellRequest,
    deleteResellRequest,
    deleteUserResellRequest,
    getAllResellItems,
    getResellItemsByCategory,
    markItemAsSold,
    deleteResellItem
} from '../controllers/M_resellController.js';
import upload from '../middleware/M_multer.js';
import adminAuth from '../middleware/M_adminAuth.js';

const resellRouter = express.Router();

// User routes (no auth required for submission)
resellRouter.post('/submit-request', upload.array('images', 10), submitResellRequest);

resellRouter.get('/user-requests/:userId', getUserResellRequests);
resellRouter.delete('/user-requests/:requestId', deleteUserResellRequest);
resellRouter.get('/items', getAllResellItems);
resellRouter.get('/items/:category', getResellItemsByCategory);
resellRouter.post('/mark-sold', markItemAsSold);
resellRouter.delete('/delete-item/:itemId', adminAuth, deleteResellItem);

// Admin routes (require admin auth)
resellRouter.get('/admin/requests', adminAuth, getAllResellRequests);
resellRouter.post('/admin/approve', adminAuth, approveResellRequest);
resellRouter.post('/admin/reject', adminAuth, rejectResellRequest);
resellRouter.delete('/admin/delete-request/:requestId', adminAuth, deleteResellRequest);

export default resellRouter;
