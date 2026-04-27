const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");
// --- ĐƯỜNG DẪN (ROUTES) ---
router.post("/", protect, orderController.createOrder);
router.get("/myorders", protect, orderController.getMyOrders);
// Admin lấy tất cả đơn hàng
router.get("/all", protect, admin, orderController.getAllOrders);
router.put("/:id/status", protect, admin, orderController.updateOrderStatus);
module.exports = router;
