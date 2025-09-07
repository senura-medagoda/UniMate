import Student from "../models/Student.js";
import bcrypt from "bcryptjs";

export async function getAllStudents(req, res) {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.error("Error in getAllStudents : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getStudentById(req, res) {
    try {
        const std = await Student.findById(req.params.id);
        if (!std) return res.status(404).json({ message: "Student Not Found!" });
        res.status(201).json(std);
    } catch (error) {
        console.error("Error in getStudentById : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function addStudent(req, res) {
    try {
        const { s_fname, s_lname, s_email, s_password, s_uni, s_uniID, s_NIC, s_phone } = req.body;
        const hashedPassword = await bcrypt.hash(s_password, 12);
        const newStd = new Student({ s_fname, s_lname, s_email, s_password: hashedPassword, s_uni, s_uniID, s_NIC, s_phone });
        await newStd.save();
        res.status(201).json({ message: "Student added successfully..!" })
    } catch (error) {
        console.error("Error in addStudent : ", error);
        res.status(500).json({ message: "Internal server errorse" });
    }
}

export async function updateStudent(req, res) {
    try {
        const { s_fname, s_lname } = req.body;
        const updatedStd = await Student.findByIdAndUpdate(req.params.id, { s_fname, s_lname }, { new: true });
        if (!updatedStd) return res.status(404).json({ message: "Student Not Found !" });
        res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
        console.error("Error in updateStudent : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteStudent(req, res) {
    try {
        const deletedStd = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStd) return res.status(404).json({ message: "Student Not Found!" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error in updateStudent : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
