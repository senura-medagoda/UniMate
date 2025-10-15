import express from 'express'
import { createJob, getAllJobs, getJobById, getHMJobs, getAllJobsForAdmin, updateJobStatus, updateJob, deleteJob, deleteHMJob } from '../controllers/jobController.js'
import { hmAuth } from '../middleware/hmAuth.js'
import { jpAdminAuth } from '../middleware/jpAdminAuth.js'

const router = express.Router();

// Public routes (for students)
router.get("/", getAllJobs);

// Hiring Manager routes
router.post("/", hmAuth, createJob);
router.get("/my-jobs", hmAuth, getHMJobs);
router.put("/:jobId", hmAuth, updateJob);
router.delete("/:jobId", hmAuth, deleteHMJob);

// Public routes (must come after specific routes)
router.get("/:jobId", getJobById);

// JP Admin routes
router.get("/admin/all", jpAdminAuth, getAllJobsForAdmin);
router.put("/admin/:jobId/status", jpAdminAuth, updateJobStatus);
router.delete("/admin/:jobId", jpAdminAuth, deleteJob);

export default router;