const Review = require("../models/Review");

// 1. Gửi đánh giá mới
exports.createReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;
    const existingReview = await Review.findOne({
      serviceId,
      userId: req.user._id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Bạn đã để lại đánh giá cho nơi này rồi!" });
    }

    const newReview = new Review({
      serviceId,
      userId: req.user._id,
      fullName: req.user.fullName,
      rating,
      comment,
    });

    await newReview.save();
    res
      .status(201)
      .json({ message: "Đánh giá thành công! ⭐", review: newReview });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi gửi đánh giá", error: err.message });
  }
};

exports.getReviewsByService = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId }).sort(
      { createdAt: -1 },
    );
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy đánh giá", error: err.message });
  }
};

// 3. Lấy TẤT CẢ đánh giá (Chỉ dành cho Admin)
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("serviceId", "name"); // Lấy thêm tên dịch vụ để Admin biết họ đang bình luận chỗ nào
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách đánh giá", error: err.message });
  }
};

// 4. Xóa đánh giá (Chỉ dành cho Admin)
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa đánh giá thành công! 🗑️" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa đánh giá", error: err.message });
  }
};
