const express = require("express");

const Equipment = require("../models/Equipment");
const Rental = require("../models/Rental");

const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET INVENTORY
  GET /api/inventory

  Owner  -> only their equipment
  Admin  -> all equipment
*/
router.get("/", authenticateUser, async (req, res) => {
  try {
    const role = req.user.role;

    if (role !== "owner" && role !== "admin") {
      return res.status(403).json({
        message:
          "Only equipment owners and administrators can access inventory management",
      });
    }

    const equipmentFilter =
      role === "owner"
        ? { owner: req.user._id }
        : {};

    const equipment = await Equipment.find(equipmentFilter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    const equipmentIds = equipment.map((item) => item._id);

    const rentals = await Rental.find({
      equipment: { $in: equipmentIds },
      status: {
        $in: ["confirmed", "active"],
      },
    }).select("equipment status startDate endDate");

    const inventory = equipment.map((item) => {
      const relatedRentals = rentals.filter(
        (rental) =>
          rental.equipment.toString() ===
          item._id.toString()
      );

      const activeRental = relatedRentals.find(
        (rental) => rental.status === "active"
      );

      const confirmedRental = relatedRentals.find(
        (rental) => rental.status === "confirmed"
      );

      let status = "Available";

      if (activeRental) {
        status = "Currently Rented";
      } else if (confirmedRental) {
        status = "Reserved";
      } else if (!item.available) {
        status = "Unavailable";
      }

      return {
        _id: item._id,
        name: item.name,
        category: item.category,
        location: item.location,
        pricePerDay: item.pricePerDay,
        image: item.image,
        available: item.available,
        status,
        owner: item.owner,
        currentRental: activeRental || confirmedRental || null,
      };
    });

    const summary = {
      total: inventory.length,
      available: inventory.filter(
        (item) => item.status === "Available"
      ).length,
      reserved: inventory.filter(
        (item) => item.status === "Reserved"
      ).length,
      currentlyRented: inventory.filter(
        (item) => item.status === "Currently Rented"
      ).length,
      unavailable: inventory.filter(
        (item) => item.status === "Unavailable"
      ).length,
    };

    res.json({
      summary,
      inventory,
    });
  } catch (error) {
    console.error("Inventory error:", error);

    res.status(500).json({
      message: "Failed to load inventory",
    });
  }
});

module.exports = router;