import express from "express";
import {
    createShop,
    getShopDetails,
    updateShopDetails,
    updateOpeningHours,
    toggleShopStatus,
    getShopStatistics,
    getAllShops,
    getShopById
} from "../controllers/shopController.js";
import { vendorAuth, optionalVendorAuth } from "../middleware/vendorAuth.js";
import upload from "../middleware/M_multer.js";

// Middleware to handle multer errors
const handleMulterError = (error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: "File too large",
            error: "Image file must be smaller than 10MB"
        });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            success: false,
            message: "Too many files",
            error: "Maximum 1 logo and 10 additional images allowed"
        });
    }
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: "Invalid file type",
            error: "Only image files (JPG, PNG, WebP) are allowed"
        });
    }
    next(error);
};

const router = express.Router();

// Protected vendor routes
router.post("/create", vendorAuth, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), handleMulterError, createShop);

router.get("/details", vendorAuth, getShopDetails);
router.put("/details", vendorAuth, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), handleMulterError, updateShopDetails);

router.put("/opening-hours", vendorAuth, updateOpeningHours);
router.put("/toggle-status", vendorAuth, toggleShopStatus);
router.get("/statistics", vendorAuth, getShopStatistics);

// Public routes
router.get("/all", optionalVendorAuth, getAllShops);
router.get("/:shopId", optionalVendorAuth, getShopById);

export default router;

