import mongoose from "mongoose";

const userCouponSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    usedAt: {
      type: Date,
      default: null,
    },

    isListed: {
      type: Boolean,
      default: false,
      index: true,
    },

    listingPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    source: {
      type: String,
      enum: ["ocr_upload", "manual", "purchased"],  
      default: "manual",
    },

    screenshot: {
      type: String,
      trim: true,
    },

    acquiredAt: {
      type: Date,
      default: Date.now,
    },

    transferredFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

userCouponSchema.index({ userId: 1, couponId: 1 }, { unique: true });
userCouponSchema.index({ userId: 1, isUsed: 1 });        
userCouponSchema.index({ isListed: 1, listingPrice: 1 });

const UserCoupon = mongoose.model("UserCoupon", userCouponSchema);

export default UserCoupon;
