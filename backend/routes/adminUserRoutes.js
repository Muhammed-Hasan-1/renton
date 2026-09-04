const express = require("express");

const User = require("../models/User");

const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET ALL USERS
  GET /api/admin/users
*/
router.get(
  "/",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json({
        users,
      });
    } catch (error) {
      console.error("Get admin users error:", error);

      res.status(500).json({
        message: "Failed to load users",
      });
    }
  }
);

/*
  UPDATE USER ROLE
  PATCH /api/admin/users/:id/role
*/
router.patch(
  "/:id/role",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { role } = req.body;

      const allowedRoles = [
        "customer",
        "owner",
        "admin",
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      // Prevent admin from changing their own role
      if (req.user._id.toString() === req.params.id) {
        return res.status(403).json({
          message: "You cannot change your own admin role",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.role = role;

      await user.save();

      const updatedUser = await User.findById(
        req.params.id
      ).select("-password");

      res.json({
        message: "User role updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update user role error:", error);

      res.status(500).json({
        message: "Failed to update user role",
      });
    }
  }
);

/*
  DELETE USER
  DELETE /api/admin/users/:id
*/
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      // Prevent admin from deleting their own account
      if (req.user._id.toString() === req.params.id) {
        return res.status(403).json({
          message: "You cannot delete your own admin account",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      await User.findByIdAndDelete(req.params.id);

      res.json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);

      res.status(500).json({
        message: "Failed to delete user",
      });
    }
  }
);

module.exports = router;