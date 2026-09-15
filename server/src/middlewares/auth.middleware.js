import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        // Get access token from the httpOnly cookie
        const token = req.cookies?.accessToken;
        // Verify token.
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
                code: "TOKEN_MISSING",
            });
        }

        // jwt.verify() throws if the token is expired or invalid.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_ACCESS
        );

        // Find the user associated with the token
        const user = await UserModel.findById(decoded.id)
            .select("-password -refreshToken")
            .lean();

        // Token may be valid even though the user no longer exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account not found.",
                code: "USER_NOT_FOUND",
            });
        }

        // Attach authenticated user to request
        req.user = user;

        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);

        // Access token has expired
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired.",
                code: "TOKEN_EXPIRED",
            });
        }

        // Token is malformed, has invalid signature, etc.
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
                code: "INVALID_TOKEN",
            });
        }

        // Database or unexpected server error
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export default authMiddleware;