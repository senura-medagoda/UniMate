import express from 'express';
import { uploadImage, upload } from '../controllers/uploadController.js';

const router = express.Router();

// Upload single image
router.post('/image', upload.single('file'), uploadImage);

export default router;

