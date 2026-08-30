const express = require("express");
const mongoose = require("mongoose");

const Rental = require("../models/Rental");
const Equipment = require("../models/Equipment");

const {
  authenticateUser,
  authorizeOwner,
} = require("../middleware/authMiddleware");

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
        message:
          "This equipment is currently unavailable",
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

    // Calculate rental days
    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const totalDays =
      Math.ceil(
        (end - start) / millisecondsPerDay
      ) || 1;

    // Calculate total amount
    const totalAmount =
      totalDays * equipment.pricePerDay;

    // Create rental as pending
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
          "name email phone"
        );

    res.status(201).json({
      message:
        "Rental booking created successfully",
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
// GET MY RENTALS - CUSTOMER
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
  authorizeOwner,
  async (req, res) => {
    try {
      // Find equipment owned by logged-in owner
      const ownerEquipment =
        await Equipment.find({
          owner: req.user._id,
        }).select("_id");

      const equipmentIds =
        ownerEquipment.map(
          (equipment) => equipment._id
        );

      // Find rentals for owner's equipment
      const rentals = await Rental.find({
        equipment: {
          $in: equipmentIds,
        },
      })
        .populate(
          "equipment",
          "name category pricePerDay image location owner available"
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
//
// Allowed lifecycle transitions:
//
// pending   → confirmed
// pending   → cancelled
// confirmed → active
// active    → completed
// ======================================================

router.patch(
  "/:id/status",
  authenticateUser,
  authorizeOwner,
  async (req, res) => {
    try {
      const { status } = req.body;

      // Allowed statuses from frontend
      const allowedStatuses = [
        "confirmed",
        "cancelled",
        "active",
        "completed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message:
            "Invalid rental status",
        });
      }

      // Validate rental ID
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message: "Invalid rental ID",
        });
      }

      // Find rental and populate equipment
      const rental =
        await Rental.findById(
          req.params.id
        ).populate("equipment");

      if (!rental) {
        return res.status(404).json({
          message: "Rental not found",
        });
      }

      // Equipment must exist
      if (!rental.equipment) {
        return res.status(404).json({
          message:
            "Equipment associated with this rental was not found",
        });
      }

      // Make sure rental belongs to owner's equipment
      if (
        !rental.equipment.owner ||
        String(
          rental.equipment.owner
        ) !== String(req.user._id)
      ) {
        return res.status(403).json({
          message:
            "You can only manage rental requests for your own equipment",
        });
      }


      // ==================================================
      // PENDING → CONFIRMED
      // ==================================================

      if (status === "confirmed") {
        if (rental.status !== "pending") {
          return res.status(400).json({
            message:
              "Only pending rentals can be approved",
          });
        }

        // Equipment must be available
        if (!rental.equipment.available) {
          return res.status(400).json({
            message:
              "This equipment is currently unavailable",
          });
        }

        // Check for overlapping confirmed/active rentals
        const overlappingRental =
          await Rental.findOne({
            _id: {
              $ne: rental._id,
            },

            equipment:
              rental.equipment._id,

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

        rental.status = "confirmed";

        await rental.save();

        // Block equipment after approval
        rental.equipment.available =
          false;

        await rental.equipment.save();
      }


      // ==================================================
      // PENDING → CANCELLED
      // ==================================================

      else if (status === "cancelled") {
        if (rental.status !== "pending") {
          return res.status(400).json({
            message:
              "Only pending rentals can be rejected",
          });
        }

        rental.status = "cancelled";

        await rental.save();
      }


      // ==================================================
      // CONFIRMED → ACTIVE
      // ==================================================

      else if (status === "active") {
        if (rental.status !== "confirmed") {
          return res.status(400).json({
            message:
              "Only confirmed rentals can be started",
          });
        }

        rental.status = "active";

        await rental.save();

        // Keep equipment unavailable
        rental.equipment.available =
          false;

        await rental.equipment.save();
      }


      // ==================================================
      // ACTIVE → COMPLETED
      // ==================================================

      else if (status === "completed") {
        if (rental.status !== "active") {
          return res.status(400).json({
            message:
              "Only active rentals can be completed",
          });
        }

        rental.status = "completed";

        await rental.save();

        // Make equipment available again
        rental.equipment.available =
          true;

        await rental.equipment.save();
      }


      // Populate updated rental
      const updatedRental =
        await Rental.findById(
          rental._id
        )
          .populate(
            "equipment",
            "name category pricePerDay image location owner available"
          )
          .populate(
            "customer",
            "name email phone"
          );

      let message =
        "Rental status updated successfully";

      if (status === "confirmed") {
        message =
          "Rental request approved successfully";
      } else if (status === "cancelled") {
        message =
          "Rental request rejected successfully";
      } else if (status === "active") {
        message =
          "Rental has been started successfully";
      } else if (status === "completed") {
        message =
          "Rental completed successfully and equipment is available again";
      }

      res.json({
        message,
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