import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api
        .get(`/services/${id}`)
        .then((res) => {
          setService(res.data);
          setError(false);
        })
        .catch((err) => {
          console.error("Lỗi lấy chi tiết vé:", err);
          setError(true);
        });
    }
  }, [id]);

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn cần đăng nhập trước! 😊");
      return navigate("/login");
    }

    setLoading(true);
    try {
      const response = await api.post("/orders", {
        serviceId: service._id,
        quantity: 1,
      });

      alert(`Tuyệt vời! Bạn đã đặt vé thành công.`);
      navigate("/history");
    } catch (err) {
      console.error("Lỗi đặt vé:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-600">
          Không tìm thấy thông tin vé này 😅
        </p>
        <Link to="/" className="text-dt-pink font-bold underline">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  if (!service)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-20 font-bold text-dt-pink animate-bounce text-xl">
          Đang tìm đường về xứ Sen Hồng... 🌸
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <Link
          to="/"
          className="text-dt-green font-bold flex items-center gap-2 hover:translate-x-[-5px] transition-transform"
        >
          <span>←</span> Quay lại trang chủ
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="h-80 bg-dt-pink/5 rounded-3xl mb-8 flex items-center justify-center text-8xl shadow-inner border border-pink-50 text-pink-300">
          🛶
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          {service.name}
        </h1>
        <p className="text-dt-pink font-extrabold text-3xl mb-8">
          {service.price?.toLocaleString()}đ{" "}
          <span className="text-sm font-normal text-gray-400">/ người</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
          <div className="p-4 bg-gray-50 rounded-2xl border-b-4 border-dt-green shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
              Địa điểm
            </p>
            <p className="font-bold text-gray-700">{service.location}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border-b-4 border-dt-pink shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
              Trạng thái
            </p>
            <p className="font-bold text-green-600">Sẵn sàng phục vụ</p>
          </div>
        </div>

        <div className="prose max-w-none mb-12">
          <h3 className="text-xl font-bold mb-4 text-dt-green uppercase tracking-wider">
            Thông tin chi tiết
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg italic border-l-4 border-gray-100 pl-4 bg-gray-50 py-4 rounded-r-xl">
            {service.description}
          </p>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className={`w-full py-5 rounded-3xl font-black text-xl shadow-2xl transition-all active:scale-95 flex justify-center items-center gap-3
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-dt-pink text-white hover:bg-pink-700 hover:shadow-pink-200"}`}
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ĐANG XỬ LÝ...
            </>
          ) : (
            "XÁC NHẬN ĐẶT VÉ"
          )}
        </button>
      </div>
    </div>
  );
}

export default ServiceDetail;
