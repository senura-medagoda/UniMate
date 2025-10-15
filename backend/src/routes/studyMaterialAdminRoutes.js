// SM - Study Material Admin Routes
import express from 'express';
import { loginAdmin, verifyAdmin } from '../controllers/studyMaterialAdminController.js';

const router = express.Router();

// Admin login
router.post('/login', loginAdmin);

// Verify admin token
router.get('/verify', verifyAdmin);

export default router;
