import bookingModel from "../models/bookingModel.js";

/*
 * Create a new booking
 */
export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      travelers,
      specialRequests,
      tourId,
      tourTitle,
      totalPrice,
      travelDate,
    } = req.body;

    const userId = req.userId;

    if (
      !name ||
      !email ||
      !phone ||
      !tourId ||
      !tourTitle ||
      !totalPrice ||
      !userId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newBooking = new bookingModel({
      userId,
      name,
      email,
      phone,
      travelers: parseInt(travelers, 10),
      specialRequests,
      tourId,
      tourTitle,
      totalPrice: parseFloat(totalPrice),
      travelDate: travelDate ? new Date(travelDate) : null,
      status: "pending",
      paymentStatus: "pending",
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      booking: savedBooking,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Get and show all bookings of logged in user
 */
export const getBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const bookings = await bookingModel
      .find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/*
 * Get all bookings (for admin)
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/*
 * Update a booking
 */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { travelers, specialRequests, status, travelDate } = req.body;

    const booking = await bookingModel.findById(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Only allow user to update their own booking
    if (booking.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    if (travelers) booking.travelers = parseInt(travelers, 10);
    if (specialRequests) booking.specialRequests = specialRequests;
    if (status) booking.status = status;
    if (travelDate) booking.travelDate = new Date(travelDate);

    const updatedBooking = await booking.save();

    res.status(200).json({
      success: true,
      booking: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Delete a booking
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookingModel.findById(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Only allow user to delete their own booking
    if (booking.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this booking",
      });
    }

    await bookingModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Process payment for a booking
 */
export const processPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookingModel.findById(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Only allow user to pay for their own booking
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to pay for this booking",
      });
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";

    const updatedBooking = await booking.save();

    res.status(200).json({
      success: true,
      booking: updatedBooking,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
 * Add review to a booking
 */
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, comment } = req.body;

    if (!name || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Name and rating are required" });
    }

    const booking = await bookingModel.findById(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const review = {
      name,
      rating: parseInt(rating),
      comment,
      createdAt: new Date(),
    };

    booking.reviews.push(review);
    const updatedBooking = await booking.save();

    res.status(200).json({
      success: true,
      booking: updatedBooking,
      message: "Review added successfully",
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
