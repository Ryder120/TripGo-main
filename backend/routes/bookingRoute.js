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

// 🔥 REMOVE AUTH FOR TESTING

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);

// Keep others protected if needed
bookingRouter.put("/:id", updateBooking);
bookingRouter.delete("/:id", deleteBooking);
bookingRouter.post("/:id/payment", processPayment);
bookingRouter.post("/:id/review", addReview);

// Admin route
bookingRouter.get("/admin/all", authMiddleware, getAllBookings);

export default bookingRouter;