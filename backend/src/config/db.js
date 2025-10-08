import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Try Atlas first, fallback to local MongoDB
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/unimate';
        await mongoose.connect(mongoURI);
        console.log("MONGODB CONNECTED SUCCESSFULLY..!");
    } catch (error) {
        console.error("Error connecting to mongo DB : ",error);
        console.log("💡 If using MongoDB Atlas, make sure your IP is whitelisted");
        console.log("💡 Your current IP: 123.231.125.39");
        console.log("💡 Add this IP to your Atlas Network Access whitelist");
        process.exit(1)
    }
}