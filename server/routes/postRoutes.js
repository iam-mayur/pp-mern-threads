import express from "express";
import isAuthenticated from "../middleware/checkAuth.js";
import {
  createPost,
  deletePost,
  getPost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
} from "../controllers/postController.js";
import { isAuthenticated } from "../middleware/checkAuth.js";
const router = express.Router();

router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.get("/feed", isAuthenticated, getFeedPosts);
router.post("/create", isAuthenticated, createPost);
router.put("/like/:id", isAuthenticated, likeUnlikePost);
router.put("/reply/:id", isAuthenticated, replyToPost);
router.delete("/:id", isAuthenticated, deletePost);

export default router;
