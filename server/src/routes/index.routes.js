import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authRoutes from "./auth.routes.js";
import couponRoutes from "./coupon.routes.js";
import merchantRoutes from "./merchant.routes.js";
import userCouponRoutes from "./userCoupon.routes.js";  
import uploadRoutes from "./upload.routes.js";

const indexRoutes = Router();

// Public routes 
indexRoutes.use("/auth", authRoutes);

// Protected routes — auth applied once here at index level
indexRoutes.use("/coupons", authMiddleware, couponRoutes);
indexRoutes.use("/merchants", authMiddleware, merchantRoutes);
indexRoutes.use("/user-coupons", authMiddleware, userCouponRoutes);  
indexRoutes.use("/upload", authMiddleware, uploadRoutes)

export default indexRoutes;