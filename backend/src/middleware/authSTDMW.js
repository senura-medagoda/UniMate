import Student from "../models/Student.js";
import jwt from 'jsonwebtoken'

// JWT Secret with fallback
const JWT_SECRET = process.env.JWT_SECRET || 'pzUuguyJKW';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, JWT_SECRET)
            req.std = await Student.findById(decoded.id).select("-s_password")
            if (!req.std) {
                return res.status(401).json({message:"Student not found"})
            }
            return next();
        }
         catch (error) {
            console.error("Token verification failed : " ,error)
            return res.status(401).json({message:"Not authorized, Token failed"})
        }


    }
    return res.status(401).json({message:"Not authorized, Token failed"})
}

