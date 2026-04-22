const Service = require('../models/Service');

// Lấy tất cả dịch vụ (vé, phòng...)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách dịch vụ", error: err });
  }
};