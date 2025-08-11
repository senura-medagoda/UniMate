import express from "express";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use("/api/students", studentRoutes);

app.listen(5001, () => {
    console.log("Server started on PORT: 5001");
});