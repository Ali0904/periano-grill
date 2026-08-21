import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import authMod from "./routes/auth.js";
import productMod from "./routes/products.js";
import orderMod from "./routes/orders.js";
import aiMod from "./routes/ai.js";

// Netlify's serverless runtime can resolve these local ESM modules to their
// module namespace object ({ default: Router }) instead of the Router itself.
// `??` handles both ESM (value) and CJS-interop ({ default }).
const authRoutes = authMod.default ?? authMod;
const productRoutes = productMod.default ?? productMod;
const orderRoutes = orderMod.default ?? orderMod;
const aiRoutes = aiMod.default ?? aiMod;

const app = express();

// Security headers
app.use(helmet());

// CORS — in production the API is served from the same Netlify domain,
// so CLIENT_ORIGIN is optional. Locally it falls back to the dev origin.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);

// Rate limiting (global): 100 requests / 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// Auth route gets a tighter limit to discourage brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many authentication attempts, please slow down." }
});

app.use(express.json({ limit: "10kb" }));

// Ensure the MongoDB connection is established (handles serverless cold starts
// and reconnects). A failed connection returns a clear 503 instead of crashing
// the whole function process.
app.use(async (req, res, next) => {
  const st = mongoose.connection.readyState;
  if (st === 1 || st === 2) return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ error: "Database unavailable", detail: err.message });
  }
});

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

// 404
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
