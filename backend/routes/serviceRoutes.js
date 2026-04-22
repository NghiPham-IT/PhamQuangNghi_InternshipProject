const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect, admin } = require("../middleware/authMiddleware");
// Đường dẫn: GET /api/services
router.get("/", serviceController.getAllServices);
// CHỈ ADMIN mới có quyền thêm dịch vụ
module.exports = router;
