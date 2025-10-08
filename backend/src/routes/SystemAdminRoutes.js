import express from "express"
import { addSA } from "../controllers/SystemAdminController.js"

const router = express.Router()

router.post("/",addSA);

export default router;