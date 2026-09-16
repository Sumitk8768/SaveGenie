import Coupon from "../models/coupon.model.js";
// import Merchant from "../models/merchant.model.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      title,
      code,
      description,
      discountType,
      discountValue,
      merchant,
      expiryDate,
      isActive,
    } = req.body;

    if (
      !title ||
      !code ||
      !discountType ||
      discountValue === undefined ||
      !merchant ||
      !expiryDate
    ) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    if (!["percentage", "flat"].includes(discountType)) {
      return res.status(400).json({
        message: "Invalid discount type",
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

    // const merchantExists = await Merchant.findById(merchant);

    // if (!merchantExists) {
    //   return res.status(404).json({
    //     message: "Merchant not found",
    //   });
    // }

    const coupon = await Coupon.create({
      title,
      code,
      description,
      discountType,
      discountValue,
      merchant,
      expiryDate,
      isActive,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Coupon created successfully",
      coupon,
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

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      createdBy: req.user._id,
    }).populate("merchant", "name");

    return res.status(200).json({
      message: "Coupons fetched successfully",
      coupons,
    });

  } catch (error) {
    console.error("Get Coupons Error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).populate("merchant", "name");

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

export const updateCoupon = async (req, res) => {
  try {
    const {
      title,
      code,
      description,
      discountType,
      discountValue,
      merchant,
      expiryDate,
      isActive,
    } = req.body;


    const merchantExists = await Merchant.findById(merchant);

    if (!merchantExists) {
      return res.status(404).json({
        message: "Merchant not found",
      });
    }

    const coupon = await Coupon.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
      },
      {
        title,
        code,
        description,
        discountType,
        discountValue,
        merchant,
        expiryDate,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found or you are not allowed to update it",
      });
    }

    return res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });

  } catch (error) {
    console.error("Update Coupon Error:", error.message);

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

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found or you are not allowed to delete it",
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