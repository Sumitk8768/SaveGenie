import { Router } from "express";                        // ✅ fixed import
import * as authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRoutes = Router();

// Public routes
authRoutes.post("/register", authController.registerController);
authRoutes.post("/login", authController.loginController);
authRoutes.post("/refresh-token", authController.refreshTokenController);
authRoutes.post("/verify-email", authController.verifyEmailController);
authRoutes.post("/forgot-password", authController.forgotPasswordController);
authRoutes.post("/reset-password", authController.resetPasswordController);

// Protected routes
authRoutes.post("/logout", authMiddleware, authController.logoutController);           // ✅ added authMiddleware
authRoutes.post("/change-password", authMiddleware, authController.changePasswordController);

export default authRoutes;