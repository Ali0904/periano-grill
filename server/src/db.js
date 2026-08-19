import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/periano-grill";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}
