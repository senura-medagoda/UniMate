import express from "express";
import {
    registerVendor,
    loginVendor,
    getVendorProfile,
    updateVendorProfile,
    changePassword,
    getAllVendors,
    toggleVendorStatus,
    forgotPassword,
    resetPassword
} from "../controllers/vendorController.js";
import { vendorAuth, adminAuth } from "../middleware/vendorAuth.js";
import upload from "../middleware/M_multer.js";

const router = express.Router();

// Public routes
router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected vendor routes
router.get("/profile", vendorAuth, getVendorProfile);
router.put("/profile", vendorAuth, upload.single('profileImage'), updateVendorProfile);
router.put("/change-password", vendorAuth, changePassword);

// Admin routes
router.get("/all", adminAuth, getAllVendors);
router.put("/:vendorId/status", adminAuth, toggleVendorStatus);

export default router;

