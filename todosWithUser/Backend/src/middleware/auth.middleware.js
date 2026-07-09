import jwt from "jsonwebtoken";

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
