import Router from "express"
import authRoutes from "./auth.routes.js";
import couponRoutes from "./coupon.routes.js";
import authMiddleware from "../middlewares/auth.middleware.js"
import merchantRoutes from "./merchant.routes.js";

const indexRoutes = Router();

indexRoutes.use('/auth',authRoutes)
indexRoutes.use("/coupons", authMiddleware ,couponRoutes);
indexRoutes.use("/merchants", authMiddleware, merchantRoutes);

export default indexRoutes;