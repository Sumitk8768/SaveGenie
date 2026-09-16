import { Router } from "express";
import * as merchantController from "../controllers/merchant.controller.js"
import validateObjectId from "../middlewares/validateObjectId.js";

const merchantRoutes = Router()

merchantRoutes.post("/", merchantController.createMerchant);
merchantRoutes.get("/", merchantController.getMerchants);
merchantRoutes.get("/:id", validateObjectId, merchantController.getMerchant);
merchantRoutes.put("/:id", validateObjectId, merchantController.updateMerchant);
merchantRoutes.delete("/:id", validateObjectId, merchantController.deleteMerchant);


export default merchantRoutes;