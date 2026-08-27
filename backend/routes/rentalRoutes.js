const express = require("express");
const mongoose = require("mongoose");

const Rental = require("../models/Rental");
const Equipment = require("../models/Equipment");

const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// CREATE RENTAL
// ===============================

router.post("/", authenticateUser, async (req, res) => {
  try {
    const {
      equipmentId,
      startDate,
      endDate,
    } = req.body;

    // Validate input
    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({
        message:
          "Equipment, start date and end date are required",
      });
    }

    // Validate equipment ID
    if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
      return res.status(400).json({
        message: "Invalid equipment ID",
      });
    }

    // Find equipment
    const equipment = await Equipment.findById(
      equipmentId
    );

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found",
      });
    }

    // Check availability
    if (!equipment.available) {
      return res.status(400).json({
        message: "This equipment is currently unavailable",
      });
    }

    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid rental dates",
      });
    }

    if (end < start) {
      return res.status(400).json({
        message:
          "End date must be after or equal to start date",
      });
    }

    // Calculate number of days
    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const totalDays =
      Math.ceil(
        (end - start) / millisecondsPerDay
      ) || 1;

    // Calculate total
    const totalAmount =
      totalDays * equipment.pricePerDay;

    // Create rental
    const rental = await Rental.create({
      customer: req.user.id,
      equipment: equipment._id,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay: equipment.pricePerDay,
      totalAmount,
      status: "pending",
    });

    // Populate response
    const populatedRental =
      await Rental.findById(rental._id)
        .populate(
          "equipment",
          "name category pricePerDay image location"
        )
        .populate(
          "customer",
          "name email"
        );

    res.status(201).json({
      message: "Rental booking created successfully",
      rental: populatedRental,
    });

  } catch (error) {
    console.error(
      "Create rental error:",
      error
    );

    res.status(500).json({
      message: "Failed to create rental",
    });
  }
});


// ===============================
// GET MY RENTALS
// ===============================

router.get(
  "/my",
  authenticateUser,
  async (req, res) => {
    try {
      const rentals = await Rental.find({
        customer: req.user.id,
      })
        .populate(
          "equipment",
          "name category pricePerDay image location"
        )
        .sort({ createdAt: -1 });

      res.json(rentals);

    } catch (error) {
      console.error(
        "Get rentals error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch rentals",
      });
    }
  }
);


module.exports = router;