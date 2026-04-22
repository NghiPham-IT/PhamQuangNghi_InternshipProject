const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique để không bị trùng email
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: "customer", enum: ["customer", "admin"] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
