const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    //
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        quantity: { type: Number, default: 1 },
        priceAtBooking: { type: Number },
      },
    ],
    totalPrice: { type: Number, required: true },
    discountApplied: { type: Number, default: 0 },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Cancelled"],
    },
    qrCode: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
