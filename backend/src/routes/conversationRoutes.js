import express from "express";

import {
  getConversation,
  getConversations,
}
from "../controllers/conversationController.js";

import authMiddleware
from "../middleware/auth.middleware.js";

const router = express.Router();
router.get(
  "/",
  authMiddleware,
  getConversations
);


router.get(
  "/:receiverId",
  authMiddleware,
  getConversation
);

export default router;