import express from 'express';
import { createCODOrder, createStripeCheckout, confirmStripeOrder, getOrdersByStudent, listAllOrders, adminUpdateOrderStatus, requestCancelOrder, adminResolveCancellation, deleteStudentOrder, adminDeleteOrder, generateOrderReport, createTestOrder, createTestStripeOrder, createTestCODOrder, createMultipleTestOrders, getAllOrdersDebug, simulateOrderProgression, createFallbackOnlineOrder, getVendorOrders, markOrderAsShipped, vendorUpdateOrderStatus } from '../controllers/FoodOrderController.js';
import { protect } from '../middleware/authSTDMW.js';
import { adminAuth } from '../middleware/foodAdminAuth.js';
import { vendorAuth } from '../middleware/vendorAuth.js';

const router = express.Router();

router.post('/cod', protect, createCODOrder);
router.post('/stripe/create-session', protect, createStripeCheckout);
router.post('/stripe/confirm', protect, confirmStripeOrder);
router.post('/stripe/fallback', protect, createFallbackOnlineOrder);
router.get('/student', protect, getOrdersByStudent);
router.get('/student/debug', protect, getAllOrdersDebug);
router.post('/test', protect, createTestOrder);
router.post('/test-stripe', protect, createTestStripeOrder);
router.post('/test-cod', protect, createTestCODOrder);
router.post('/test-multiple', protect, createMultipleTestOrders);
router.post('/:orderId/simulate-progress', protect, simulateOrderProgression);
router.post('/:orderId/cancel', protect, requestCancelOrder);
router.delete('/:orderId', protect, deleteStudentOrder);

// admin endpoints
router.get('/', adminAuth, listAllOrders);
router.put('/:orderId/status', adminAuth, adminUpdateOrderStatus);
router.post('/:orderId/cancel/resolve', adminAuth, adminResolveCancellation);
router.delete('/admin/:orderId', adminAuth, adminDeleteOrder);
router.post('/report', adminAuth, generateOrderReport);

// vendor endpoints
router.get('/vendor', vendorAuth, getVendorOrders);
router.put('/vendor/:orderId/status', vendorAuth, vendorUpdateOrderStatus);
router.post('/vendor/:orderId/ship', vendorAuth, markOrderAsShipped);

export default router;


