import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {                          
      type: String,
      required: true,
      trim: true,
      lowercase: true,              
    },

    website: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },

    category: {                      
      type: String,
      enum: ["food", "fashion", "electronics", "travel", "entertainment", "grocery", "other"],
      default: "other",
    },

    isActive: {                    
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

merchantSchema.index({ slug: 1 }, { unique: true });

merchantSchema.index({ category: 1, isActive: 1 });

const Merchant = mongoose.model("Merchant", merchantSchema);

export default Merchant;