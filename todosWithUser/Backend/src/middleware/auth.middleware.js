import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const jwtAuthMiddleware = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.authToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "Authentication token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken",
    );
    if (!user) {
      throw new apiError(401, "Invalid authentication token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, "Invalid authentication token");
  }
});

export default jwtAuthMiddleware;
