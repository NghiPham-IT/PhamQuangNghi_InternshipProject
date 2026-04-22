const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
// Admin lấy tất cả đơn hàng (Dùng cả protect và admin middleware)
const { admin } = require("../middleware/authMiddleware");

// Đường dẫn: POST /api/orders
router.post("/", protect, orderController.createOrder);
// Lấy lịch sử của tôi
router.get("/myorders", protect, orderController.getMyOrders);
router.get("/all", protect, admin, orderController.getAllOrders);

module.exports = router;
