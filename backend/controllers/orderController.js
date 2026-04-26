const Order = require("../models/Order");
const Service = require("../models/Service");

exports.createOrder = async (req, res) => {
  try {
    console.log("DỮ LIỆU USER TỪ TOKEN:", req.user);

    const { serviceId, quantity } = req.body;
    if (!req.user) {
      return res.status(401).json({
        message: "Không tìm thấy thông tin người dùng, thử đăng nhập lại nhé!",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service)
      return res.status(404).json({ message: "Dịch vụ không tồn tại" });

    const newOrder = new Order({
      customerName: req.user.username || req.user.email || "Khách hàng",
      phoneNumber: req.user.phoneNumber || "0963258147",
      user: req.user._id,
      items: [
        {
          serviceId: service._id,
          quantity: quantity || 1,
          priceAtBooking: service.price,
        },
      ],
      totalPrice: service.price * (quantity || 1),
      qrCode: `DTGO-${Date.now()}-${req.user._id}`,
    });

    await newOrder.save();
    res.status(201).json({ message: "Đặt vé thành công!", order: newOrder });
  } catch (err) {
    console.error("LỖI CHI TIẾT TẠI CONTROLLER:", err);
    res.status(500).json({ message: "Lỗi lưu Database", error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    console.log("ID người dùng đang truy vấn:", req.user._id);
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("items.serviceId")
      .sort({ createdAt: -1 });

    console.log("Số lượng đơn hàng tìm thấy:", orders.length);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch sử", error: err.message });
  }
};
