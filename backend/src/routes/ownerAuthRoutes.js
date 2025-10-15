import express from 'express';
import { registerOwner, loginOwner } from '../controllers/ownerAuthController.js';
import { getAllOwnersForAdmin, activateOwner, deactivateOwner, removeOwner, getOwnerStatus, findOwnerByEmail } from '../controllers/ownerAuthController.js';

const router = express.Router();

router.post('/signup', registerOwner); 
router.post('/login', loginOwner);    

// Admin routes for owner management
router.get('/admin/all', getAllOwnersForAdmin);
router.put('/admin/:id/activate', activateOwner);
router.put('/admin/:id/deactivate', deactivateOwner);
router.put('/admin/:id/remove', removeOwner);

// Owner status check (no auth required for this endpoint)
router.get('/status/:id', getOwnerStatus);

// Find owner by email (no auth required for this endpoint)
router.get('/find-by-email/:email', findOwnerByEmail);

export default router;
