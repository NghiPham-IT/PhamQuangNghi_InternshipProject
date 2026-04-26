import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
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
      </Routes>
    </>
  );
}

export default App;
