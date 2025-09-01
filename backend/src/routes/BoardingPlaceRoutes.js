import express from 'express';
import {
  createBoardingPlace,
  getAllBoardingPlaces,
  getBoardingPlaceById,
  updateBoardingPlace,
  deleteBoardingPlace,
} from '../controllers/BoardingPlaceController.js';

//import { protect } from '../middleware/authMiddleware.js';
import { isBoardingOwner, isAdmin } from '../middleware/RoleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { getBoardingPlacesByOwner } from '../controllers/BoardingPlaceController.js';

const router = express.Router();

router.post(
  '/',
  /*protect,
  isBoardingOwner,*/
  upload.single("image"),
  createBoardingPlace
);

// Public Routes
router.get('/', getAllBoardingPlaces);
router.get('/:id', getBoardingPlaceById);
router.get('/owner/:ownerId', getBoardingPlacesByOwner);

// Protected Routes (Boarding Owner or Admin)
//router.post('/', protect, isBoardingOwner, createBoardingPlace);
router.post('/',createBoardingPlace);
router.put('/:id', /*protect, isBoardingOwner,*/ updateBoardingPlace);
router.delete('/:id', /*protect, isBoardingOwner,*/ deleteBoardingPlace);
router.delete('/admin/:id', /*protect, isAdmin,*/ deleteBoardingPlace);

export default router;
