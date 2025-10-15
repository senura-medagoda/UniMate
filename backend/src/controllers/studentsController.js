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
        const { s_fname, s_lname, s_email, s_password, s_uni, s_uniID} = req.body;
        
        // Sanitize and normalize the password to handle special characters
        const normalizedPassword = s_password.trim();
        
        const newStd = new Student({ 
            s_fname, 
            s_lname, 
            s_email, 
            s_password: normalizedPassword, 
            s_uni, 
            s_uniID
        });
        await newStd.save();
        res.status(201).json({ message: "Student added successfully..!" })
    } catch (error) {
        console.error("Error in addStudent : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateStudent(req, res) {
    try {
        const { 
            s_fname, 
            s_lname, 
            s_uni,
            s_uniID,
            s_NIC, 
            s_phone, 
            s_homeaddress, 
            s_gender, 
            s_faculty, 
            s_studyprogram, 
            s_dob, 
            s_id_document 
        } = req.body;
        
        // Build update object with only provided fields
        const updateData = {};
        if (s_fname !== undefined) updateData.s_fname = s_fname;
        if (s_lname !== undefined) updateData.s_lname = s_lname;
        if (s_uni !== undefined) updateData.s_uni = s_uni;
        if (s_uniID !== undefined) updateData.s_uniID = s_uniID;
        if (s_NIC !== undefined) updateData.s_NIC = s_NIC;
        if (s_phone !== undefined) updateData.s_phone = s_phone;
        if (s_homeaddress !== undefined) updateData.s_homeaddress = s_homeaddress;
        if (s_gender !== undefined) updateData.s_gender = s_gender;
        if (s_faculty !== undefined) updateData.s_faculty = s_faculty;
        if (s_studyprogram !== undefined) updateData.s_studyprogram = s_studyprogram;
        if (s_dob !== undefined) updateData.s_dob = s_dob;
        if (s_id_document !== undefined) updateData.s_id_document = s_id_document;
        
        // Set status to Pending after profile update
        updateData.s_status = "Pending";
        
        // Use authenticated student's ID from middleware
        const studentId = req.std._id;
        const updatedStd = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
        if (!updatedStd) return res.status(404).json({ message: "Student Not Found !" });
        
        // Return updated student data without password
        const { s_password, ...studentData } = updatedStd.toObject();
        res.status(200).json({ 
            message: "Student updated successfully", 
            student: studentData 
        });
    } catch (error) {
        console.error("Error in updateStudent : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getStudentByEmail(req, res) {
    try {
        const { email } = req.params;
        const student = await Student.findOne({ s_email: email });
        if (!student) return res.status(404).json({ message: "Student Not Found!" });
        
        // Return student data without password
        const { s_password, ...studentData } = student.toObject();
        res.status(200).json(studentData);
    } catch (error) {
        console.error("Error in getStudentByEmail : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteStudent(req, res) {
    try {
        const deletedStd = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStd) return res.status(404).json({ message: "Student Not Found!" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error in deleteStudent : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function verifyStudent(req, res) {
    try {
        const { email } = req.params;
        const updatedStudent = await Student.findOneAndUpdate(
            { s_email: email },
            { s_status: "Verified" },
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: "Student Not Found!" });
        res.status(200).json({ message: "Student verified successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error in verifyStudent : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function rejectStudent(req, res) {
    try {
        const { email } = req.params;
        const updatedStudent = await Student.findOneAndUpdate(
            { s_email: email },
            { s_status: "Rejected" },
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: "Student Not Found!" });
        res.status(200).json({ message: "Student rejected successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error in rejectStudent : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
