import express from "express";
import {
  signUpUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/checkAuth.js";
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", isAuthenticated, followUnFollowUser);
router.get("/profile/:query", getUserProfile);
router.get("/suggested", isAuthenticated, getSuggestedUsers);
router.put("/update/:id", isAuthenticated, updateUser);
router.put("/put", isAuthenticated, freezeAccount);

export default router;
