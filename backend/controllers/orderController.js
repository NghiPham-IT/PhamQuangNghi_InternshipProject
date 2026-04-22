const Order = require("../models/Order");
const Service = require("../models/Service");

exports.createOrder = async (req, res) => {
  try {
    const { items, customerName, phoneNumber } = req.body;
    let total = 0;
    const locations = new Set(); // Dùng Set để đếm các địa điểm khác nhau

    // Duyệt qua danh sách món hàng khách nhặt lẻ
    for (let item of items) {
      const service = await Service.findById(item.serviceId);
      if (service) {
        total += service.price * item.quantity;
        locations.add(service.location); // Thêm địa điểm vào danh sách (Tràm Chim, Xẻo Quýt...)
      }
    }

    // Logic giảm giá Combo: Nếu đi từ 2 địa điểm trở lên thì giảm 10%
    let discount = 0;
    if (locations.size >= 2) {
      discount = total * 0.1;
      total = total - discount;
    }

    // Tạo mã QR giả lập (sau này sẽ dùng chuỗi này để vẽ hình QR)
    const qrCodeString = `DTGO-${Date.now()}-${req.user.id}`;

    const newOrder = new Order({
      customerName,
      phoneNumber,
      items,
      totalPrice: total,
      discountApplied: discount,
      qrCode: qrCodeString,
      user: req.user.id, // Lấy ID người dùng từ Token (nhờ Middleware protect)
    });

    await newOrder.save();
    res.status(201).json({ message: "Đặt vé thành công!", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đặt vé", error: err });
  }
};
// Lấy danh sách đơn hàng của người đang đăng nhập
exports.getMyOrders = async (req, res) => {
  try {
    // Phải tìm theo field 'user' khớp với 'req.user.id' từ Token
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.serviceId",
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch sử đơn hàng", error: err });
  }
};
// Chỉ Admin mới xem được tất cả
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .populate("items.serviceId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng", error: err });
  }
};
