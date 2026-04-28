const Service = require("../models/Service");

// Lấy tất cả dịch vụ
exports.getAllServices = async (req, res) => {
  try {
    const { keyword, location, maxPrice, sort } = req.query;
    let query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location && location !== "Tất cả") {
      query.location = location;
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    let sortQuery = { createdAt: -1 };
    if (sort === "priceAsc") {
      sortQuery = { price: 1 };
    } else if (sort === "priceDesc") {
      sortQuery = { price: -1 };
    }
    const services = await Service.find(query).sort(sortQuery);

    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách dịch vụ",
      error: err.message,
    });
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
