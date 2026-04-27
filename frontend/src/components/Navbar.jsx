import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const count = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
        setCartCount(count);
      } catch (error) {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black text-dt-pink">
        DONG THAP GO{" "}
        <span className="text-sm font-normal text-gray-400 ml-2">v2.0</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            {user.role === "admin" && !isAdminPage && (
              <Link
                to="/admin/orders"
                className="flex items-center gap-2 bg-dt-green text-white px-4 py-2 rounded-xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-100 animate-pulse"
              >
                <span>⚙️</span>
                <span>QUẢN LÝ</span>
              </Link>
            )}

            {isAdminPage && (
              <Link
                to="/"
                className="text-dt-green font-bold hover:underline flex items-center gap-1"
              >
                <span>🏠</span> Trang chủ
              </Link>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-gray-600 font-bold hover:text-dt-green transition-colors"
            >
              <span>🧺 Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-dt-pink text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/history"
              className="text-gray-600 font-bold hover:text-dt-pink transition-colors"
            >
              Lịch sử vé
            </Link>

            <span className="text-gray-600 font-medium hidden md:inline">
              Chào,{" "}
              <span className="text-dt-green font-bold">{user.username}</span>
            </span>

            <button
              onClick={handleLogout}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-all"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-dt-green font-bold">
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-dt-pink text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-pink-100"
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
