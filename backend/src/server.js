import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/M_userRoute.js";
import productRouter from "./routes/M_productRoute.js";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import BoardingPlaceRoutes from "./routes/BoardingPlaceRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001

connectDB()


connectCloudinary();

// CORS 
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ADD THIS LINE



// API endpoints
app.use("/api/students", studentRoutes);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use("/api/boarding-places", BoardingPlaceRoutes);


app.listen(PORT, () => {
    console.log("Server started on PORT: ", PORT);
});