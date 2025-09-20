import express from "express";
import {

    registerAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdminProfile,
    getDashboardStats,
    getAllVendors,
    getAllShops,
    toggleVendorStatus,
    toggleShopStatus,
    getVendorDetails,
    getShopDetails,
    approveShop,
    rejectShop,
    getPendingShops,
    approveVendor,
    rejectVendor,
    getPendingVendors,
  
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
} from "../controllers/adminController.js";
import {
    getAdminNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationService.js";
import { adminAuth, canManageVendors, canManageShops, canViewAnalytics } from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected admin routes
router.get("/profile", adminAuth, getAdminProfile);
router.put("/profile", adminAuth, updateAdminProfile);
router.get("/dashboard/stats", adminAuth, canViewAnalytics, getDashboardStats);

// Vendor management
router.get("/vendors", adminAuth, canManageVendors, getAllVendors);
router.get("/vendors/pending", adminAuth, canManageVendors, getPendingVendors);
router.get("/vendors/:vendorId", adminAuth, canManageVendors, getVendorDetails);
router.put("/vendors/:vendorId/status", adminAuth, canManageVendors, toggleVendorStatus);
router.put("/vendors/:vendorId/approve", adminAuth, canManageVendors, approveVendor);
router.put("/vendors/:vendorId/reject", adminAuth, canManageVendors, rejectVendor);

// Shop management
router.get("/shops", adminAuth, canManageShops, getAllShops);
router.get("/shops/pending", adminAuth, canManageShops, getPendingShops);
router.get("/shops/:shopId", adminAuth, canManageShops, getShopDetails);
router.put("/shops/:shopId/status", adminAuth, canManageShops, toggleShopStatus);
router.put("/shops/:shopId/approve", adminAuth, canManageShops, approveShop);
router.put("/shops/:shopId/reject", adminAuth, canManageShops, rejectShop);



//Tharuka
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
//Tharuka>>


// Notification routes
router.get("/notifications", adminAuth, async (req, res) => {
    try {
        const { limit = 50, skip = 0 } = req.query;
        const result = await getAdminNotifications(req.adminId, parseInt(limit), parseInt(skip));
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

router.put("/notifications/:notificationId/read", adminAuth, async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await markNotificationAsRead(notificationId, req.adminId);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error("Mark notification as read error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

router.put("/notifications/read-all", adminAuth, async (req, res) => {
    try {
        const result = await markAllNotificationsAsRead(req.adminId);
        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            data: result
        });
    } catch (error) {
        console.error("Mark all notifications as read error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});


export default router;
