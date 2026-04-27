import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders/all")
      .then((res) => setOrders(res.data))
      .catch((err) => alert("Bạn không có quyền Admin để vào đây!"));
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (newStatus === "Cancelled") {
      const confirmCancel = window.confirm(
        "Bạn có chắc muốn HỦY đơn hàng này không?",
      );
      if (!confirmCancel) return;
    }

    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err.response?.data);
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  return (
    <div className="p-8 min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">
              Dashboard <span className="text-dt-green">Admin</span> ⚙️
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Trang quản lý hệ thống DongThapGo v2.0
            </p>
          </div>
          <Link
            to="/"
            className="bg-white px-6 py-3 rounded-2xl shadow-sm text-slate-500 font-bold hover:text-dt-pink transition-all border border-slate-100"
          >
            ← Trang bán vé
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border-b-4 border-dt-green relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">
                Tổng Vé Hiện Nay
              </p>
              <p className="text-4xl font-black text-slate-800">
                {orders.length}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-slate-50 text-8xl font-black">
              #
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border-b-4 border-yellow-400">
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">
              Đang chờ xử lý
            </p>
            <p className="text-4xl font-black text-slate-800">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </div>

          <div className="bg-dt-green p-8 rounded-[2rem] shadow-xl shadow-green-200 border-b-4 border-green-800">
            <p className="text-green-100 font-black text-xs uppercase tracking-widest mb-2">
              Doanh thu dự kiến
            </p>
            <p className="text-4xl font-black text-white">
              {totalRevenue.toLocaleString()}đ
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-50">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Thông tin khách hàng
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Dịch vụ chi tiết
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Tổng tiền
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  Trạng thái xử lý
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="p-6">
                    <div className="font-black text-slate-700 text-lg">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      {order.phoneNumber}
                    </div>
                  </td>
                  <td className="p-6">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-100/50 inline-block px-3 py-1 rounded-lg text-xs text-slate-600 mr-2 mb-1"
                      >
                        <span className="font-black">
                          {item.serviceId?.name}
                        </span>{" "}
                        x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-6">
                    <div className="font-black text-dt-pink text-xl">
                      {order.totalPrice?.toLocaleString()}đ
                    </div>
                    <div className="text-[10px] text-slate-300 uppercase font-bold tracking-tighter">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value)
                        }
                        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter border-none shadow-sm cursor-pointer transition-all ${
                          order.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : order.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        <option value="Pending">Chờ xác nhận</option>
                        <option value="Completed">Hoàn thành</option>
                        <option value="Cancelled">Hủy bỏ</option>
                      </select>

                      {order.status === "Pending" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order._id, "Completed")
                          }
                          className="text-[10px] font-black text-white bg-slate-800 px-4 py-2 rounded-xl hover:bg-dt-green transition-all shadow-lg active:scale-95"
                        >
                          XÁC NHẬN VÉ ✅
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
