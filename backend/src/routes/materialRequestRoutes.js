import express from "express";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  fulfillRequest,
  getRequestsByUser,
  deleteRequest,
  updateRequest,
  getRequestStats
} from "../controllers/MaterialRequestController.js";

const router = express.Router();

// Create new request
router.post("/", createRequest);

// Get all requests (with optional filters)
router.get("/", getAllRequests);

// Get request statistics
router.get("/stats", getRequestStats);

// Get request by ID
router.get("/:id", getRequestById);

// Get requests by user
router.get("/user/:userId", getRequestsByUser);

// Fulfill request
router.put("/:id/fulfill", fulfillRequest);

// Update request
router.put("/:id", updateRequest);

// Delete request
router.delete("/:id", deleteRequest);

export default router;
