import Router from "express"
import * as authController from "../controllers/auth.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/register", authController.registerController)
authRoutes.post("/login", authController.loginController)
authRoutes.post("/refreshToken", authController.refreshTokenController)
authRoutes.post("/logout", authController.logoutController)
authRoutes.post("/change-password", authMiddleware, authController.changePasswordController)
authRoutes.post("/verify-email", authController.verifyEmailController)
authRoutes.post("/forgot-password", authController.forgotPasswordController);
authRoutes.post("/reset-password", authController.resetPasswordController)


export default authRoutes;