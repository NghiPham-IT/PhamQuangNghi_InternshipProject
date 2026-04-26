import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/myorders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy lịch sử:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center p-20 animate-pulse text-dt-pink font-bold">
        Đang tải hành trình của bạn...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-dt-green mb-8 uppercase tracking-widest text-center">
          Nhật ký du lịch của bạn
        </h1>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm">
            <p className="text-gray-500 mb-4">Bạn chưa có chuyến đi nào...</p>
            <Link to="/" className="text-dt-pink font-bold underline">
              Khám phá ngay!
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 shadow-lg border-l-8 border-dt-pink relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-mono text-gray-500">
                      ID: {order.qrCode}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      Ngày đặt:{" "}
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}
                  >
                    {order.status === "Pending"
                      ? "Chờ thanh toán"
                      : "Đã xác nhận"}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-50 pb-2"
                    >
                      <p className="font-bold text-gray-700">
                        {item.serviceId?.name || "Dịch vụ đã xóa"}
                      </p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">
                      Tổng thanh toán
                    </p>
                    <p className="text-2xl font-black text-dt-pink">
                      {order.totalPrice.toLocaleString()}đ
                    </p>
                  </div>
                  {order.discountApplied > 0 && (
                    <p className="text-xs text-dt-green font-bold italic">
                      Đã giảm giá combo:{" "}
                      {order.discountApplied.toLocaleString()}đ
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
