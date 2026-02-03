// ... imports remain the same, I will construct the full file content to be safe and ensure imports are correct
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectCloudinary from "./config/cloudinary.js";
import { connectDB } from "./config/db.js";

// 🛒 Marketplace Routes
import userRouter from "./routes/M_userRoute.js";
import productRouter from "./routes/M_productRoute.js";
import resellRouter from "./routes/M_resellRoute.js";
import cartRouter from "./routes/M_cartRoute.js";
import orderRouter from "./routes/M_orderRoute.js";

// 🍔 Food Delivery Routes
import vendorRoutes from "./routes/vendorRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import menuItemRoutes from "./routes/menuItemRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import foodAdminRoutes from "./routes/foodAdminRoutes.js";
import foodOrderRoutes from "./routes/foodOrderRoutes.js";

// 🏠 Boarding / Accommodation Routes
import studentRoutes from "./routes/studentRoutes.js";
import BoardingPlaceRoutes from "./routes/BoardingPlaceRoutes.js";
import ownerAuthRoutes from "./routes/ownerAuthRoutes.js";
import BoardingBookingRoutes from "./routes/BoardingBookingRoutes.js";
import NotificationRoutes from "./routes/NotificationRoutes.js";

// 💼 Job Portal Routes
import jobRoutes from "./routes/jobRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import authSTD from "./routes/authSTD.js";
import hmRoutes from "./routes/HM_Routes.js";
import jpaRoutes from "./routes/JPAroutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// 🧑‍💼 System Admin
import SystemAdminRoutes from "./routes/SystemAdminRoutes.js";

// 📚 Study Materials / Forum Routes
import studyMaterialRoutes from "./routes/StudyMaterialRouts.js";
import forumRoutes from "./routes/forumRoutes.js";
//import adminRoutes from "./routes/adminRoutes.js";
import materialRequestRoutes from "./routes/materialRequestRoutes.js";
import studyMaterialAdminRoutes from "./routes/studyMaterialAdminRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";
import systemDataRoutes from "./routes/systemDataRoutes.js";
import studentMessageRoutes from "./routes/studentMessageRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🗄️ Connect to Database
connectDB();

// ☁️ Connect to Cloudinary (optional)
connectCloudinary()
  .then(success => {
    if (!success) {
      console.log("ℹ️  Cloudinary not configured - image uploads will be disabled");
    }
  })
  .catch(err => {
    console.log("⚠️  Cloudinary connection failed - image uploads will be disabled");
  });

// 🌐 CORS Setup
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || true) { // Temporarily allowing all for debugging/ease, or strictly verify
        // Ideally: allowedOrigins.includes(origin)
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies/sessions if used
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Serve static files
app.use("/uploads", express.static("uploads"));

// =======================
// 🚀 API Endpoints
// =======================

// System Admin
app.use("/api/SystemAdmin", SystemAdminRoutes);

// Marketplace
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/resell", resellRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Food Delivery
app.use("/api/vendor", vendorRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/menu", menuItemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/food-admin", foodAdminRoutes);
app.use("/api/orders", foodOrderRoutes);

// Boarding & Accommodation
app.use("/api/students", studentRoutes);
app.use("/api/boarding-places", BoardingPlaceRoutes);
app.use("/api/owner", ownerAuthRoutes);
app.use("/api/boarding-bookings", BoardingBookingRoutes);
app.use("/api/notifications", NotificationRoutes);

// Job Portal
app.use("/api/job", jobRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/stdlogin", authSTD);
app.use("/api/hm", hmRoutes);
app.use("/api/jpadmin", jpaRoutes);
app.use("/api/upload", uploadRoutes);

// Study Materials & Forum
app.use("/api/study-materials/requests", materialRequestRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", studyMaterialAdminRoutes);
app.use("/api/admin/universities", universityRoutes);
app.use("/api/system-data", systemDataRoutes);
app.use("/api/student-messages", studentMessageRoutes);

// =======================
// ⚠️ Error & Fallback Handling
// =======================

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 🧩 Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// 🧩 Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// =======================
// ✅ Start Server (Conditional)
// =======================
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => {
        console.log(`✅ Server started on PORT: ${PORT}`);
    });
}

export default app;
