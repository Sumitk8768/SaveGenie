import UserCoupon from "../models/userCoupons.model.js";
import Coupon from "../models/coupon.model.js";

// ─── GET ALL MY COUPONS ────────────────────────────────────────────
export const getMyCoupons = async (req, res) => {
  try {
    const query = { userId: req.user._id };

    // Filter by usage status
    if (req.query.isUsed !== undefined) {
      query.isUsed = req.query.isUsed === "true";
    }

    // Filter by listed status
    if (req.query.isListed !== undefined) {
      query.isListed = req.query.isListed === "true";
    }

    // Filter by source
    if (req.query.source) {
      query.source = req.query.source;
    }

    const userCoupons = await UserCoupon.find(query)
      .populate({
        path: "couponId",
        populate: {
          path: "merchantId",
          select: "name logo category website",
        },
      })
      .sort({ acquiredAt: -1 });

    // Filter out any userCoupons where couponId failed to populate
    // This can happen if a coupon was hard deleted from the global collection
    const validCoupons = userCoupons.filter((uc) => uc.couponId !== null);

    return res.status(200).json({
      message: "Coupons fetched successfully",
      count: validCoupons.length,
      coupons: validCoupons,
    });

  } catch (error) {
    console.error("Get My Coupons Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── GET SINGLE MY COUPON ──────────────────────────────────────────
export const getMyCoupon = async (req, res) => {
  try {
    const userCoupon = await UserCoupon.findOne({
      _id: req.params.id,
      userId: req.user._id,   // ✅ ownership check — user can only see their own
    }).populate({
      path: "couponId",
      populate: {
        path: "merchantId",
        select: "name logo category website",
      },
    });

    if (!userCoupon) {
      return res.status(404).json({
        message: "Coupon not found in your vault",
      });
    }

    return res.status(200).json({
      message: "Coupon fetched successfully",
      coupon: userCoupon,
    });

  } catch (error) {
    console.error("Get My Coupon Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── GET EXPIRING SOON ─────────────────────────────────────────────
export const getExpiringCoupons = async (req, res) => {
  try {
    // Default — expiring within 3 days
    // Allow custom days via query param
    const days = parseInt(req.query.days) || 3;
    const expiryThreshold = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    );

    const userCoupons = await UserCoupon.find({
      userId: req.user._id,
      isUsed: false,
    }).populate({
      path: "couponId",
      match: {
        expiryDate: { $lte: expiryThreshold },  // ✅ filter during populate
        isActive: true,
      },
      populate: {
        path: "merchantId",
        select: "name logo category",
      },
    });

    // Filter out non-matching populated results
    const expiring = userCoupons.filter((uc) => uc.couponId !== null);

    return res.status(200).json({
      message: "Expiring coupons fetched successfully",
      count: expiring.length,
      coupons: expiring,
    });

  } catch (error) {
    console.error("Get Expiring Coupons Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── GET COUPONS BY MERCHANT (Chrome Extension) ────────────────────
export const getCouponsByMerchant = async (req, res) => {
  try {
    const { merchantId } = req.params;

    const userCoupons = await UserCoupon.find({
      userId: req.user._id,
      isUsed: false,
    }).populate({
      path: "couponId",
      match: {
        merchantId,          // ✅ filter by merchant during populate
        isActive: true,
        expiryDate: { $gte: new Date() },  // only valid coupons
      },
      populate: {
        path: "merchantId",
        select: "name logo category website",
      },
    });

    // Filter out non-matching
    const merchantCoupons = userCoupons.filter((uc) => uc.couponId !== null);

    return res.status(200).json({
      message: "Merchant coupons fetched successfully",
      count: merchantCoupons.length,
      coupons: merchantCoupons,
    });

  } catch (error) {
    console.error("Get Coupons By Merchant Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── MARK COUPON AS USED ───────────────────────────────────────────
export const markAsUsed = async (req, res) => {
  try {
    const userCoupon = await UserCoupon.findOne({
      _id: req.params.id,
      userId: req.user._id,   // ✅ ownership check
    });

    if (!userCoupon) {
      return res.status(404).json({
        message: "Coupon not found in your vault",
      });
    }

    // Already used
    if (userCoupon.isUsed) {
      return res.status(409).json({
        message: "Coupon has already been used",
        usedAt: userCoupon.usedAt,
      });
    }

    // Cannot use a listed coupon
    if (userCoupon.isListed) {
      return res.status(409).json({
        message: "Cannot use a coupon that is listed on the marketplace. Unlist it first.",
      });
    }

    userCoupon.isUsed = true;
    userCoupon.usedAt = new Date();
    await userCoupon.save();

    return res.status(200).json({
      message: "Coupon marked as used",
      coupon: userCoupon,
    });

  } catch (error) {
    console.error("Mark As Used Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── LIST COUPON ON MARKETPLACE ────────────────────────────────────
export const listOnMarketplace = async (req, res) => {
  try {
    const { listingPrice } = req.body;

    if (!listingPrice || listingPrice <= 0) {
      return res.status(400).json({
        message: "A valid listing price is required",
      });
    }

    const userCoupon = await UserCoupon.findOne({
      _id: req.params.id,
      userId: req.user._id,   // ✅ ownership check
    });

    if (!userCoupon) {
      return res.status(404).json({
        message: "Coupon not found in your vault",
      });
    }

    // Cannot list a used coupon
    if (userCoupon.isUsed) {
      return res.status(409).json({
        message: "Cannot list a used coupon on the marketplace",
      });
    }

    // Already listed
    if (userCoupon.isListed) {
      return res.status(409).json({
        message: "Coupon is already listed on the marketplace",
      });
    }

    // Check if the global coupon is still valid before listing
    const coupon = await Coupon.findById(userCoupon.couponId);
    if (!coupon || !coupon.isActive || coupon.expiryDate < new Date()) {
      return res.status(409).json({
        message: "Cannot list an expired or inactive coupon",
      });
    }

    userCoupon.isListed = true;
    userCoupon.listingPrice = listingPrice;
    await userCoupon.save();

    return res.status(200).json({
      message: "Coupon listed on marketplace successfully",
      coupon: userCoupon,
    });

  } catch (error) {
    console.error("List On Marketplace Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── UNLIST FROM MARKETPLACE ───────────────────────────────────────
export const unlistFromMarketplace = async (req, res) => {
  try {
    const userCoupon = await UserCoupon.findOne({
      _id: req.params.id,
      userId: req.user._id,   // ✅ ownership check
    });

    if (!userCoupon) {
      return res.status(404).json({
        message: "Coupon not found in your vault",
      });
    }

    if (!userCoupon.isListed) {
      return res.status(409).json({
        message: "Coupon is not listed on the marketplace",
      });
    }

    userCoupon.isListed = false;
    userCoupon.listingPrice = null;
    await userCoupon.save();

    return res.status(200).json({
      message: "Coupon removed from marketplace",
      coupon: userCoupon,
    });

  } catch (error) {
    console.error("Unlist From Marketplace Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ─── DELETE FROM MY VAULT ──────────────────────────────────────────
export const deleteFromVault = async (req, res) => {
  try {
    const userCoupon = await UserCoupon.findOne({
      _id: req.params.id,
      userId: req.user._id,   // ✅ ownership check
    });

    if (!userCoupon) {
      return res.status(404).json({
        message: "Coupon not found in your vault",
      });
    }

    // Cannot delete a listed coupon — unlist first
    if (userCoupon.isListed) {
      return res.status(409).json({
        message: "Cannot delete a listed coupon. Unlist it from marketplace first.",
      });
    }

    await userCoupon.deleteOne();

    // ✅ Global coupon is NOT deleted — only the ownership record
    return res.status(200).json({
      message: "Coupon removed from your vault",
    });

  } catch (error) {
    console.error("Delete From Vault Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};