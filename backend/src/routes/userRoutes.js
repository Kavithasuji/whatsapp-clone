import express from "express";
import { getUsers,updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getUsers
);
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

export default router;