import express from 'express';
import {
  createBoardingPlace,
  getAllBoardingPlaces,
  getBoardingPlaceById,
  updateBoardingPlace,
  deleteBoardingPlace,
  getAllBoardingPlacesForAdmin,
  getPendingBoardingPlaces,
  approveBoardingPlace,
  rejectBoardingPlace,
  removeBoardingPlace,
} from '../controllers/BoardingPlaceController.js';

import { protect } from '../middleware/authMiddleware.js';
import { isBoardingOwner, isAdmin, isAdminTest } from '../middleware/RoleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { getBoardingPlacesByOwner, adminHideBoardingPlace } from '../controllers/BoardingPlaceController.js';

const router = express.Router();

// Public Routes
router.get('/', getAllBoardingPlaces);

// Protected Routes (Boarding Owner or Admin)
router.post('/', protect, isBoardingOwner, upload.single("image"), createBoardingPlace);
router.get('/owner/dashboard', protect, getBoardingPlacesByOwner);

// Admin Routes (using test middleware for now)
router.get('/admin/all', protect, isAdminTest, getAllBoardingPlacesForAdmin);
router.get('/admin/pending', protect, isAdminTest, getPendingBoardingPlaces);
router.put('/admin/:id/approve', protect, isAdminTest, approveBoardingPlace);
router.put('/admin/:id/reject', protect, isAdminTest, rejectBoardingPlace);
router.put('/admin/:id/remove', protect, isAdminTest, removeBoardingPlace);
router.put('/admin/:id/hide', protect, isAdminTest, adminHideBoardingPlace);

// These routes should come after specific routes to avoid conflicts
router.get('/:id', getBoardingPlaceById);
router.put('/:id', protect, isBoardingOwner, updateBoardingPlace);
router.delete('/:id', protect, isBoardingOwner, deleteBoardingPlace);
router.delete('/admin/:id', protect, isAdmin, deleteBoardingPlace);

export default router;
