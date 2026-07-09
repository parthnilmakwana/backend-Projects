import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken} from "../controllers/user.controller.js";
import jwtAuthMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(jwtAuthMiddleware, logoutUser);
router.route("/me").get(jwtAuthMiddleware, getCurrentUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;  