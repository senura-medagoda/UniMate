import express from 'express';
import { 
    submitResellRequest, 
    getAllResellRequests, 
    getUserResellRequests,
    approveResellRequest, 
    rejectResellRequest, 
    getAllResellItems,
    getResellItemsByCategory,
    markItemAsSold
} from '../controllers/M_resellController.js';
import upload from '../middleware/M_multer.js';
import adminAuth from '../middleware/M_adminAuth.js';

const resellRouter = express.Router();

// User routes (no auth required for submission)
resellRouter.post('/submit-request', upload.fields([
    {name:'image1',maxCount:1},
    {name:'image2',maxCount:1},
    {name:'image3',maxCount:1},
    {name:'image4',maxCount:1}
]), submitResellRequest);

resellRouter.get('/user-requests/:userId', getUserResellRequests);
resellRouter.get('/items', getAllResellItems);
resellRouter.get('/items/:category', getResellItemsByCategory);
resellRouter.post('/mark-sold', markItemAsSold);

// Admin routes (require admin auth)
resellRouter.get('/admin/requests', adminAuth, getAllResellRequests);
resellRouter.post('/admin/approve', adminAuth, approveResellRequest);
resellRouter.post('/admin/reject', adminAuth, rejectResellRequest);

export default resellRouter;
