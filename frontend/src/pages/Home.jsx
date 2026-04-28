import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Tất cả");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Lỗi kết nối:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = async () => {
    try {
      const res = await api.get(
        `/services?keyword=${keyword}&location=${location}&maxPrice=${maxPrice}&sort=${sort}`,
      );
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30 py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-black text-dt-pink tracking-tight mb-4 uppercase">
          Dong Thap Go <span className="animate-pulse">🌸</span>
        </h1>
        <div className="h-1 w-24 bg-dt-green mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium italic">
          "Hành trình về xứ sở Sen Hồng"
        </p>
      </div>

      {/* search */}
      <div className="max-w-6xl mx-auto mb-16 space-y-4">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-pink-100/50 border border-pink-100">
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mb-4">
            <div className="flex-1 flex items-center bg-pink-50/50 px-6 py-4 rounded-[2rem] gap-3 border border-transparent focus-within:border-dt-pink/30 transition-all">
              <span className="text-xl">🔍</span>
              <input
                type="text"
                placeholder="Bạn muốn khám phá tham quan ở đâu nào?..."
                className="bg-transparent border-none outline-none w-full font-medium text-gray-700 placeholder:text-gray-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="flex items-center bg-pink-50/50 px-6 py-4 rounded-[2rem] gap-3 min-w-[220px] border border-transparent">
              <span className="text-xl">📍</span>
              <select
                className="bg-transparent border-none outline-none w-full font-bold text-gray-600 cursor-pointer appearance-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Tất cả">Toàn Đồng Tháp</option>
                <option value="Cao Lãnh">TP. Cao Lãnh</option>
                <option value="Sa Đéc">TP. Sa Đéc</option>
                <option value="Tháp Mười">Huyện Tháp Mười</option>
                <option value="Hồng Ngự">TP. Hồng Ngự</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-pink-50">
            <div className="flex-1 min-w-[200px] flex items-center bg-pink-50/30 px-6 py-3 rounded-[1.5rem] gap-3">
              <span className="text-gray-400 font-bold text-sm uppercase">
                Giá tối đa:
              </span>
              <input
                type="number"
                placeholder="VD: 100000"
                className="bg-transparent border-none outline-none w-full font-black text-dt-pink placeholder:text-gray-300"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <span className="text-dt-pink font-bold">đ</span>
            </div>

            <div className="flex items-center bg-pink-50/30 px-6 py-3 rounded-[1.5rem] gap-3 min-w-[220px]">
              <span className="text-gray-400 font-bold text-sm uppercase">
                Sắp xếp:
              </span>
              <select
                className="bg-transparent border-none outline-none w-full font-bold text-gray-600 cursor-pointer"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Mặc định</option>
                <option value="priceAsc">Giá thấp đến cao</option>
                <option value="priceDesc">Giá cao xuống thấp</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="bg-dt-green text-white px-12 py-4 rounded-[2rem] font-black hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-95 w-full md:w-auto ml-auto"
            >
              ÁP DỤNG 🚀
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
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
              <div className="h-48 bg-dt-green/10 flex items-center justify-center">
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
          <div className="col-span-full text-center py-20 bg-white rounded-[3rem] shadow-inner">
            <span className="text-6xl mb-4 block">🏜️</span>
            <p className="text-gray-500 text-xl font-medium">
              Bạn ơi, không tìm thấy địa điểm nào khớp với lựa chọn này rồi! 🌸
            </p>
            <button
              onClick={() => {
                setKeyword("");
                setLocation("Tất cả");
                setMaxPrice("");
                setSort("");
                handleSearch();
              }}
              className="mt-4 text-dt-pink font-bold underline cursor-pointer hover:text-pink-700"
            >
              Xem lại tất cả vé
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
