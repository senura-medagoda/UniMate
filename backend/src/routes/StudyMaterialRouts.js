// SM - Study Material Routes
import express from "express";
import multer from "multer";
import { protect } from "../middleware/authSTDMW.js";
import { 
  uploadMaterial, 
  getMaterials, 
  getMaterialById, 
  searchMaterials, 
  getTopMaterials,
  likeMaterial,
  unlikeMaterial,
  addReview,
  updateRating, 
  updateMaterial,
  deleteMaterial,
  trackDownload,
  getMyUploads
} from "../controllers/StudyMaterialController.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post("/upload", protect, upload.any(), uploadMaterial);
router.get("/all", getMaterials);
router.get("/my-uploads", protect, getMyUploads);
router.get("/top", getTopMaterials);
router.get("/search", searchMaterials);
router.get("/:id", getMaterialById);
router.put("/:id", protect, updateMaterial);
router.post("/:id/like", likeMaterial);
router.post("/:id/unlike", unlikeMaterial);
router.post("/:id/review", addReview);
router.put("/:id/rating", updateRating);
router.post("/:id/download", trackDownload);
router.delete("/:id", deleteMaterial);

export default router;
