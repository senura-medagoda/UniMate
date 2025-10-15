import express from 'express';
import multer from 'multer';
import { applyForJob, getJobApplications, getStudentApplications, updateApplicationStatus, checkApplicationStatus, deleteJobApplication, getHMApplications } from '../controllers/jobApplicationController.js';
import { protect } from '../middleware/authSTDMW.js';
import { hmAuth } from '../middleware/hmAuth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF and Word documents
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'), false);
    }
  }
});

// Student routes
router.get("/:jobId/check-status", protect, checkApplicationStatus);
router.post("/:jobId/apply", protect, upload.single('resume'), applyForJob);
router.get("/student/my-applications", protect, getStudentApplications);
router.delete("/:applicationId", protect, deleteJobApplication);

// Hiring Manager routes
router.get("/hm-applicants", hmAuth, getHMApplications);
router.get("/job/:jobId", hmAuth, getJobApplications);
router.put("/:applicationId/status", hmAuth, updateApplicationStatus);

export default router;
