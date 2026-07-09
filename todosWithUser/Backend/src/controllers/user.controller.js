import User from "../models/user.model.js";
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
await user.save({validateBeforeSave: false});
return { authToken, refreshToken };
} catch (error) {
    throw new apiError(500, error.message || "error while generating tokens");
}
}


const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
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

  res
    .status(201)
    .json(new apiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new apiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new apiError(401, "Invalid email or password");
    }

 const { authToken, refreshToken } = await generateRefreshAndAuthTokens(user._id);

 const loggedUser = await User.findById(user._id).select("-password -refreshToken");

 const Options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
 }

    res.status(200)
    .cookie("refreshToken", refreshToken, Options)
    .cookie("authToken", authToken, Options)
    .json(
        new apiResponse(
            200,
            { authToken, refreshToken},
            "User logged in successfully"
        )
    );
});