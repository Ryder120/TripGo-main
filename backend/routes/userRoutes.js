import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  makeAdmin,
} from "../controllers/userController.js";

import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected routes (logged-in users)
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.put("/profile", authMiddleware, updateUserProfile);

// Admin routes
userRouter.get("/all", adminMiddleware, getAllUsers);
userRouter.put("/admin-role/:id", adminMiddleware, makeAdmin);
userRouter.delete("/:id", adminMiddleware, deleteUser);

export default userRouter;