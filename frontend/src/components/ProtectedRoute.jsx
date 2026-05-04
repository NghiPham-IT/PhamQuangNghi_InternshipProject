import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Nếu chưa đăng nhập -> Đẩy về trang Login
  if (!token || !user) return <Navigate to="/login" />;

  // Nếu yêu cầu quyền Admin mà User không phải Admin -> Đẩy về Trang chủ
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
