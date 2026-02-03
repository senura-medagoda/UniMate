import mongoose from "mongoose";

let cachedConnection = null;

export const connectDB = async () => {
    if (cachedConnection) {
        console.log("Using cached MongoDB connection");
        return cachedConnection;
    }

    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimate';

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        cachedConnection = conn;
        console.log("MONGODB CONNECTED SUCCESSFULLY..!");
        return conn;
    } catch (error) {
        console.error(`Error connecting to mongo DB: ${error.message}`);
        // Do not exit process in serverless environment
        throw new Error('Database connection failed');
    }
}