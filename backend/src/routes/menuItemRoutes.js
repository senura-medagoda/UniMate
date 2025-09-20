import express from "express";
import {
    createMenuItem,
    getVendorMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    toggleMenuItemPopular,
    getMenuItemsByShop,
    getMenuCategories,
    bulkUpdateMenuItems,
    getAllMenuItems
} from "../controllers/menuItemController.js";
import { vendorAuth, optionalVendorAuth } from "../middleware/vendorAuth.js";
import upload from "../middleware/M_multer.js";

const router = express.Router();

// Protected vendor routes
router.post("/create", vendorAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), createMenuItem);

router.get("/vendor", vendorAuth, getVendorMenuItems);
router.get("/vendor/:itemId", vendorAuth, getMenuItemById);
router.put("/vendor/:itemId", vendorAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), updateMenuItem);

router.delete("/vendor/:itemId", vendorAuth, deleteMenuItem);
router.put("/vendor/:itemId/availability", vendorAuth, toggleMenuItemAvailability);
router.put("/vendor/:itemId/popular", vendorAuth, toggleMenuItemPopular);
router.get("/vendor/categories", vendorAuth, getMenuCategories);
router.put("/vendor/bulk-update", vendorAuth, bulkUpdateMenuItems);

// Public routes
router.get("/all", optionalVendorAuth, getAllMenuItems);
router.get("/shop/:shopId", optionalVendorAuth, getMenuItemsByShop);

export default router;

