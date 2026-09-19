import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const couponRoutes = Router();

// Phase 1 — ship the product
couponRoutes.post("/", createCoupon);
couponRoutes.get("/", getCoupons);
couponRoutes.get("/:id", validateObjectId, getCoupon);  

// Phase 2 — when build admin panel
couponRoutes.patch("/:id", validateObjectId, isAdmin, updateCoupon);
couponRoutes.delete("/:id", validateObjectId, isAdmin, deleteCoupon);

export default couponRoutes;