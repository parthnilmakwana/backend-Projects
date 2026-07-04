import asyncHandler from "../utils/asyncHandler";
import apiError from "../utils/apiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const jwtVerify = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.headers("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "You are not logged in");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new apiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "You are not logged in");
  }

});

export default jwtVerify;