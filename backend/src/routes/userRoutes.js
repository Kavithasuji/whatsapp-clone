import express from "express";
import { getUsers } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getUsers
);

export default router;