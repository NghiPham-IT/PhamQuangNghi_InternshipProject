const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: String,
      required: true,
      enum: ["Tram Chim", "Xeo Quyt", "Go Thap"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Ticket", "Room", "Vehicle", "Food"],
    },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema);
