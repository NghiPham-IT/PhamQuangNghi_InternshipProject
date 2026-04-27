import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/AdminOrders";
function App() {
  return (
    <>
      <Navbar /> {}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </>
  );
}

export default App;
