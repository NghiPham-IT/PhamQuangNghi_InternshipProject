const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serviceRoutes = require("./routes/serviceRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/uploads", express.static("uploads"));
// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Route chạy thử đơn giản
app.get("/", (req, res) => {
  res.send("Server DongThapGo đang chạy cực mượt! 🚀");
});

// Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`📡 Server đang chạy tại: http://localhost:${PORT}`);
});

const { protect } = require("./middleware/authMiddleware");

app.get("/api/test-baomat", protect, (req, res) => {
  res.json({
    message: "Chúc mừng! Bạn đã vào được khu vực bí mật",
    user: req.user,
  });
});
