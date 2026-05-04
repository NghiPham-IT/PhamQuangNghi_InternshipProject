const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByService,
  getAllReviewsAdmin,
  deleteReview,
} = require("../controllers/reviewController");

// CHỈ CẦN 1 DÒNG NÀY ĐỂ LẤY CẢ protect VÀ admin
const { protect, admin } = require("../middleware/authMiddleware");

// --- CÁC ROUTES ---
router.post("/", protect, createReview);
router.get("/:serviceId", getReviewsByService);

// Routes dành cho Admin
router.get("/admin/all", protect, admin, getAllReviewsAdmin);
router.delete("/:id", protect, admin, deleteReview);

module.exports = router;
