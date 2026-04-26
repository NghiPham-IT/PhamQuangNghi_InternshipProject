import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black text-dt-pink">
        DONG THAP GO{" "}
        <span className="text-sm font-normal text-gray-400 ml-2">v2.0</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link
              to="/history"
              className="text-gray-600 font-bold hover:text-dt-pink transition-colors"
            >
              Lịch sử vé
            </Link>

            <span className="text-gray-600 font-medium">
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
