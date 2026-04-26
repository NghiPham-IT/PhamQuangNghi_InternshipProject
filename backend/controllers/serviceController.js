const Service = require("../models/Service");

// Lấy tất cả dịch vụ
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách dịch vụ", error: err });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ này!" });
    }

    res.status(200).json(service);
  } catch (err) {
    res
      .status(400)
      .json({ message: "ID dịch vụ không hợp lệ", error: err.message });
  }
};
