const express = require("express");
const Feedback = require("../models/Feedback");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

/*
  SUBMIT FEEDBACK
  POST /api/feedback
*/
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { rating, message } = req.body;

    if (!rating || !message) {
      return res.status(400).json({
        message: "Rating and feedback message are required",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!message.trim()) {
      return res.status(400).json({
        message: "Feedback message cannot be empty",
      });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      rating: numericRating,
      message: message.trim(),
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Submit feedback error:", error);

    res.status(500).json({
      message: "Failed to submit feedback",
    });
  }
});

/*
  GET CURRENT USER'S FEEDBACK
  GET /api/feedback/my
*/
router.get("/my", authenticateUser, async (req, res) => {
  try {
    const feedback = await Feedback.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      feedback,
    });
  } catch (error) {
    console.error("Get feedback error:", error);

    res.status(500).json({
      message: "Failed to load feedback",
    });
  }
});

module.exports = router;