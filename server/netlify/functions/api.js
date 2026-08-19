import serverless from "serverless-http";
import app from "../../src/app.js";
import { connectDB } from "../../src/db.js";

// Establish the MongoDB connection when the function cold-starts.
// (mongoose caches the connection, so subsequent invocations reuse it.)
connectDB().catch((err) => console.error("MongoDB connection error:", err.message));

export const handler = serverless(app);
