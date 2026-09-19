import cloudinary from "../config/cloudinary.js";
import { extractCouponFromImage } from "../services/ocr.service.js";
import Coupon from "../models/coupon.model.js";
import Merchant from "../models/merchant.model.js";
import UserCoupon from "../models/userCoupons.model.js";
import slugify from "slugify";

export const uploadScreenshot = async (req, res) => {
  try {
    // ─── Step 1: Check file was uploaded ──────────────────
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const imageUrl = req.file.path;  // Cloudinary URL from multer

    // ─── Step 2: Extract coupon data via GPT-4o ───────────
    let extracted;

    try {
      extracted = await extractCouponFromImage(imageUrl);
    } catch (ocrError) {
      console.error("OCR extraction failed:", {
        status: ocrError.status,
        code: ocrError.code,
        message: ocrError.message,
      });

      // OCR failed — delete the uploaded image from Cloudinary
      await cloudinary.uploader.destroy(req.file.filename);

      const serviceUnavailable = [401, 429].includes(ocrError.status);

      return res.status(serviceUnavailable ? 503 : 422).json({
        message: serviceUnavailable
          ? "OCR service is temporarily unavailable. Please check the OpenAI account and try again."
          : "Could not extract coupon details from image. Please try a clearer screenshot.",
      });
    }

    // ─── Step 3: Validate extracted data ──────────────────
    if (!extracted.merchantName || !extracted.discountValue) {
      await cloudinary.uploader.destroy(req.file.filename);

      return res.status(422).json({
        message: "Could not find valid coupon details in this image.",
        extracted,
      });
    }

    // ─── Step 4: Auto create or reuse merchant ────────────
    const slug = slugify(extracted.merchantName, {
      lower: true,
      strict: true,
    });

    let merchant = await Merchant.findOne({ slug });

    if (!merchant) {
      merchant = await Merchant.create({
        name: extracted.merchantName,
        slug,
        category: extracted.category || "other",
      });
    }

    // ─── Step 5: Dedup check on coupon ────────────────────
    let coupon = null;

    if (extracted.code) {
      coupon = await Coupon.findOne({
        code: extracted.code.toUpperCase(),
        merchantId: merchant._id,
      });
    }

    if (!coupon) {
      coupon = await Coupon.create({
        title: extracted.description || `${extracted.merchantName} offer`,
        code: extracted.code?.toUpperCase() || `AUTO-${Date.now()}`,
        description: extracted.description,
        discountType: extracted.discountType || "flat",
        discountValue: extracted.discountValue,
        merchantId: merchant._id,
        expiryDate: extracted.expiryDate
          ? new Date(extracted.expiryDate)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // default 30 days
        isActive: true,
      });
    }

    // ─── Step 6: Check if user already owns this coupon ───
    const alreadyOwns = await UserCoupon.findOne({
      userId: req.user._id,
      couponId: coupon._id,
    });

    if (alreadyOwns) {
      return res.status(409).json({
        message: "You already have this coupon in your vault",
        userCoupon: alreadyOwns,
      });
    }

    // ─── Step 7: Create ownership record ──────────────────
    const userCoupon = await UserCoupon.create({
      userId: req.user._id,
      couponId: coupon._id,
      source: "ocr_upload",
      screenshot: imageUrl,
      acquiredAt: new Date(),
    });

    return res.status(201).json({
      message: "Coupon extracted and saved successfully",
      extracted,
      coupon,
      merchant,
      userCoupon,
    });

  } catch (error) {
    console.error("Upload Screenshot Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── EXTRACT ONLY (no save) ───────────────────────────────
// For showing preview before user confirms save
export const extractOnly = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const imageUrl = req.file.path;

    let extracted;

    try {
      extracted = await extractCouponFromImage(imageUrl);
    } catch (ocrError) {
      console.error("OCR extraction failed:", {
        status: ocrError.status,
        code: ocrError.code,
        message: ocrError.message,
      });

      await cloudinary.uploader.destroy(req.file.filename);

      const serviceUnavailable = [401, 429].includes(ocrError.status);

      return res.status(serviceUnavailable ? 503 : 422).json({
        message: serviceUnavailable
          ? "OCR service is temporarily unavailable. Please check the OpenAI account and try again."
          : "Could not extract coupon details from image.",
      });
    }

    return res.status(200).json({
      message: "Coupon details extracted successfully",
      extracted,
      imageUrl,
    });

  } catch (error) {
    console.error("Extract Only Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
