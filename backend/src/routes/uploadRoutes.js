import express from "express";
import { uploadImage, upload } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/image", upload.single("file"), uploadImage);

export default router;
