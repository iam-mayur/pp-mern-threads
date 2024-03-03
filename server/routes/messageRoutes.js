import express from "express";
import isAuthenticated from "../middleware/checkAuth.js";
import {
  getMessages,
  sendMessage,
  getConversations,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", isAuthenticated, getConversations);
router.get("/:otherUserId", isAuthenticated, getMessages);
router.post("/", isAuthenticated, sendMessage);

export default router;
