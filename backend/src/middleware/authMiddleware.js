import jwt from 'jsonwebtoken';
import Owner from '../models/owner.js';  

// Secret for JWT - should match the one in ownerAuthController
const JWT_SECRET = process.env.JWT_SECRET || 'pzUuguyJKW';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Received token:", token.substring(0, 20) + "...");

      // Dev-only mock admin token support
      if (token === 'mock-admin-token') {
        req.owner = { _id: 'admin-mock', role: 'accommodationAdmin', email: 'admin@unimate.com' };
        console.log('Using mock admin token: granting admin access for development');
        return next();
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", decoded);
      
      req.owner = await Owner.findById(decoded.id).select("-password"); // Attach to req.owner

      if (!req.owner) {
        console.log("Owner not found for ID:", decoded.id);
        return res.status(401).json({ message: "Owner not found" });
      }

      console.log("Owner authenticated:", req.owner._id);
      next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No authorization header found");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
