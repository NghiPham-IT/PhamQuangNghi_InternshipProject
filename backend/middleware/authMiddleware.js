const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Kiểm tra xem Token có nằm trong Header không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ chuỗi "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lưu thông tin user vào request để dùng ở các hàm sau
      req.user = decoded;

      next(); // Cho phép đi tiếp
    } catch (error) {
      res.status(401).json({ message: "Token không hợp lệ!" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập, không có quyền truy cập!" });
  }
};

// Middleware kiểm tra quyền Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Chỉ Admin mới có quyền thực hiện hành động này!" });
  }
};

module.exports = { protect, admin };
