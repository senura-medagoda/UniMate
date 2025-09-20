import express from 'express';
import { registerOwner, loginOwner } from '../controllers/ownerAuthController.js';

const router = express.Router();

router.post('/signup', registerOwner); 
router.post('/login', loginOwner);    

export default router;
