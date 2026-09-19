import { Router } from "express";
import * as merchantController from "../controllers/merchant.controller.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import { isAdmin } from "../middlewares/auth.middleware.js";  

const merchantRoutes = Router();

// Any authenticated user
merchantRoutes.post("/", merchantController.createMerchant);
merchantRoutes.get("/", merchantController.getMerchants);
merchantRoutes.get("/:id", validateObjectId, merchantController.getMerchant);

// Admin only
merchantRoutes.patch("/:id", validateObjectId, isAdmin, merchantController.updateMerchant);  
merchantRoutes.delete("/:id", validateObjectId, isAdmin, merchantController.deleteMerchant);  

export default merchantRoutes;