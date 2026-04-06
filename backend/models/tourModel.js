import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  reviews: [
    {
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  photo: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  gallery: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const tourModel = mongoose.models.tour || mongoose.model("tour", tourSchema);

export default tourModel;
