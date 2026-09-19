import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { generateOtp, hashOtp, verifyOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/email.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
};

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExisted = await UserModel.findOne({ email });

    if (isExisted) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const otpHashed = hashOtp(otp);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await UserModel.create({
      name,
      email,
      password,
      emailVerificationOtpHash: otpHashed,
      emailVerificationOtpExpires: otpExpires,
    });

    await sendOtpEmail(email, otp);

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePass(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user._id);

    res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));

    return res.status(200).json({ message: "Access token refreshed" });

  } catch (error) {
    console.error("Refresh Token Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Refresh token expired.",
        code: "REFRESH_TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid refresh token.",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
};

export const logoutController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    user.refreshToken = null;
    await user.save();

    res.clearCookie("accessToken", { path: "/", httpOnly: true });
    res.clearCookie("refreshToken", { path: "/", httpOnly: true });

    return res.status(200).json({ message: "Logged out successfully." });

  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { currPassword, newPassword } = req.body;

    if (!currPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordCorrect = await user.comparePass(currPassword);

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const isSamePassword = await user.comparePass(newPassword);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as current password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.password = newPassword;
    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Change Password Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (!user.emailVerificationOtpHash) {
      return res.status(400).json({
        message: "No verification OTP found. Please request a new OTP.",
      });
    }

    if (user.emailVerificationOtpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP expired. Please request a new OTP.",
      });
    }

    const isOtpCorrect = verifyOtp(otp, user.emailVerificationOtpHash);

    if (!isOtpCorrect) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.emailVerified = true;
    user.emailVerificationOtpHash = undefined;
    user.emailVerificationOtpExpires = undefined;
    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    console.error("Verify Email Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If an account exists for this email, a verification code has been sent.",
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    user.passwordResetOtpHash = otpHash;
    user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp);

    return res.status(200).json({
      message: "If an account exists for this email, a verification code has been sent.",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid reset request" });
    }

    if (!user.passwordResetOtpHash) {
      return res.status(400).json({ message: "No password reset request found" });
    }

    if (user.passwordResetOtpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP expired. Please request a new one.",
      });
    }

    const isOtpCorrect = verifyOtp(otp, user.passwordResetOtpHash);

    if (!isOtpCorrect) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.password = newPassword;
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpires = undefined;
    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};