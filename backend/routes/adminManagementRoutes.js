const express = require("express");

const Equipment = require("../models/Equipment");
const Rental = require("../models/Rental");

const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET ALL EQUIPMENT
  GET /api/admin/management/equipment
*/
router.get(
  "/equipment",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const equipment = await Equipment.find()
        .populate("owner", "name email phone")
        .sort({ createdAt: -1 });

      res.json({
        equipment,
      });
    } catch (error) {
      console.error(
        "Admin get equipment error:",
        error
      );

      res.status(500).json({
        message: "Failed to load equipment",
      });
    }
  }
);

/*
  DELETE EQUIPMENT
  DELETE /api/admin/management/equipment/:id
*/
router.delete(
  "/equipment/:id",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const equipment = await Equipment.findById(
        req.params.id
      );

      if (!equipment) {
        return res.status(404).json({
          message: "Equipment not found",
        });
      }

      const activeRental = await Rental.findOne({
        equipment: equipment._id,
        status: {
          $in: ["pending", "confirmed", "active"],
        },
      });

      if (activeRental) {
        return res.status(400).json({
          message:
            "This equipment cannot be deleted because it has an active or pending rental",
        });
      }

      await Equipment.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Equipment deleted successfully",
      });
    } catch (error) {
      console.error(
        "Admin delete equipment error:",
        error
      );

      res.status(500).json({
        message: "Failed to delete equipment",
      });
    }
  }
);

/*
  GET ALL RENTALS
  GET /api/admin/management/rentals
*/
router.get(
  "/rentals",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const rentals = await Rental.find()
        .populate(
          "equipment",
          "name category pricePerDay image location owner"
        )
        .populate(
          "customer",
          "name email phone"
        )
        .sort({ createdAt: -1 });

      res.json({
        rentals,
      });
    } catch (error) {
      console.error(
        "Admin get rentals error:",
        error
      );

      res.status(500).json({
        message: "Failed to load rentals",
      });
    }
  }
);

/*
  UPDATE RENTAL STATUS
  PATCH /api/admin/management/rentals/:id/status

  Allowed:
  pending    -> confirmed / cancelled
  confirmed  -> active / cancelled
  active     -> completed / cancelled
*/
router.patch(
  "/rentals/:id/status",
  authenticateUser,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid rental status",
        });
      }

      const rental = await Rental.findById(
        req.params.id
      );

      if (!rental) {
        return res.status(404).json({
          message: "Rental not found",
        });
      }

      const equipment = await Equipment.findById(
        rental.equipment
      );

      if (!equipment) {
        return res.status(404).json({
          message:
            "Equipment associated with this rental was not found",
        });
      }

      /*
        Prevent changing a completed rental.
      */
      if (rental.status === "completed") {
        return res.status(400).json({
          message:
            "Completed rentals cannot be changed",
        });
      }

      /*
        PENDING -> CONFIRMED
      */
      if (status === "confirmed") {
        if (rental.status !== "pending") {
          return res.status(400).json({
            message:
              "Only pending rentals can be confirmed",
          });
        }

        if (!equipment.available) {
          return res.status(400).json({
            message:
              "This equipment is currently unavailable",
          });
        }

        const overlappingRental =
          await Rental.findOne({
            _id: {
              $ne: rental._id,
            },

            equipment: equipment._id,

            status: {
              $in: ["confirmed", "active"],
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

        equipment.available = false;

        await equipment.save();
      }

      /*
        PENDING -> CANCELLED
      */
       else if (status === "cancelled") {
        if (
          rental.status !== "pending" &&
          rental.status !== "confirmed" &&
          rental.status !== "active"
        ) {
          return res.status(400).json({
            message:
              "This rental cannot be cancelled",
          });
        }

        rental.status = "cancelled";

        await rental.save();

        const anotherCurrentRental =
          await Rental.exists({
            equipment: equipment._id,
            status: {
              $in: ["confirmed", "active"],
            },
            _id: {
              $ne: rental._id,
            },
          });

        if (!anotherCurrentRental) {
          equipment.available = true;
          await equipment.save();
        }
      }

      /*
        CONFIRMED -> ACTIVE
      */
      else if (status === "active") {
        if (rental.status !== "confirmed") {
          return res.status(400).json({
            message:
              "Only confirmed rentals can be started",
          });
        }

        rental.status = "active";

        await rental.save();

        equipment.available = false;

        await equipment.save();
      }

      /*
        ACTIVE -> COMPLETED
      */
      else if (status === "completed") {
        if (rental.status !== "active") {
          return res.status(400).json({
            message:
              "Only active rentals can be completed",
          });
        }

        rental.status = "completed";

        await rental.save();

        const anotherActiveRental =
          await Rental.exists({
            equipment: equipment._id,
            status: {
              $in: ["confirmed", "active"],
            },
            _id: {
              $ne: rental._id,
            },
          });

        if (!anotherActiveRental) {
          equipment.available = true;
          await equipment.save();
        }
      }

      /*
        No-op when current status is already the
        requested status.
      */
      else if (status === rental.status) {
        return res.status(400).json({
          message:
            "Rental already has this status",
        });
      }

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

      res.json({
        message:
          "Rental status updated successfully",
        rental: updatedRental,
      });
    } catch (error) {
      console.error(
        "Admin update rental status error:",
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