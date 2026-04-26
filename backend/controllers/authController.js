const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ĐĂNG KÝ
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Kiểm tra email
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email đã được sử dụng!" });

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng ký", error: err });
  }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng!" });

    // Tạo Token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng nhập", error: err });
  }
};
// Lấy thông tin người dùng hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy thông tin người dùng" });
  }
};
