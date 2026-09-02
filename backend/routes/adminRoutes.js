const express = require("express");

const User = require("../models/User");
const Equipment = require("../models/Equipment");
const Rental = require("../models/Rental");
const Feedback = require("../models/Feedback");

const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET ADMIN DASHBOARD STATISTICS
  GET /api/admin/stats
*/
router.get(
  "/stats",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const [
        totalUsers,
        totalCustomers,
        totalOwners,
        totalAdmins,
        totalEquipment,
        availableEquipment,
        unavailableEquipment,
        totalRentals,
        pendingRentals,
        confirmedRentals,
        activeRentals,
        completedRentals,
        cancelledRentals,
        totalFeedback,
      ] = await Promise.all([
        User.countDocuments(),

        User.countDocuments({
          role: "customer",
        }),

        User.countDocuments({
          role: "owner",
        }),

        User.countDocuments({
          role: "admin",
        }),

        Equipment.countDocuments(),

        Equipment.countDocuments({
          available: true,
        }),

        Equipment.countDocuments({
          available: false,
        }),

        Rental.countDocuments(),

        Rental.countDocuments({
          status: "pending",
        }),

        Rental.countDocuments({
          status: "confirmed",
        }),

        Rental.countDocuments({
          status: "active",
        }),

        Rental.countDocuments({
          status: "completed",
        }),

        Rental.countDocuments({
          status: "cancelled",
        }),

        Feedback.countDocuments(),
      ]);

      res.json({
        stats: {
          users: {
            total: totalUsers,
            customers: totalCustomers,
            owners: totalOwners,
            admins: totalAdmins,
          },

          equipment: {
            total: totalEquipment,
            available: availableEquipment,
            unavailable: unavailableEquipment,
          },

          rentals: {
            total: totalRentals,
            pending: pendingRentals,
            confirmed: confirmedRentals,
            active: activeRentals,
            completed: completedRentals,
            cancelled: cancelledRentals,
          },

          feedback: {
            total: totalFeedback,
          },
        },
      });
    } catch (error) {
      console.error("Admin statistics error:", error);

      res.status(500).json({
        message: "Failed to load admin dashboard statistics",
      });
    }
  }
);

module.exports = router;