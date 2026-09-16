import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const couponRoutes = Router();

couponRoutes.post("/", createCoupon);
couponRoutes.get("/", getCoupons);
couponRoutes.get("/:id", validateObjectId, getCoupon);
couponRoutes.put("/:id", validateObjectId, updateCoupon);
couponRoutes.delete("/:id", validateObjectId, deleteCoupon);

export default couponRoutes;