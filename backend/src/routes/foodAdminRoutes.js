import express from 'express';
import { loginAdmin, getAdminProfile, getDashboardStats } from '../controllers/foodAdminController.js';
import { getAllVendors, toggleVendorStatus, approveVendor, rejectVendor, getVendorById, deleteVendor, addVendor } from '../controllers/vendorController.js';
import { getAllShops, getAllShopsForAdmin, getShopById, toggleShopStatus, toggleShopActiveStatus, approveShop, rejectShop, deleteShop, addShop, rateShop } from '../controllers/shopController.js';
import { adminAuth } from '../middleware/foodAdminAuth.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', adminAuth, getAdminProfile);
router.get('/dashboard/stats', adminAuth, getDashboardStats);

// Vendor management routes
router.get('/vendors', adminAuth, getAllVendors);
router.post('/vendors', adminAuth, addVendor);
router.get('/vendors/:vendorId', adminAuth, getVendorById);
router.put('/vendors/:vendorId/status', adminAuth, toggleVendorStatus);
router.put('/vendors/:vendorId/approve', adminAuth, approveVendor);
router.put('/vendors/:vendorId/reject', adminAuth, rejectVendor);
router.delete('/vendors/:vendorId', adminAuth, deleteVendor);

// Shop management routes
router.get('/shops', adminAuth, getAllShopsForAdmin);
router.post('/shops', adminAuth, addShop);
router.get('/shops/:shopId', adminAuth, getShopById);
router.put('/shops/:shopId/status', adminAuth, toggleShopActiveStatus);
router.put('/shops/:shopId/approve', adminAuth, approveShop);
router.put('/shops/:shopId/reject', adminAuth, rejectShop);
router.put('/shops/:shopId/rate', adminAuth, rateShop);
router.delete('/shops/:shopId', adminAuth, deleteShop);

// Notification routes (mock for now)
router.get('/notifications', adminAuth, (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

router.put('/notifications/:id/read', adminAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
});

export default router;
