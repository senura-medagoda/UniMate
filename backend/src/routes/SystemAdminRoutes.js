import express from "express"
import { addSA, getSystemAdminDashboardStats, loginSA, getCurrentSAProfile } from "../controllers/SystemAdminController.js"
import { saAuth } from "../middleware/saAuth.js"

const router = express.Router()

// Public routes
router.post("/", addSA);
router.post("/login", loginSA);

// Protected routes
router.get("/dashboard/stats", saAuth, getSystemAdminDashboardStats);
router.get("/profile", saAuth, getCurrentSAProfile);

export default router;