import express from 'express';
import { registerJPAdmin, loginJPAdmin, getJPDashboardStats, getCurrentJPAdminProfile, updateCurrentJPAdminProfile, getReportsData, generateReport, testPDFGeneration } from '../controllers/JPAcontroller.js';
import { jpAdminAuth } from '../middleware/jpAdminAuth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerJPAdmin);
router.post('/login', loginJPAdmin);

// Protected routes (authentication required)
router.get('/profile', jpAdminAuth, getCurrentJPAdminProfile);
router.put('/profile', jpAdminAuth, updateCurrentJPAdminProfile);
router.get('/dashboard/stats', jpAdminAuth, getJPDashboardStats);
router.get('/reports', jpAdminAuth, getReportsData);
router.post('/reports/generate', jpAdminAuth, generateReport);
router.get('/test-pdf', jpAdminAuth, testPDFGeneration);

export default router;

