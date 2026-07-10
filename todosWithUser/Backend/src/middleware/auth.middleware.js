import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const jwtAuthMiddleware = asyncHandler(async (req, _, next) => {
    const token = req.cookies.authToken || req.headers("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new apiError(401, "Authentication token is required");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password -refreshToken");
    } catch (error) {
        throw new apiError(401, "Invalid authentication token");
    }
})

export default jwtAuthMiddleware;
