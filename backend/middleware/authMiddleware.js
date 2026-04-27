const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Người dùng không còn tồn tại trên hệ thống!" });
      }

      next();
    } catch (error) {
      console.error("Lỗi xác thực Token:", error);
      res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập, không có quyền truy cập!" });
  }
};

const admin = (req, res, next) => {
  console.log("Quyền của User đang vào:", req.user?.role); // Dòng này để debug
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Lỗi quyền Admin",
      roleHienTai: req.user?.role,
    });
  }
};
module.exports = { protect, admin };
