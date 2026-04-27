import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  // Hàm cập nhật số lượng (Tăng/Giảm)
  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        // Đảm bảo số lượng tối thiểu là 1
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Kích hoạt sự kiện để Navbar cập nhật con số theo
    window.dispatchEvent(new Event("storage"));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  // Logic tính tiền & giảm giá Combo
  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const locations = new Set(cartItems.map((item) => item.location));
    const discount = locations.size >= 2 ? subtotal * 0.1 : 0;
    return { subtotal, discount, total: subtotal - discount };
  };

  const { subtotal, discount, total } = calculateTotal();

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      // CHÚ Ý: Biến đổi cấu trúc mảng để khớp với Backend Nghi vừa gửi
      const itemsToOrder = cartItems.map((item) => ({
        serviceId: item._id, // CHÍNH XÁC PHẢI LÀ serviceId (chữ I viết hoa)
        quantity: item.quantity,
      }));

      // Gửi đúng object { items: [...] }
      await api.post("/orders", { items: itemsToOrder });

      alert("Đặt vé combo thành công! 🌸");
      localStorage.removeItem("cart"); // Dọn dẹp giỏ hàng
      window.dispatchEvent(new Event("storage")); // Cập nhật Navbar
      navigate("/history");
    } catch (err) {
      // Nếu vẫn lỗi, Log này sẽ chỉ thẳng ID nào đang bị sai
      console.error("Chi tiết lỗi từ Backend:", err.response?.data);
      alert(err.response?.data?.message || "Lỗi khi đặt hàng");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-20 min-h-screen">
        <p className="text-2xl font-bold text-gray-400 mb-6 font-mono">
          GIỎ HÀNG ĐANG TRỐNG 🧺
        </p>
        <Link
          to="/"
          className="bg-dt-green text-white px-8 py-3 rounded-2xl font-bold shadow-lg inline-block"
        >
          QUAY LẠI CHỌN VÉ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen pb-20">
      <h2 className="text-3xl font-black mb-8 text-dt-green uppercase tracking-tighter">
        Giỏ hàng của Nghi 🛶
      </h2>

      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-50">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-6 gap-4"
          >
            <div className="flex-1">
              <h4 className="font-extrabold text-xl text-gray-800">
                {item.name}
              </h4>
              <p className="text-sm text-dt-green font-bold uppercase">
                {item.location}
              </p>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 text-xs font-bold mt-2 hover:text-red-600 transition-colors"
              >
                [ Xóa khỏi giỏ ]
              </button>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between">
              {/* TĂNG GIẢM SỐ LƯỢNG */}
              <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-200">
                <button
                  onClick={() => updateQuantity(item._id, -1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-100 font-bold text-xl transition-all"
                >
                  -
                </button>
                <span className="px-6 font-black text-lg">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-100 font-bold text-xl transition-all"
                >
                  +
                </button>
              </div>

              <div className="text-right min-w-[120px]">
                <p className="font-black text-xl text-gray-800">
                  {(item.price * item.quantity).toLocaleString()}đ
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  {item.price.toLocaleString()}đ / vé
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-10 p-6 bg-gray-50 rounded-3xl space-y-4">
          <div className="flex justify-between text-gray-500 font-bold">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString()}đ</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-dt-pink font-black animate-pulse bg-pink-50 p-3 rounded-xl border border-pink-100">
              <span>🎁 ƯU ĐÃI COMBO (10%):</span>
              <span>-{discount.toLocaleString()}đ</span>
            </div>
          )}

          <div className="flex justify-between text-3xl font-black text-dt-green pt-4 border-t-2 border-dashed border-gray-200">
            <span>TỔNG TIỀN:</span>
            <span>{total.toLocaleString()}đ</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-6 bg-dt-green text-white rounded-3xl font-black text-2xl mt-10 shadow-2xl shadow-green-100 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest"
        >
          Xác nhận đặt vé ngay 🌸
        </button>
      </div>
    </div>
  );
}

export default Cart;
