import express from 'express';
import multer from 'multer';
import {
    registerHM,
    loginHM,
    getCurrentHMProfile,
    updateCurrentHMProfile,
    getHMDashboardStats,
    getHMProfileStats,
    getHMDetails,
    updateHMDetails,
    deleteHM,
    getAllHMs,
    changePassword,
    getAllHMsForAdmin,
    updateHMStatus
} from '../controllers/HM_Controller.js';
import { hmAuth } from '../middleware/hmAuth.js';
import { jpAdminAuth } from '../middleware/jpAdminAuth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proof-document-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for proof documents'), false);
    }
  }
});

// Public routes (no authentication required)
router.post('/signup', upload.single('proof_document'), registerHM);
router.post('/login', loginHM);

// Protected routes (authentication required)

// Get current hiring manager profile (authenticated user)
router.get('/profile', hmAuth, getCurrentHMProfile);

// Update current hiring manager profile (authenticated user)
router.put('/profile', hmAuth, updateCurrentHMProfile);

// Get hiring manager dashboard statistics (authenticated user)
router.get('/dashboard/stats', hmAuth, getHMDashboardStats);

// Get hiring manager profile statistics (authenticated user)
router.get('/profile/stats', hmAuth, getHMProfileStats);

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

// JP Admin routes for HM management
router.get('/admin/all', jpAdminAuth, getAllHMsForAdmin);
router.put('/admin/:hmId/status', jpAdminAuth, updateHMStatus);
router.delete('/admin/:hmId', jpAdminAuth, deleteHM);

export default router;
