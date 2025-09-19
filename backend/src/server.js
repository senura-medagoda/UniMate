import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

// Routes
import studentRoutes from "./routes/studentRoutes.js";
import studyMaterialRoutes from "./routes/StudyMaterialRouts.js";
import forumRoutes from "./routes/forumRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import materialRequestRoutes from "./routes/materialRequestRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/students", studentRoutes);
app.use("/api/study-materials/requests", materialRequestRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/admin", adminRoutes);

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

app.listen(PORT, () => {
  console.log(`✅ Server started on PORT: ${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, "uploads")}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
});
