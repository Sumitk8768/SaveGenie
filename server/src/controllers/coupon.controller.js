import mongoose from "mongoose";
import Coupon from "../models/coupon.model.js";

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

const validateCouponPayload = (payload, { partial = false } = {}) => {
  const errors = {};
  const requiredFields = ["title", "code", "discountType", "discountValue", "merchant", "expiryDate"];

  if (!partial) {
    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
        errors[field] = "This field is required";
      }
    }
  }
  if (payload.title !== undefined && (typeof payload.title !== "string" || !payload.title.trim())) {
    errors.title = "Title must be a non-empty string";
  }
  if (payload.code !== undefined && (typeof payload.code !== "string" || !payload.code.trim())) {
    errors.code = "Code must be a non-empty string";
  }
  if (payload.description !== undefined && typeof payload.description !== "string") {
    errors.description = "Description must be a string";
  }
  if (payload.discountType !== undefined && !["percentage", "flat"].includes(payload.discountType)) {
    errors.discountType = "Discount type must be percentage or flat";
  }
  if (payload.discountValue !== undefined &&
      (typeof payload.discountValue !== "number" || !Number.isFinite(payload.discountValue) || payload.discountValue < 0)) {
    errors.discountValue = "Discount value must be a non-negative number";
  }
  if (payload.discountType === "percentage" && payload.discountValue > 100) {
    errors.discountValue = "Percentage discount cannot exceed 100";
  }
  if (payload.merchant !== undefined && !isValidObjectId(payload.merchant)) {
    errors.merchant = "Merchant must be a valid id";
  }
  if (payload.expiryDate !== undefined) {
    const expiryDate = new Date(payload.expiryDate);
    if (Number.isNaN(expiryDate.getTime())) {
      errors.expiryDate = "Expiry date must be a valid date";
    } else if (expiryDate <= new Date()) {
      errors.expiryDate = "Expiry date must be in the future";
    }
  }
  if (payload.isActive !== undefined && typeof payload.isActive !== "boolean") {
    errors.isActive = "isActive must be a boolean";
  }
  return errors;
};

const sendError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: "A coupon with this code already exists for the merchant" });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: "Internal server error" });
};

const requireValidId = (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400).json({ message: "Invalid coupon id" });
    return false;
  }
  return true;
};

export const createCoupon = async (req, res) => {
  const errors = validateCouponPayload(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: "Invalid coupon data", errors });
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json(coupon);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json(coupons);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getCoupon = async (req, res) => {
  if (!requireValidId(req, res)) return;
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    return res.status(200).json(coupon);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateCoupon = async (req, res) => {
  if (!requireValidId(req, res)) return;
  const errors = validateCouponPayload(req.body, { partial: true });
  if (Object.keys(errors).length) return res.status(400).json({ message: "Invalid coupon data", errors });
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    return res.status(200).json(coupon);
  } catch (error) {
    return sendError(res, error);
  }
};

export const deleteCoupon = async (req, res) => {
  if (!requireValidId(req, res)) return;
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    return res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    return sendError(res, error);
  }
};
