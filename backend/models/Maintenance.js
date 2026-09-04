const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    lastServiceDate: {
      type: Date,
      default: null,
    },

    nextServiceDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Good", "Service Soon", "Overdue"],
      default: "Good",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Maintenance",
  maintenanceSchema
);