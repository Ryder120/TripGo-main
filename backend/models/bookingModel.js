import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  travelers: {
    type: Number,
    required: true,
    min: 1,
  },
  specialRequests: {
    type: String,
  },
  tourId: {
    type: String,
    required: true,
  },
  tourTitle: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  travelDate: {
    type: Date,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bookingModel =
  mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default bookingModel;
