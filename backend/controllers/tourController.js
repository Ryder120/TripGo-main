import tourModel from "../models/tourModel.js";

/*
 * Get all tours
 */
export const getAllTours = async (req, res) => {
  try {
    const tours = await tourModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, tours });
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Get single tour
 */
export const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await tourModel.findById(id);

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    res.status(200).json({ success: true, tour });
  } catch (error) {
    console.error("Error fetching tour:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Create a new tour (admin only)
 */
export const createTour = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      duration,
      maxGroupSize,
      photo,
      gallery,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !duration ||
      !maxGroupSize
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newTour = new tourModel({
      title,
      description,
      price: parseFloat(price),
      location,
      duration,
      maxGroupSize: parseInt(maxGroupSize),
      photo,
      gallery,
      featured: false,
    });

    const savedTour = await newTour.save();

    res.status(201).json({
      success: true,
      tour: savedTour,
      message: "Tour created successfully",
    });
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Update a tour (admin only)
 */
export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      location,
      duration,
      maxGroupSize,
      photo,
      gallery,
      featured,
    } = req.body;

    const tour = await tourModel.findById(id);

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    if (title) tour.title = title;
    if (description) tour.description = description;
    if (price) tour.price = parseFloat(price);
    if (location) tour.location = location;
    if (duration) tour.duration = duration;
    if (maxGroupSize) tour.maxGroupSize = parseInt(maxGroupSize);
    if (photo) tour.photo = photo;
    if (gallery) tour.gallery = gallery;
    if (typeof featured !== "undefined") tour.featured = featured;

    const updatedTour = await tour.save();

    res.status(200).json({
      success: true,
      tour: updatedTour,
      message: "Tour updated successfully",
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Delete a tour (admin only)
 */
export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await tourModel.findByIdAndDelete(id);

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Add review to a tour
 */
export const addTourReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, comment } = req.body;

    if (!name || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Name and rating are required" });
    }

    const tour = await tourModel.findById(id);

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    const review = {
      name,
      rating: parseInt(rating),
      comment,
      createdAt: new Date(),
    };

    tour.reviews.push(review);
    const updatedTour = await tour.save();

    res.status(200).json({
      success: true,
      tour: updatedTour,
      message: "Review added successfully",
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Get admin statistics
 */
export const getAdminStats = async (req, res) => {
  try {
    const totalTours = await tourModel.countDocuments();
    const totalReviews =
      (
        await tourModel.aggregate([
          { $group: { _id: null, count: { $sum: { $size: "$reviews" } } } },
        ])
      )[0]?.count || 0;

    const avgRating =
      (
        await tourModel.aggregate([
          { $unwind: "$reviews" },
          { $group: { _id: null, avg: { $avg: "$reviews.rating" } } },
        ])
      )[0]?.avg || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalTours,
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
