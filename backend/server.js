const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Test = require("./models/Test");
const equipmentRoutes = require("./routes/equipmentRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/rentals", rentalRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Renton API is working",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Renton server running on http://localhost:${PORT}`);
});

app.post("/api/test", async (req, res) => {
  try {
    const test = new Test({
      message: req.body.message,
    });

    const savedTest = await test.save();

    res.status(201).json(savedTest);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save test data",
      error: error.message,
    });
  }
});