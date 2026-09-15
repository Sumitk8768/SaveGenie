
import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/token.js"
import {
    generateOtp,
    hashOtp,
    verifyOtp
} from "../utils/otp.js";
import { sendOtpEmail } from "../utils/email.js";

export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        const isExisted = await UserModel.findOne({ email })

        if (isExisted) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const otp = generateOtp();
        const otpHashed = hashOtp(otp);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = await UserModel.create({
            name,
            email,
            password,
            emailVerificationOtpHash: otpHashed,
            emailVerificationOtpExpires: otpExpires,
        });

        await sendOtpEmail(newUser.email, otp);

        return res.status(201).json({
            message: "Registration successful. Please verify your email.",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
        });
    }



}

export const loginController = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        let user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordCorrect = await user.comparePass(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                code: "EMAIL_NOT_VERIFIED",
            });
        }

        let accessToken = generateAccessToken(user._id);
        let refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "User loggedIn sucessfully",
            user: {
                name: user.name,
                email: user.email,
            },
        })


    } catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            error,
        })
    }


}

export const refreshTokenController = async (req, res) => {
    try {
        // get refresh token
        let refreshToken = req.cookies?.refreshToken;

        // check if it exists
        if (!refreshToken) {
            return res.status(401).json({
                message: "token not found"
            })
        }
        // verify JWT
        const decode = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH)

        // find user
        const user = await UserModel.findById(decode.userId);

        if (!user) {
            return res.status(401).json({
                message: "Invalid credential"
            })
        }
        // check stored refresh token
        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "wrong refreshToken credential"
            })
        }
        // generate new access token
        let accessToken = generateAccessToken(user._id)

        // set cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        // send response
        res.status(200).json({
            message: "new acesss token generated"
        })


    }
    catch (error) {

        // Refresh token has expired
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired.",
                code: "REFRESH_TOKEN_EXPIRED",
            });
        }

        // Refresh token is invalid/tampered
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token.",
                code: "INVALID_REFRESH_TOKEN",
            });
        }

        // Database or unexpected server error
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}

export const logoutController = async (req, res) => {
    try {
        // get refresh token
        let refreshToken = req.cookies?.refreshToken;
       
        // check if it exists
        if (!refreshToken) {
            return res.status(401).json({
                message: "token not found"
            })
        }

        // verify JWT
        const decode = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH)

        // find user
        const user = await UserModel.findById(decode.id);

        if (!user) {
            return res.status(401).json({
                message: "Invalid credential"
            })
        }

        // check stored refresh token
        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "wrong refreshToken credential"
            })
        }

        res.clearCookie('accessToken', {
            path: '/',
            httpOnly: true,
            // secure: true,
            // sameSite: 'strict'
        });

        res.clearCookie('refreshToken', {
            path: '/',
            httpOnly: true,
            // secure: true,
            // sameSite: 'strict'
        });

        user.refreshToken = null;
        await user.save();


        return res.status(200).json({ message: "User Logged out successfully." });
    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired.",
                code: "REFRESH_TOKEN_EXPIRED",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token.",
                code: "INVALID_REFRESH_TOKEN",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}

export const changePasswordController = async (req, res) => {
    try {
        const { currPassword, newPassword } = req.body;

        if (!currPassword || !newPassword) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const isCurrentPasswordCorrect =
            await user.comparePass(currPassword);

        if (!isCurrentPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid current password",
            });
        }

        const refreshToken = generateRefreshToken(user._id);
        const accessToken = generateAccessToken(user._id);

        user.password = newPassword;
        user.refreshToken = refreshToken;

        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Password changed successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const verifyEmailController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // 1. Validate input
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
            });
        }

        // 2. Find user
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // 3. Check if email is already verified
        if (user.emailVerified) {
            return res.status(400).json({
                message: "Email already verified",
            });
        }

        // 4. Check OTP existence
        if (!user.emailVerificationOtpHash) {
            return res.status(400).json({
                message: "No verification OTP found. Please request a new OTP.",
            });
        }

        // 5. Check OTP expiry
        if (
            !user.emailVerificationOtpExpires ||
            user.emailVerificationOtpExpires < new Date()
        ) {
            return res.status(400).json({
                message: "OTP expired. Please request a new OTP.",
            });
        }

        // 6. Verify OTP
        const isOtpCorrect = verifyOtp(
            otp,
            user.emailVerificationOtpHash
        );

        if (!isOtpCorrect) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        // 7. Mark email as verified
        user.emailVerified = true;

        // 8. Remove temporary OTP data
        user.emailVerificationOtpHash = undefined;
        user.emailVerificationOtpExpires = undefined;

        // 9. Generate authentication tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // 10. Store refresh token
        user.refreshToken = refreshToken;

        // 11. Save all changes
        await user.save();

        // 12. Set authentication cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // 13. Response
        return res.status(200).json({
            message: "Email verified successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await UserModel.findOne({ email });

        // Do not reveal whether the account exists
        if (!user) {
            return res.status(200).json({
                message:
                    "If an account exists for this email, a verification code has been sent.",
            });
        }

        const otp = generateOtp();
        const otpHash = hashOtp(otp);

        user.passwordResetOtpHash = otpHash;
        user.passwordResetOtpExpires =
            new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        await sendOtpEmail(
            user.email,
            otp
        );

        return res.status(200).json({
            message:
                "If an account exists for this email, a verification code has been sent.",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
        });
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

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid reset request",
            });
        }

        if (!user.passwordResetOtpHash) {
            return res.status(400).json({
                message: "No password reset request found",
            });
        }

        if (
            !user.passwordResetOtpExpires ||
            user.passwordResetOtpExpires < new Date()
        ) {
            return res.status(400).json({
                message: "OTP expired. Please request a new one.",
            });
        }

        const isOtpCorrect = verifyOtp(
            otp,
            user.passwordResetOtpHash
        );

        if (!isOtpCorrect) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        // Create a fresh authenticated session
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set new password
        user.password = newPassword;

        // Invalidate old refresh token/session
        user.refreshToken = null;

        // Remove reset OTP after successful use
        user.passwordResetOtpHash = undefined;
        user.passwordResetOtpExpires = undefined;


        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Password reset successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};
