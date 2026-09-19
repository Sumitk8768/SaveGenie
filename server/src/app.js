import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── BODY PARSERS ─────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── HEALTH CHECK ─────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── ROUTES ───────────────────────────────────────────────────────
app.use("/api", indexRoutes);

// ─── 404 HANDLER ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

export default app;