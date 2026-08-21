import serverless from "serverless-http";
import appMod from "../../src/app.js";
import { connectDB } from "../../src/db.js";

// Interop guard: in Netlify's runtime the ESM default export can resolve to the
// module namespace object ({ default: app }) instead of the app itself.
const app = appMod.default ?? appMod;

// Establish the MongoDB connection when the function cold-starts.
// (mongoose caches the connection, so subsequent invocations reuse it.)
connectDB().catch((err) => console.error("MongoDB connection error:", err.message));

export const handler = serverless(app);
