import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/M_userRoute.js";
import productRouter from "./routes/M_productRoute.js";

import vendorRoutes from "./routes/vendorRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import menuItemRoutes from "./routes/menuItemRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import BoardingPlaceRoutes from "./routes/BoardingPlaceRoutes.js";
import ownerAuthRoutes from './routes/ownerAuthRoutes.js';
import BoardingBookingRoutes from './routes/BoardingBookingRoutes.js';
import NotificationRoutes from './routes/NotificationRoutes.js';
import jobRoutes from './routes/jobRoutes.js'
import authSTD from './routes/authSTD.js'



// Routes

import studyMaterialRoutes from "./routes/StudyMaterialRouts.js";
import forumRoutes from "./routes/forumRoutes.js";
//import adminRoutes from "./routes/adminRoutes.js";
import materialRequestRoutes from "./routes/materialRequestRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB()


connectCloudinary();

// CORS 
//app.use(cors());
app.use(cors({
  origin: "http://localhost:5173", // Your Vite frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // If using cookies/sessions
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ADD THIS LINE

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));



// API endpoints
app.use("/api/students", studentRoutes);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

app.use('/api/vendor', vendorRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/menu', menuItemRoutes);
app.use('/api/admin', adminRoutes);

app.use("/api/boarding-places", BoardingPlaceRoutes);
app.use('/api/owner', ownerAuthRoutes);
app.use('/api/boarding-bookings', BoardingBookingRoutes);
app.use('/api/notifications', NotificationRoutes);
app.use('/api/job',jobRoutes)
app.use('/api/stdlogin',authSTD)

app.use("/api/study-materials/requests", materialRequestRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
    console.log("Server started on PORT: ", PORT);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
