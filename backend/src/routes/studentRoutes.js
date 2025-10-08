import express from "express"
import { addStudent, deleteStudent, getAllStudents, getStudentById, getStudentByEmail, updateStudent, verifyStudent, rejectStudent } from "../controllers/studentsController.js";
import { protect } from "../middleware/authSTDMW.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/email/:email", getStudentByEmail);
router.get("/:id", getStudentById);
router.post("/",addStudent);
router.put("/update", protect, updateStudent); // Added authentication middleware
router.delete("/:id",deleteStudent);
router.put("/verify/:email", verifyStudent);
router.put("/reject/:email", rejectStudent);

export default router;
