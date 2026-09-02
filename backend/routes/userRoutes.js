const express = require("express");
const User = require("../models/User");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET LOGGED-IN USER PROFILE
  GET /api/users/me
*/
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to load profile",
    });
  }
});

/*
  UPDATE LOGGED-IN USER PROFILE
  PUT /api/users/me
*/
router.put("/me", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const {
      name,
      email,
      phone,
      address1,
      address2,
      state,
      district,
      city,
      pincode,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !email ||
      !phone ||
      !address1 ||
      !state ||
      !district ||
      !city ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    // Check whether another account already uses this email
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: {
          address1: address1.trim(),
          address2: address2 ? address2.trim() : "",
          state: state.trim(),
          district: district.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
});

module.exports = router;