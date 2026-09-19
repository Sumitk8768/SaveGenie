import Merchant from "../models/merchant.model.js";
import Coupon from "../models/coupon.model.js";
import slugify from "slugify";

// ─── CREATE MERCHANT ───────────────────────────────────────────────
export const createMerchant = async (req, res) => {
  try {
    const { name, website, logo, category } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Merchant name is required",
      });
    }

    // Generate slug for dedup check
    const slug = slugify(name, { lower: true, strict: true });

    // Dedup check — merchants are global, not per user
    let merchant = await Merchant.findOne({ slug });

    if (merchant) {
      // Merchant already exists — return it, don't create duplicate
      return res.status(200).json({
        message: "Merchant already exists",
        merchant,
      });
    }

    // Brand new merchant — create it
    merchant = await Merchant.create({
      name,
      slug,
      website,
      logo,
      category,
      // ❌ createdBy removed — merchants are global
    });

    return res.status(201).json({
      message: "Merchant created successfully",
      merchant,
    });

  } catch (error) {
    console.error("Create merchant error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── GET ALL MERCHANTS ─────────────────────────────────────────────
export const getMerchants = async (req, res) => {
  try {
    const query = { isActive: true };

    // Optional category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Optional search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const merchants = await Merchant.find(query).sort({ name: 1 });
    // ❌ Removed createdBy filter — merchants are global, all users see all merchants

    return res.status(200).json({
      message: "Merchants fetched successfully",
      merchants,
    });

  } catch (error) {
    console.error("Get merchants error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── GET SINGLE MERCHANT ───────────────────────────────────────────
export const getMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    // ❌ Removed createdBy check — any user can view any merchant

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
      });
    }

    return res.status(200).json({
      message: "Merchant fetched successfully",
      merchant,
    });

  } catch (error) {
    console.error("Get merchant error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── UPDATE MERCHANT (Admin only) ─────────────────────────────────
export const updateMerchant = async (req, res) => {
  try {
    const { name, website, logo, category, isActive } = req.body;

    // Build update object
    const updateData = { website, logo, category, isActive };

    // If name is being updated, regenerate slug
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      // ❌ Removed createdBy check — admin updates global merchant
      updateData,
      { new: true, runValidators: true }
    );

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
      });
    }

    return res.status(200).json({
      message: "Merchant updated successfully",
      merchant,
    });

  } catch (error) {
    console.error("Update merchant error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A merchant with this name already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── DELETE MERCHANT (Admin only) ─────────────────────────────────
export const deleteMerchant = async (req, res) => {
  try {
    // ✅ Check if any coupons reference this merchant before deleting
    const couponCount = await Coupon.countDocuments({
      merchantId: req.params.id,
    });

    if (couponCount > 0) {
      return res.status(409).json({
        message: `Cannot delete merchant — ${couponCount} coupon(s) are linked to it. Deactivate it instead.`,
      });
    }

    const merchant = await Merchant.findByIdAndDelete(req.params.id);
    // ❌ Removed createdBy check — admin deletes global merchant

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
      });
    }

    return res.status(200).json({
      message: "Merchant deleted successfully",
    });

  } catch (error) {
    console.error("Delete merchant error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};