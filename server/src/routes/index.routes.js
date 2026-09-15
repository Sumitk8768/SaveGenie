import Router from "express"
import authRoutes from "./auth.routes.js";
import couponRoutes from "./coupon.routes.js";
import authMidleware from "../middlewares/auth.middleware.js"

const indexRoutes = Router();

indexRoutes.use('/auth',authRoutes)
indexRoutes.use("/coupons", authMidleware ,couponRoutes);

indexRoutes.get("/check", authMidleware, (_req,res)=>{
    try {
        res.status(200).json({
        message: "working",
    })
    } catch (error) {
        res.status(500).json({
        message: "working",
        error,
    })
 }
})

export default indexRoutes;