import { Router } from "express";                       
import validateObjectId from "../middlewares/validateObjectId.js"; 
import {
  getMyCoupons,
  getMyCoupon,
  getExpiringCoupons,
  getCouponsByMerchant,
  markAsUsed,
  listOnMarketplace,
  unlistFromMarketplace,
  deleteFromVault,
} from "../controllers/userCoupon.controller.js";

const userCouponRoutes = Router();

userCouponRoutes.get("/", getMyCoupons);
userCouponRoutes.get("/expiring", getExpiringCoupons);
userCouponRoutes.get("/merchant/:merchantId", validateObjectId, getCouponsByMerchant); 
userCouponRoutes.get("/:id", validateObjectId, getMyCoupon);                            
userCouponRoutes.patch("/:id/use", validateObjectId, markAsUsed);                       
userCouponRoutes.patch("/:id/list", validateObjectId, listOnMarketplace);               
userCouponRoutes.patch("/:id/unlist", validateObjectId, unlistFromMarketplace);         
userCouponRoutes.delete("/:id", validateObjectId, deleteFromVault);                     

export default userCouponRoutes;