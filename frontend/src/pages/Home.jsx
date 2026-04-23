import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    // Giả lập delay một chút để Nghi thấy hiệu ứng skeleton (tùy chọn)
    axios
      .get("http://localhost:5000/api/services")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Lỗi kết nối:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-pink-50/30 py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-black text-dt-pink tracking-tight mb-4 uppercase">
          Dong Thap Go <span className="animate-pulse">🌸</span>
        </h1>
        <div className="h-1 w-24 bg-dt-green mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium italic">
          "Hành trình về xứ sở Sen Hồng - Dự án của Phạm Quang Nghi"
        </p>
      </div>

      {/* Grid danh sách vé */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Hiệu ứng Skeleton khi đang tải dữ liệu (Cực kỳ chuyên nghiệp)
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl p-8 shadow-xl animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-2xl mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : services.length > 0 ? (
          services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:translate-y-[-8px] transition-all duration-300 border border-pink-100 flex flex-col"
            >
              <div className="h-48 bg-dt-green/20 flex items-center justify-center">
                <span className="text-5xl">🛶</span>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-dt-pink/10 text-dt-pink text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {service.location}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3 leading-tight min-h-[64px]">
                  {service.name}
                </h2>

                <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-bold">
                      Giá vé
                    </p>
                    <p className="text-2xl font-black text-dt-pink">
                      {service.price.toLocaleString()}đ
                    </p>
                  </div>
                  <Link
                    to={`/service/${service._id}`}
                    className="bg-dt-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-green-200 transition-colors"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Trường hợp không có dữ liệu (Empty State)
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-xl">
              Hiện chưa có vé nào được mở bán. 🌸
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
