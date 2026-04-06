import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/*
 * Middleware to check if the user is authenticated
 */
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.userRole = decoded.role; // get role directly from token

    // Optional: check if user still exists
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

/*
 * Middleware to check if user is admin
 */
export const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    // Check if role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};