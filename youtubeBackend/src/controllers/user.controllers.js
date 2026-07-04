import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import uploadOnCloudinary from "./../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new apiError(
      500,
      error?.message ||
        "something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { username, fullName, email, password } = req.body;

  if (
    [username, fullName, email, password].some((field) => field.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new apiError(400, "User with this username or email already exists");
  }

  //   console.log("req.files:", req.files); // Log the entire req.files object

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  console.log("Avatar Local Path:", avatarLocalPath);
  console.log("Avatar Upload:", avatar);
  console.log("Cover Upload:", coverImage);

  if (!avatar) {
    throw new apiError(400, "Failed to upload avatar image");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, "User created successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new apiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new apiError(400, "User not found");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new apiError(400, "Invalid password");
  }

  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new apiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
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
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(201)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200, "User logged out successfully", {}));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Refresh token is required");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new apiError(401, "User not found");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new apiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new apiResponse(200, "Access token refreshed successfully", {
        accessToken,
        refreshToken,
      })
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!(currentPassword || newPassword)) {
    throw new apiError(400, "Current password is required");
  }

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new apiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, "Password updated successfully", {}));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, "Current user fetched successfully", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, fullName, email } = req.body;

  if (!(username || fullName || email)) {
    throw new apiError(400, "At least one field is required to update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username,
        fullName,
        email,
      },
    },
    {
      returnDocument: "after",
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new apiResponse(200, "User details updated successfully", updatedUser)
    );
});

const changeUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new apiError(400, "Failed to upload avatar image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      returnDocument: "after",
    }
  ).select("-password -refreshToken");

  if(!user) {
        throw new apiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, "User avatar updated successfully", user));
});

const changeUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new apiError(400, "Cover image is required");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    throw new apiError(400, "Failed to upload cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      returnDocument: "after",
    }
  ).select("-password -refreshToken");

  if(!user) {
    throw new apiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, "User cover image updated successfully", user));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  changeUserAvatar,
  changeUserCoverImage
};
