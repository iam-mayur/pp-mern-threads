import express from "express";
import {
  signUpUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/checkAuth.js";
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile/:username", getUserProfile);
router.post("/follow/:id", isAuthenticated, followUnFollowUser);
router.post("/update/:id", isAuthenticated, updateUser);

export default router;
