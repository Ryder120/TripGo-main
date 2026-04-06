import express from "express";
import {
  createBooking,
  getBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
  processPayment,
  addReview,
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middlewares/auth.js";

const bookingRouter = express.Router();

// User routes
bookingRouter.post("/", authMiddleware, createBooking);
bookingRouter.get("/", authMiddleware, getBookings);
bookingRouter.put("/:id", authMiddleware, updateBooking);
bookingRouter.delete("/:id", authMiddleware, deleteBooking);
bookingRouter.post("/:id/payment", authMiddleware, processPayment);
bookingRouter.post("/:id/review", authMiddleware, addReview);

// Admin routes
bookingRouter.get("/admin/all", authMiddleware, getAllBookings);

export default bookingRouter;
