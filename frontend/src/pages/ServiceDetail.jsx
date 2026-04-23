import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ServiceDetail() {
  const { id } = useParams(); // Lấy ID từ thanh địa chỉ
  const [service, setService] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/services/${id}`)
      .then((res) => setService(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!service)
    return (
      <div className="text-center p-20 font-bold text-dt-pink">
        Đang tìm đường về xứ Sen Hồng...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Nút quay lại */}
      <div className="p-6">
        <Link
          to="/"
          className="text-dt-green font-bold flex items-center gap-2"
        >
          <span>←</span> Quay lại trang chủ
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="h-80 bg-dt-pink/5 rounded-3xl mb-8 flex items-center justify-center text-8xl shadow-inner">
          🛶
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-2">
          {service.name}
        </h1>
        <p className="text-dt-pink font-extrabold text-3xl mb-8">
          {service.price.toLocaleString()}đ{" "}
          <span className="text-sm font-normal text-gray-400">/ người</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-4 bg-gray-50 rounded-2xl border-b-4 border-dt-green">
            <p className="text-xs text-gray-400 font-bold uppercase">
              Địa điểm
            </p>
            <p className="font-bold">{service.location}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border-b-4 border-dt-pink">
            <p className="text-xs text-gray-400 font-bold uppercase">
              Trạng thái
            </p>
            <p className="font-bold text-green-600">Còn vé</p>
          </div>
        </div>

        <div className="prose max-w-none mb-12">
          <h3 className="text-xl font-bold mb-4 text-dt-green">
            Thông tin chi tiết
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg italic">
            {service.description}
          </p>
        </div>

        <button className="w-full bg-dt-pink text-white py-5 rounded-3xl font-black text-xl shadow-2xl hover:bg-pink-700 transition-all active:scale-95">
          TIẾN HÀNH ĐẶT VÉ
        </button>
      </div>
    </div>
  );
}

export default ServiceDetail;
