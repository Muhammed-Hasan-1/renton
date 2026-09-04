const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Test = require("./models/Test");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const adminManagementRoutes = require("./routes/adminManagementRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use(
  "/api/admin/management",
  adminManagementRoutes
);

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

// Test GET route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Renton API is working",
  });
});

// Test POST route
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

// Start server
app.listen(PORT, () => {
  console.log(
    `Renton server running on http://localhost:${PORT}`
  );
});