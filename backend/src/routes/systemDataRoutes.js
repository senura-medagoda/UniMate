// SM - System Data Routes
import express from 'express';
import {
  getSystemData,
  getCampuses,
  createCampus,
  updateCampus,
  deleteCampus,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getYears,
  createYear,
  updateYear,
  deleteYear,
  getSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/systemDataController.js';

const router = express.Router();

// Get all system data for student forms
router.get('/all', getSystemData);

// Campus routes
router.get('/campuses', getCampuses);
router.post('/campuses', createCampus);
router.put('/campuses/:id', updateCampus);
router.delete('/campuses/:id', deleteCampus);

// Course routes
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Year routes
router.get('/years', getYears);
router.post('/years', createYear);
router.put('/years/:id', updateYear);
router.delete('/years/:id', deleteYear);

// Semester routes
router.get('/semesters', getSemesters);
router.post('/semesters', createSemester);
router.put('/semesters/:id', updateSemester);
router.delete('/semesters/:id', deleteSemester);

// Subject routes
router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

export default router;
