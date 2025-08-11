export function getAllStudents(req,res) {
    res.status(200).send("You just fetch the students");
}

export function addStudent  (req,res) {
    res.status(201).json({message: "Student added successfully"});
}

export function updateStudent(req,res) {
    res.status(200).json({message: "Student updated successfully"});
}

export function deleteStudent(req,res) {
    res.status(200).json({message: "Student deleted successfully"});
}
