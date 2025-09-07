import express from 'express'
import { loginAuth, currentUser } from '../controllers/authSTDController.js'
import { protect } from '../middleware/authSTDMW.js'
import jwt from "jsonwebtoken"

const router = express.Router()

router.post('/login', loginAuth)
router.get("/me", protect, currentUser)



export default router;