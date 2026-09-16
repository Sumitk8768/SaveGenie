import Merchant from "../models/merchant.model.js";

export const createMerchant = async (req, res) => {
  try {
    const { name, website, logo } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Merchant name is required",
      });
    }

    const merchant = await Merchant.create({
      name,
      website,
      logo,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Merchant created successfully",
      merchant,
    });
  } catch (error) {
    console.error("Create merchant error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Merchant already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const getMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find({
      createdBy: req.user._id,
    });

    return res.status(200).json({
      merchants,
    });
  } catch (error) {
    console.error("Get merchants error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
      });
    }

    return res.status(200).json({
      merchant,
    });
  } catch (error) {
    console.error("Get merchant error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateMerchant = async (req, res) => {
  try {
    const { name, website, logo } = req.body;

    const merchant = await Merchant.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
      },
      {
        name,
        website,
        logo,
      },
      {
        new: true,
        runValidators: true,
      }
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
        message: "Merchant already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

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