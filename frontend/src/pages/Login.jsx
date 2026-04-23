import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );
      // LƯU QUAN TRỌNG: Cất Token vào localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Đăng nhập thành công!");
      navigate("/"); // Quay về trang chủ
    } catch (err) {
      alert(err.response?.data?.message || "Sai email hoặc mật khẩu");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-pink-100">
        <h2 className="text-3xl font-black text-dt-green text-center mb-8 uppercase">
          Chào mừng trở lại
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-dt-green outline-none"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-dt-green outline-none"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button className="w-full bg-dt-green text-white py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all">
            ĐĂNG NHẬP
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-dt-pink font-bold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
