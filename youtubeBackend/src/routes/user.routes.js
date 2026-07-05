import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import jwtVerify from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  changeUserAvatar,
  changeUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(jwtVerify, changeCurrentPassword);
router.route("/current-user").get(jwtVerify, getCurrentUser);
router.route("/update-account").patch(jwtVerify, updateAccountDetails);

router
  .route("/change-avatar")
  .patch(jwtVerify, upload.single("avatar"), changeUserAvatar);
router
  .route("/change-cover-image")
  .patch(jwtVerify, upload.single("coverImage"), changeUserCoverImage);

router.route("/channel/:username").get(jwtVerify, getUserChannelProfile);
router.route("/watch-history").get(jwtVerify, getWatchHistory);

export default router;
