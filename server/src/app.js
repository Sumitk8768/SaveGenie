import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import indexRoutes from "./routes/index.routes.js";


const app = express();
dotenv.config()
app.use(express.json());
app.use(cookieParser())

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api",indexRoutes)

export default app;
