import express from "express";
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  addTourReview,
  getAdminStats,
} from "../controllers/tourController.js";
import { authMiddleware } from "../middlewares/auth.js";

const tourRouter = express.Router();

// Public routes
tourRouter.get("/", getAllTours);
tourRouter.get("/:id", getTour);
tourRouter.post("/:id/review", addTourReview);

// Admin routes
tourRouter.post("/", authMiddleware, createTour);
tourRouter.put("/:id", authMiddleware, updateTour);
tourRouter.delete("/:id", authMiddleware, deleteTour);
tourRouter.get("/admin/stats", authMiddleware, getAdminStats);

export default tourRouter;
