import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";

const couponRoutes = Router();

couponRoutes.post("/", createCoupon);
couponRoutes.get("/", getCoupons);
couponRoutes.get("/:id", getCoupon);
couponRoutes.put("/:id", updateCoupon);
couponRoutes.delete("/:id", deleteCoupon);

export default couponRoutes;