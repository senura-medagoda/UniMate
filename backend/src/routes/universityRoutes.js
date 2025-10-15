// SM - University Routes
import express from 'express';
import {
  getAllUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getUniversityById
} from '../controllers/universityController.js';

const router = express.Router();

// Get all universities
router.get('/', getAllUniversities);

// Get university by ID
router.get('/:id', getUniversityById);

// Create new university
router.post('/', createUniversity);

// Update university
router.put('/:id', updateUniversity);

// Delete university
router.delete('/:id', deleteUniversity);

export default router;
