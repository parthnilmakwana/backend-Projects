import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const generateRefreshAndAuthTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(404, "User not found");
    }
    const authToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { authToken, refreshToken };
  } catch (error) {
    throw new apiError(500, error.message || "error while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => !field || field.trim() === "")) {
    throw new apiError(400, "Username, email, and password are required");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  const user = await User.create({ username, email, password });
  if (!user) {
    throw new apiError(400, "User registration failed");
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new apiError(404, "User not found after registration");
  }
  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new apiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new apiError(401, "Invalid email or password");
  }

  const { authToken, refreshToken } = await generateRefreshAndAuthTokens(
    user._id,
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("authToken", authToken, options)
    .json(
      new apiResponse(
        200,
        { authToken, refreshToken, user: loggedUser },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("authToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new apiResponse(200, req.user, "Current user fetched successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, "Refresh token is required");
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if(!user){
        throw new apiError(401, "Invalid refresh token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new apiError(401, "Refresh token does not match");
    }

    const { authToken, refreshToken } = await generateRefreshAndAuthTokens(user._id);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("authToken", authToken, options)
        .json(new apiResponse(200, { authToken, refreshToken }, "Access token refreshed successfully"))
})

export { registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken };