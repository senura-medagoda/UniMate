import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  // ✅ Don't fallback to localhost in production / Railway
  if (!mongoURI) {
    throw new Error("MONGO_URI is missing (Railway Variables not set)");
  }

  // ✅ Reuse connection
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoURI, {
        serverSelectionTimeoutMS: 10000
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected");
  return cached.conn;
};
