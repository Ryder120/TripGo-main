import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*
 * Register a new user
 * @route POST /api/user/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = { name, email, password: hashedPassword };

    const newUser = new userModel(userData);
    const token = jwt.sign(
  { id: newUser._id, role: newUser.role },
  process.env.JWT_SECRET
);

    const user = await newUser.save();
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

/*
 * Login a user
 * @route POST /api/user/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET
);
      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

/*
 * Get user profile
 * @route GET /api/user/profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

/*
 * Update user profile
 * @route PUT /api/user/profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, bio, profilePicture } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

/*
 * Get all users (admin only)
 * @route GET /api/user/all
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

/*
 * Delete user (admin only)
 * @route DELETE /api/user/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

/*
 * Promote user to admin role
 * @route PUT /api/user/admin-role/:id
 */
export const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.role = "admin";
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "User promoted to admin successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
