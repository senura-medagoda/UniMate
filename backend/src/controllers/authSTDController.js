import Student from "../models/Student.js";
import jwt from "jsonwebtoken"


export async function loginAuth(req, res) {
    const { s_email, s_password } = req.body;

    try {
         if (!s_email || !s_password) {
            return res.status(400).json({ message: "Insert email and password" })
        }
        
        const std = await Student.findOne({ s_email });
        
        if (!std) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        
        const isPasswordCorrect = await std.correctPassword(s_password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        const token = generateToken(std._id);
        res.status(200).json({id: std._id , email: std.s_email ,uid: std.s_uniID, token , message:"Login Success"});

    } catch (error) {
        console.error("Error in Login : ", error);
        res.status(500).json({ message: "Internal server error" });
    }


}

export async function currentUser(req,res){
    res.status(200).json(req.std)
}

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"})
}