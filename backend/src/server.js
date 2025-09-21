import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

// Marketplace
import userRouter from "./routes/M_userRoute.js";
import productRouter from "./routes/M_productRoute.js";
import resellRouter from "./routes/M_resellRoute.js";
import cartRouter from "./routes/M_cartRoute.js";
import orderRouter from "./routes/M_orderRoute.js";

// Other subsystems
import studentRoutes from "./routes/studentRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import menuItemRoutes from "./routes/menuItemRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import BoardingPlaceRoutes from "./routes/BoardingPlaceRoutes.js";
import ownerAuthRoutes from "./routes/ownerAuthRoutes.js";
import BoardingBookingRoutes from "./routes/BoardingBookingRoutes.js";
import NotificationRoutes from "./routes/NotificationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import authSTD from "./routes/authSTD.js";
import studyMaterialRoutes from "./routes/StudyMaterialRouts.js";
import forumRoutes from "./routes/forumRoutes.js";
import materialRequestRoutes from "./routes/materialRequestRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB + Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// API endpoints
app.use("/api/students", studentRoutes);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/resell', resellRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.use('/api/vendor', vendorRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/menu', menuItemRoutes);
app.use('/api/admin', adminRoutes);

app.use("/api/boarding-places", BoardingPlaceRoutes);
app.use('/api/owner', ownerAuthRoutes);
app.use('/api/boarding-bookings', BoardingBookingRoutes);
app.use('/api/notifications', NotificationRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/stdlogin', authSTD);

app.use("/api/study-materials/requests", materialRequestRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/forum", forumRoutes);

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

// Start server
app.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
});
