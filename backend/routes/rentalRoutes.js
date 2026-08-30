const express = require("express");
const mongoose = require("mongoose");

const Rental = require("../models/Rental");
const Equipment = require("../models/Equipment");

const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CREATE RENTAL
// ======================================================

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
    const equipment = await Equipment.findById(equipmentId);

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
          "name category pricePerDay image location owner available"
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


// ======================================================
// GET MY RENTALS
// ======================================================

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
          "name category pricePerDay image location owner available"
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


// ======================================================
// GET OWNER RENTAL REQUESTS
// ======================================================

router.get(
  "/owner",
  authenticateUser,
  async (req, res) => {
    try {
      // Find equipment owned by the logged-in owner
      const ownerEquipment = await Equipment.find({
        owner: req.user._id,
      }).select("_id");

      const equipmentIds = ownerEquipment.map(
        (equipment) => equipment._id
      );

      // Find rentals for that equipment
      const rentals = await Rental.find({
        equipment: { $in: equipmentIds },
      })
        .populate(
          "equipment",
          "name category pricePerDay image location"
        )
        .populate(
          "customer",
          "name email phone"
        )
        .sort({ createdAt: -1 });

      res.json(rentals);

    } catch (error) {
      console.error(
        "Get owner rental requests error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch rental requests",
      });
    }
  }
);


// ======================================================
// UPDATE RENTAL STATUS
// OWNER: APPROVE / REJECT
// ======================================================

router.patch(
  "/:id/status",
  authenticateUser,
  async (req, res) => {
    try {
      const { status } = req.body;

      // Only these status changes are allowed
      if (
        status !== "confirmed" &&
        status !== "cancelled"
      ) {
        return res.status(400).json({
          message:
            "Status must be confirmed or cancelled",
        });
      }

      // Validate rental ID
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "Invalid rental ID",
        });
      }

      // Find rental
      const rental = await Rental.findById(
        req.params.id
      ).populate(
        "equipment"
      );

      if (!rental) {
        return res.status(404).json({
          message: "Rental not found",
        });
      }

      // Make sure rental belongs to owner's equipment
      if (
        !rental.equipment ||
        !rental.equipment.owner ||
        String(rental.equipment.owner) !==
          String(req.user._id)
      ) {
        return res.status(403).json({
          message:
            "You can only manage rental requests for your own equipment",
        });
      }

      // Only pending rentals can be approved/rejected
      if (rental.status !== "pending") {
        return res.status(400).json({
          message:
            "Only pending rental requests can be updated",
        });
      }

      // ==================================================
      // REJECT REQUEST
      // ==================================================

      if (status === "cancelled") {
        rental.status = "cancelled";

        await rental.save();

        return res.json({
          message:
            "Rental request rejected successfully",
          rental,
        });
      }

      // ==================================================
      // APPROVE REQUEST
      // ==================================================

      // Make sure equipment is still available
      if (!rental.equipment.available) {
        return res.status(400).json({
          message:
            "This equipment is currently unavailable",
        });
      }

      // Check for overlapping approved/active rentals
      const overlappingRental =
        await Rental.findOne({
          _id: { $ne: rental._id },

          equipment: rental.equipment._id,

          status: {
            $in: [
              "confirmed",
              "active",
            ],
          },

          startDate: {
            $lte: rental.endDate,
          },

          endDate: {
            $gte: rental.startDate,
          },
        });

      if (overlappingRental) {
        return res.status(400).json({
          message:
            "This equipment already has a confirmed rental during the selected dates",
        });
      }

      // Confirm rental
      rental.status = "confirmed";

      await rental.save();

      // Mark equipment unavailable
      rental.equipment.available = false;

      await rental.equipment.save();

      // Get populated rental
      const updatedRental =
        await Rental.findById(rental._id)
          .populate(
            "equipment",
            "name category pricePerDay image location owner available"
          )
          .populate(
            "customer",
            "name email phone"
          );

      return res.json({
        message:
          "Rental request approved successfully",
        rental: updatedRental,
      });

    } catch (error) {
      console.error(
        "Update rental status error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update rental status",
      });
    }
  }
);


module.exports = router;