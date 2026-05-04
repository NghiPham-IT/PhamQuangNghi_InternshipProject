import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // SEO động
import StarRating from "../components/StarRating";
import api from "../api/axios";

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // --- STATE CHO PHẦN ĐÁNH GIÁ ---
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (id) {
      // Lấy chi tiết dịch vụ
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

      // Lấy danh sách đánh giá từ Backend
      api
        .get(`/reviews/${id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("Lỗi lấy đánh giá:", err));
    }
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existItem = cart.find((item) => item._id === service._id);

    if (existItem) {
      existItem.quantity += 1;
    } else {
      cart.push({
        _id: service._id,
        name: service.name,
        price: service.price,
        location: service.location,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng! Tiếp tục chọn thêm vé 🌸");
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập trước! 😊");
      return navigate("/login");
    }

    setLoading(true);
    try {
      await api.post("/orders", {
        serviceId: service._id,
        quantity: 1,
      });
      alert(`Tuyệt vời! Bạn đã đặt vé thành công.`);
      navigate("/history");
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReview = async () => {
    if (!comment.trim())
      return alert("Nghi ơi, hãy nhập vài lời cảm nhận nhé!");

    try {
      const res = await api.post("/reviews", {
        serviceId: id,
        rating: userRating,
        comment: comment,
      });
      alert(res.data.message);

      setReviews([res.data.review, ...reviews]);
      setComment("");
      setUserRating(5);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi gửi đánh giá");
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
      {/* Bước 1: SEO động cho từng trang chi tiết */}
      <Helmet>
        <title>{service.name} | Dong Thap Go 🌸</title>
        <meta
          name="description"
          content={service.description?.substring(0, 150)}
        />
      </Helmet>

      <div className="p-6">
        <Link
          to="/"
          className="text-dt-green font-bold flex items-center gap-2 hover:translate-x-[-5px] transition-transform"
        >
          <span>←</span> Quay lại trang chủ
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Banner dịch vụ với Lazy Loading */}
        <div className="h-80 bg-dt-pink/5 rounded-3xl mb-8 overflow-hidden flex items-center justify-center shadow-inner border border-pink-50">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl text-pink-300">🛶</span>
          )}
        </div>

        {/* Thông tin chính */}
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

        {/* Nút bấm Hành động */}
        <div className="flex flex-col md:flex-row gap-4 mb-20">
          <button
            onClick={addToCart}
            className="flex-1 py-5 rounded-3xl font-black text-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-95 shadow-md flex justify-center items-center gap-2"
          >
            THÊM VÀO GIỎ 🧺
          </button>

          <button
            onClick={handleBooking}
            disabled={loading}
            className={`flex-[2] py-5 rounded-3xl font-black text-xl shadow-2xl transition-all active:scale-95 flex justify-center items-center gap-3
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-dt-pink text-white hover:bg-pink-700 shadow-pink-200"}`}
          >
            {loading ? "ĐANG XỬ LÝ..." : "ĐẶT VÉ NGAY"}
          </button>
        </div>

        {/* --- KHU VỰC ĐÁNH GIÁ --- */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h3 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-tighter">
            Đánh giá từ khách hàng 🌸
          </h3>

          {user ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-pink-100/30 border border-pink-50 mb-12">
              <p className="font-bold text-slate-600 mb-4">
                Chuyến đi của bạn thế nào?
              </p>
              <div className="mb-4">
                <StarRating
                  rating={userRating}
                  setRating={setUserRating}
                  editable={true}
                />
              </div>
              <textarea
                className="w-full p-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-dt-pink/20 text-slate-600 font-medium"
                placeholder="Chia sẻ cảm nhận của bạn về địa điểm này..."
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                onClick={handleSendReview}
                className="mt-4 bg-dt-pink text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all active:scale-95"
              >
                GỬI BÌNH LUẬN ⭐
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl text-center mb-10 border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">
                Bạn ơi, hãy{" "}
                <Link to="/login" className="text-dt-pink font-bold underline">
                  đăng nhập
                </Link>{" "}
                để chia sẻ cảm nhận nhé! 😊
              </p>
            </div>
          )}

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-dt-green/10 rounded-full flex items-center justify-center text-dt-green font-black">
                        {rev.fullName
                          ? rev.fullName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <span className="font-black text-slate-700">
                        {rev.fullName}
                      </span>
                    </div>
                    <StarRating rating={rev.rating} />
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium pl-1">
                    "{rev.comment}"
                  </p>
                  <p className="text-[10px] text-gray-300 mt-4 font-mono uppercase tracking-widest">
                    {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <span className="text-4xl block mb-2">🍃</span>
                <p className="text-slate-400 italic font-medium">
                  Chưa có đánh giá nào. Bạn hãy là người đầu tiên!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
