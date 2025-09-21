import express from 'express';
import {
    registerHM,
    loginHM,
    getHMDetails,
    updateHMDetails,
    deleteHM,
    getAllHMs,
    changePassword
} from '../controllers/HM_Controller.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', registerHM);
router.post('/login', loginHM);

// Protected routes (authentication required)
// Note: You may want to add authentication middleware here
// For now, these routes are accessible without authentication
// In production, add middleware like: router.use(authMiddleware);

// Get specific hiring manager details
router.get('/:id', getHMDetails);

// Update hiring manager details
router.put('/:id', updateHMDetails);

// Delete hiring manager (soft delete)
router.delete('/:id', deleteHM);

// Change password
router.put('/:id/change-password', changePassword);

// Admin routes (for getting all hiring managers)
router.get('/', getAllHMs);

export default router;
