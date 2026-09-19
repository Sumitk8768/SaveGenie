import Coupon from "../models/coupon.model.js";
import Merchant from "../models/merchant.model.js";
import UserCoupon from "../models/userCoupons.model.js";
import slugify from "slugify";

// ─── CREATE COUPON ─────────────────────────────────────────────────
export const createCoupon = async (req, res) => {
  try {
    const {
      title,
      code,
      description,
      discountType,
      discountValue,
      merchantName,   // ✅ taking name instead of ID — auto create merchant
      website,        // optional merchant fields
      logo,
      category,
      expiryDate,
      isActive,
      source,         // "ocr_upload" | "manual"
    } = req.body;

    // ─── Validation ───────────────────────────────────────────────
    if (
      !title ||
      !code ||
      !discountType ||
      discountValue === undefined ||
      !merchantName ||
      !expiryDate
    ) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    if (!["percentage", "flat"].includes(discountType)) {
      return res.status(400).json({
        message: "Invalid discount type. Must be percentage or flat",
      });
    }

    if (discountValue < 0) {
      return res.status(400).json({
        message: "Discount value cannot be negative",
      });
    }

    if (discountType === "percentage" && discountValue > 100) {
      return res.status(400).json({
        message: "Percentage discount cannot exceed 100",
      });
    }

    // ─── Step 1: Auto create or reuse merchant ────────────────────
    const slug = slugify(merchantName, { lower: true, strict: true });

    let merchant = await Merchant.findOne({ slug });

    if (!merchant) {
      merchant = await Merchant.create({
        name: merchantName,
        slug,
        website: website || null,
        logo: logo || null,
        category: category || "other",
      });
    }

    // ─── Step 2: Dedup check on coupon ────────────────────────────
    let coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      merchantId: merchant._id,
    });

    if (!coupon) {
      // Brand new coupon — create it globally
      coupon = await Coupon.create({
        title,
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        merchantId: merchant._id,  // ✅ correct field name
        expiryDate,
        isActive: isActive ?? true,
        // ❌ no createdBy — coupons are global
      });
    }

    // ─── Step 3: Check if this user already owns this coupon ──────
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

    // ─── Step 4: Create ownership record ──────────────────────────
    const userCoupon = await UserCoupon.create({
      userId: req.user._id,
      couponId: coupon._id,
      source: source || "manual",          // ✅ valid enum value
      screenshot: req.file?.path || null,  // ✅ from multer if OCR upload
      acquiredAt: new Date(),              // ✅ Date.now was missing ()
      // defaults handle isUsed, usedAt, isListed, listingPrice
    });

    return res.status(201).json({
      message: "Coupon saved to your vault successfully",
      coupon,
      merchant,
      userCoupon,
    });

  } catch (error) {
    console.error("Create Coupon Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Coupon code already exists for this merchant",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── GET ALL COUPONS (Global catalog / Marketplace browse) ────────
export const getCoupons = async (req, res) => {
  try {
    const query = { isActive: true };

    // Filter by merchant
    if (req.query.merchantId) {
      query.merchantId = req.query.merchantId;
    }

    // Filter by discount type
    if (req.query.discountType) {
      query.discountType = req.query.discountType;
    }

    // Search by code or title
    if (req.query.search) {
      query.$or = [
        { code: { $regex: req.query.search, $options: "i" } },
        { title: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Only return non-expired coupons by default
    if (req.query.includeExpired !== "true") {
      query.expiryDate = { $gte: new Date() };
    }

    const coupons = await Coupon.find(query)
      .populate("merchantId", "name logo category website")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Coupons fetched successfully",
      count: coupons.length,
      coupons,
    });

  } catch (error) {
    console.error("Get Coupons Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── GET SINGLE COUPON ─────────────────────────────────────────────
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate("merchantId", "name logo category website");
    // ✅ fixed field name from merchant → merchantId

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      message: "Coupon fetched successfully",
      coupon,
    });

  } catch (error) {
    console.error("Get Coupon Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// ─── UPDATE COUPON (Admin only) ────────────────────────────────────
export const updateCoupon = async (req, res) => {
  try {
    const {
      title,
      description,
      discountType,
      discountValue,
      expiryDate,
      isActive,
    } = req.body;

    // ✅ code and merchantId are NOT updatable
    // changing these would break the dedup system
    // if code needs to change — delete and recreate

    if (discountType && !["percentage", "flat"].includes(discountType)) {
      return res.status(400).json({
        message: "Invalid discount type",
      });
    }

    if (discountValue !== undefined && discountValue < 0) {
      return res.status(400).json({
        message: "Discount value cannot be negative",
      });
    }

    if (discountType === "percentage" && discountValue > 100) {
      return res.status(400).json({
        message: "Percentage discount cannot exceed 100",
      });
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      // ✅ no createdBy check — admin updates global coupon
      // ✅ update reflects instantly for ALL users who have this coupon
      { title, description, discountType, discountValue, expiryDate, isActive },
      { new: true, runValidators: true }
    ).populate("merchantId", "name logo");

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });

  } catch (error) {
    console.error("Update Coupon Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── DELETE COUPON (Admin only) ────────────────────────────────────
export const deleteCoupon = async (req, res) => {
  try {
    // ✅ Safety check — are users referencing this coupon?
    const userCouponCount = await UserCoupon.countDocuments({
      couponId: req.params.id,
    });

    if (userCouponCount > 0) {
      return res.status(409).json({
        message: `Cannot delete — ${userCouponCount} user(s) have this coupon in their vault. Set isActive: false instead.`,
      });
    }

    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    // ✅ no createdBy check — admin deletes global coupon

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      message: "Coupon deleted successfully",
    });

  } catch (error) {
    console.error("Delete Coupon Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
