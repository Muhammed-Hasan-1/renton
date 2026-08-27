const express = require("express");
const Equipment = require("../models/Equipment");

const {
  authenticateUser,
  authorizeOwner,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET LOGGED-IN OWNER'S EQUIPMENT
router.get(
  "/my-equipment",
  authenticateUser,
  authorizeOwner,
  async (req, res) => {
    try {
      const equipment = await Equipment.find({
        owner: req.user._id,
      }).sort({ createdAt: -1 });

      res.json(equipment);
    } catch (error) {
      console.error("Get my equipment error:", error);

      res.status(500).json({
        message: "Failed to fetch your equipment",
      });
    }
  }
);


// GET ALL EQUIPMENT
router.get("/", async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(equipment);

  } catch (error) {
    console.error("Get equipment error:", error);

    res.status(500).json({
      message: "Failed to fetch equipment",
    });
  }
});


// GET SINGLE EQUIPMENT
router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate("owner", "name email");

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found",
      });
    }

    res.json(equipment);

  } catch (error) {
    console.error("Get equipment details error:", error);

    res.status(500).json({
      message: "Failed to fetch equipment",
    });
  }
});


// CREATE EQUIPMENT
router.post(
  "/",
  authenticateUser,
  authorizeOwner,
  async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        pricePerDay,
        location,
        image,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !description ||
        !category ||
        !pricePerDay ||
        !location ||
        !image
      ) {
        return res.status(400).json({
          message: "Please provide all required equipment details",
        });
      }

      // Create equipment using the logged-in owner's ID
      const equipment = await Equipment.create({
        name,
        description,
        category,
        pricePerDay,
        location,
        image,
        owner: req.user._id,
        available: true,
      });

      res.status(201).json({
        message: "Equipment created successfully",
        equipment,
      });
    } catch (error) {
      console.error("Create equipment error:", error);

      res.status(500).json({
        message: "Failed to create equipment",
      });
    }
  }
);

module.exports = router;