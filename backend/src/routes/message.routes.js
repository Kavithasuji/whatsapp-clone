import express from "express";

import authMiddleware
from "../middleware/auth.middleware.js";

import {
  sendMessage,
  getMessages,
  markDelivered,
  markRead,
}
from "../controllers/message.controller.js";

const router =
  express.Router();

router.post(
  "/",
  authMiddleware,
  sendMessage
);

router.get(
  "/:conversationId",
  authMiddleware,
  getMessages
);

router.put(
  "/delivered/:conversationId",
  authMiddleware,
  markDelivered
);

router.put(
  "/read/:conversationId",
  authMiddleware,
  markRead
);

export default router;