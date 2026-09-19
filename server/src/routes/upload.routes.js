// src/routes/upload.routes.js
import { Router } from "express";
import upload from "../config/multer.js";
import {
  uploadScreenshot,
  extractOnly,
} from "../controllers/upload.controller.js";

const uploadRoutes = Router();

// Extract + Save in one step
uploadRoutes.post(
  "/screenshot",
  upload.single("screenshot"),
  uploadScreenshot
);

// Extract only — for preview before saving
uploadRoutes.post(
  "/extract",
  upload.single("screenshot"),
  extractOnly
);

export default uploadRoutes;