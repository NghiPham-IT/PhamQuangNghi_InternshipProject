const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect, admin } = require("../middleware/authMiddleware");
// Đường dẫn: GET /api/services
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
module.exports = router;
