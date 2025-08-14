import Student from "../models/Student.js";

export async function getAllStudents(req,res) {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.error("Error in getAllStudents : ",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getStudentById(req,res){
    try {
        const std = await Student.findById(req.params.id);
        if(!std) return res.status(404).json({message:"Student Not Found!"});
        res.status(201).json(std);
    } catch (error) {
        console.error("Error in getStudentById : ",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function addStudent(req,res) {
    try {
        const {s_fname, s_lname} = req.body;
        const newStd  = new Student({s_fname, s_lname})
        await newStd.save();
        res.status(201).json({message:"Student added successfully..!"})
    } catch (error) {
        console.error("Error in addStudent : ",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function updateStudent(req,res) {
    try {
        const {s_fname, s_lname} = req.body;
        const updatedStd =  await Student.findByIdAndUpdate(req.params.id, {s_fname, s_lname},{new:true});
        if(!updatedStd) return res.status(404).json({message: "Student Not Found !"});
        res.status(200).json({message: "Student updated successfully"});
    } catch (error) {
        console.error("Error in updateStudent : ",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteStudent(req,res) {
   try {
        const deletedStd = await Student.findByIdAndDelete(req.params.id);
        if(!deletedStd) return res.status(404).json({message:"Student Not Found!"});
        res.status(200).json({message: "Student deleted successfully"});
   } catch (error) {
        console.error("Error in updateStudent : ",error);
        res.status(500).json({message:"Internal server error"});
   }
}
