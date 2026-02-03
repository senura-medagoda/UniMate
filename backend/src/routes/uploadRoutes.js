import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import upload from "../middleware/M_multer.js";

const router = express.Router();

router.post("/image", upload.single("file"), uploadImage);

export default router;
