import express from "express";
import {
  getDashboardStats,
  getAllComplaints,
  updateComplaintStatus,
  getAllUsers,
  getUserById,
  banUser,
  suspendUser,
  reactivateUser,
  deleteMaterial,
  deleteForumPost,
  getAnalyticsReport,
  createComplaint
} from "../controllers/AdminController.js";

const router = express.Router();

// Dashboard stats
router.get("/stats", getDashboardStats);

// Analytics and reports
router.get("/analytics", getAnalyticsReport);

// Complaint management
router.get("/complaints", getAllComplaints);
router.put("/complaints/:id", updateComplaintStatus);
router.post("/complaints", createComplaint);

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId/ban", banUser);
router.put("/users/:userId/suspend", suspendUser);
router.put("/users/:userId/reactivate", reactivateUser);

// Content moderation
router.delete("/materials/:materialId", deleteMaterial);
router.delete("/forum/posts/:postId", deleteForumPost);

export default router;
