import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews/admin/all");
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Nghi ơi, bạn có chắc chắn muốn xóa bình luận này không?")
    ) {
      try {
        await api.delete(`/reviews/${id}`);
        setReviews(reviews.filter((r) => r._id !== id)); // Xóa dòng đó trên UI luôn
        alert("Đã dọn dẹp xong! 🧹");
      } catch (err) {
        alert("Lỗi khi xóa rồi bạn ơi!");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-tighter">
          Quản lý đánh giá khách hàng 🛡️
        </h2>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-5">Khách hàng</th>
                <th className="p-5">Dịch vụ</th>
                <th className="p-5">Nội dung</th>
                <th className="p-5">Sao</th>
                <th className="p-5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map((rev) => (
                <tr
                  key={rev._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-5 font-bold text-dt-pink">{rev.fullName}</td>
                  <td className="p-5 text-sm text-slate-500 font-medium">
                    {rev.serviceId?.name || "N/A"}
                  </td>
                  <td className="p-5 text-slate-600 italic text-sm">
                    "{rev.comment}"
                  </td>
                  <td className="p-5 font-black text-yellow-500">
                    {rev.rating}⭐
                  </td>
                  <td className="p-5 text-center">
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      XÓA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && !loading && (
            <p className="p-10 text-center text-slate-400 italic">
              Hiện tại chưa có bình luận nào để quản lý bạn nhé! 🌸
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;
