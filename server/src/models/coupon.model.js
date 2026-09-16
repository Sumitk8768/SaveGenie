import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        code: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },

        description: {
            type: String,
            trim: true,
        },

        discountType: {
            type: String,
            required: true,
            enum: ["percentage", "flat"],
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },

        merchant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            required: true,
            index: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

couponSchema.index({ merchant: 1, code: 1 }, { unique: true });
couponSchema.index({ merchant: 1, isActive: 1, expiryDate: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;