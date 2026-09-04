const express = require("express");

const Equipment = require("../models/Equipment");
const Maintenance = require("../models/Maintenance");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET MAINTENANCE RECORDS
  GET /api/maintenance

  Owner -> only their equipment
  Admin -> all equipment
*/
router.get("/", authenticateUser, async (req, res) => {
  try {
    const role = req.user.role;

    if (role !== "owner" && role !== "admin") {
      return res.status(403).json({
        message:
          "Only equipment owners and administrators can access maintenance tracking",
      });
    }

    const equipmentFilter =
      role === "owner"
        ? { owner: req.user._id }
        : {};

    const equipment = await Equipment.find(
      equipmentFilter
    )
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    const equipmentIds = equipment.map(
      (item) => item._id
    );

    const records = await Maintenance.find({
      equipment: { $in: equipmentIds },
    }).sort({ nextServiceDate: 1 });

    const maintenanceMap = new Map();

    records.forEach((record) => {
      maintenanceMap.set(
        record.equipment.toString(),
        record
      );
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = equipment.map((item) => {
      const record = maintenanceMap.get(
        item._id.toString()
      );

      if (!record) {
        return {
          equipment: item,
          maintenance: null,
          status: "Not Scheduled",
        };
      }

      const nextServiceDate = new Date(
        record.nextServiceDate
      );
      nextServiceDate.setHours(0, 0, 0, 0);

      let status = record.status;

      if (nextServiceDate < today) {
        status = "Overdue";
      } else {
        const difference =
          nextServiceDate.getTime() - today.getTime();

        const daysUntilService =
          Math.ceil(
            difference /
              (1000 * 60 * 60 * 24)
          );

        if (daysUntilService <= 30) {
          status = "Service Soon";
        } else {
          status = "Good";
        }
      }

      return {
        equipment: item,
        maintenance: {
          ...record.toObject(),
          status,
        },
        status,
      };
    });

    const summary = {
      totalEquipment: result.length,
      scheduled: result.filter(
        (item) => item.maintenance
      ).length,
      good: result.filter(
        (item) => item.status === "Good"
      ).length,
      serviceSoon: result.filter(
        (item) => item.status === "Service Soon"
      ).length,
      overdue: result.filter(
        (item) => item.status === "Overdue"
      ).length,
      notScheduled: result.filter(
        (item) => item.status === "Not Scheduled"
      ).length,
    };

    res.json({
      summary,
      maintenance: result,
    });
  } catch (error) {
    console.error(
      "Get maintenance error:",
      error
    );

    res.status(500).json({
      message: "Failed to load maintenance records",
    });
  }
});

/*
  CREATE OR UPDATE MAINTENANCE RECORD
  PUT /api/maintenance/:equipmentId

  Owner -> only their equipment
  Admin -> any equipment
*/
router.put(
  "/:equipmentId",
  authenticateUser,
  async (req, res) => {
    try {
      const role = req.user.role;

      if (role !== "owner" && role !== "admin") {
        return res.status(403).json({
          message:
            "Only equipment owners and administrators can manage maintenance",
        });
      }

      const {
        lastServiceDate,
        nextServiceDate,
        notes,
      } = req.body;

      if (!nextServiceDate) {
        return res.status(400).json({
          message: "Next service date is required",
        });
      }

      const equipment = await Equipment.findById(
        req.params.equipmentId
      );

      if (!equipment) {
        return res.status(404).json({
          message: "Equipment not found",
        });
      }

      // Owners can manage only their own equipment
      if (
        role === "owner" &&
        (!equipment.owner ||
          String(equipment.owner) !==
            String(req.user._id))
      ) {
        return res.status(403).json({
          message:
            "You can only manage maintenance for your own equipment",
        });
      }

      const serviceDate = new Date(nextServiceDate);

      if (Number.isNaN(serviceDate.getTime())) {
        return res.status(400).json({
          message: "Invalid next service date",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      serviceDate.setHours(0, 0, 0, 0);

      let status = "Good";

      if (serviceDate < today) {
        status = "Overdue";
      } else {
        const difference =
          serviceDate.getTime() -
          today.getTime();

        const daysUntilService =
          Math.ceil(
            difference /
              (1000 * 60 * 60 * 24)
          );

        if (daysUntilService <= 30) {
          status = "Service Soon";
        }
      }

      const maintenance =
        await Maintenance.findOneAndUpdate(
          {
            equipment: equipment._id,
          },
          {
            equipment: equipment._id,
            lastServiceDate:
              lastServiceDate || null,
            nextServiceDate: serviceDate,
            status,
            notes: notes ? notes.trim() : "",
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      res.json({
        message:
          "Maintenance record saved successfully",
        maintenance,
      });
    } catch (error) {
      console.error(
        "Save maintenance error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to save maintenance record",
      });
    }
  }
);

/*
  DELETE MAINTENANCE RECORD
  DELETE /api/maintenance/:equipmentId

  Owner -> only their equipment
  Admin -> any equipment
*/
router.delete(
  "/:equipmentId",
  authenticateUser,
  async (req, res) => {
    try {
      const role = req.user.role;

      if (role !== "owner" && role !== "admin") {
        return res.status(403).json({
          message:
            "Only equipment owners and administrators can manage maintenance",
        });
      }

      const equipment = await Equipment.findById(
        req.params.equipmentId
      );

      if (!equipment) {
        return res.status(404).json({
          message: "Equipment not found",
        });
      }

      if (
        role === "owner" &&
        (!equipment.owner ||
          String(equipment.owner) !==
            String(req.user._id))
      ) {
        return res.status(403).json({
          message:
            "You can only manage maintenance for your own equipment",
        });
      }

      const deleted =
        await Maintenance.findOneAndDelete({
          equipment: equipment._id,
        });

      if (!deleted) {
        return res.status(404).json({
          message:
            "Maintenance record not found",
        });
      }

      res.json({
        message:
          "Maintenance record deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete maintenance error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete maintenance record",
      });
    }
  }
);

module.exports = router;