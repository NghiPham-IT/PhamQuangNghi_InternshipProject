const Order = require("../models/Order");
const Service = require("../models/Service");

exports.createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Vui lòng đăng nhập để đặt vé!" });
    }

    let { items, serviceId, quantity } = req.body;
    let processedItems = [];
    let total = 0;
    const locations = new Set();

    if (serviceId && (!items || items.length === 0)) {
      items = [{ serviceId, quantity: quantity || 1 }];
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Không có dịch vụ nào để đặt!" });
    }

    for (let item of items) {
      const service = await Service.findById(item.serviceId);
      if (service) {
        processedItems.push({
          serviceId: service._id,
          quantity: item.quantity,
          priceAtBooking: service.price,
        });
        total += service.price * item.quantity;
        locations.add(service.location);
      } else {
        return res
          .status(404)
          .json({ message: `Dịch vụ ID ${item.serviceId} không tồn tại!` });
      }
    }

    let discount = locations.size >= 2 ? total * 0.1 : 0;
    const finalTotal = total - discount;
    const newOrder = new Order({
      customerName: req.user.username || req.user.email,
      phoneNumber: req.user.phoneNumber || "0963258147",
      user: req.user._id,
      items: processedItems,
      totalPrice: finalTotal,
      discountApplied: discount,
      qrCode: `DTGO-${Date.now()}-${req.user._id}`,
    });

    await newOrder.save();
    res.status(201).json({ message: "Đặt vé thành công!", order: newOrder });
  } catch (err) {
    console.error("LỖI CHI TIẾT TẠI CONTROLLER:", err);
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
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
// Lấy toàn bộ đơn hàng (Chỉ dành cho Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.serviceId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách đơn hàng", error: err.message });
  }
};
// Cập nhật trạng thái đơn hàng (Chỉ Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    res.json({ message: "Xác nhận thành công!", order });
  } catch (err) {
    console.error("Lỗi cập nhật Admin:", err);
    res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật", error: err.message });
  }
};
