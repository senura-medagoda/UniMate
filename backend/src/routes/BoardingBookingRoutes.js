import express from 'express';
import {
  createBooking,
  getStudentBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getOwnerBookingStats,
  deleteBooking
} from '../controllers/BoardingBookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new booking
router.post('/', createBooking);

// Get all bookings for a student (place BEFORE generic :id route)
router.get('/student/:studentId', getStudentBookings);

// Get all bookings for an owner (place BEFORE generic :id route)
router.get('/owner/:ownerId', getOwnerBookings);

// Get booking by ID (generic, keep last)
router.get('/:id', getBookingById);

// Get booking statistics for owner
router.get('/owner/:ownerId/stats', getOwnerBookingStats);

// Update booking status (Owner only)
router.put('/:id/status', updateBookingStatus);

// Cancel booking (Student only)
router.put('/:id/cancel', cancelBooking);

// Delete booking permanently (Student only; must be cancelled)
router.delete('/:id', deleteBooking);

export default router;

