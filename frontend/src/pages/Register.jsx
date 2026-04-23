import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Đăng ký thành công! Hãy đăng nhập nhé.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-pink-100">
        <h2 className="text-3xl font-black text-dt-pink text-center mb-8 uppercase">
          Welcome DongThapGo!!!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tên người dùng
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Quang Nghi"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-dt-pink outline-none"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="nghi@example.com"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-dt-pink outline-none"
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
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-dt-pink outline-none"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button className="w-full bg-dt-pink text-white py-4 rounded-2xl font-black shadow-lg hover:bg-pink-700 transition-all">
            ĐĂNG KÝ NGAY
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-dt-green font-bold">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
