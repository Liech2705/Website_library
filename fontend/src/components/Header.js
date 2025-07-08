import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [auth, setAuth] = useState({ isLoggedIn: false, role: "" });
  const [showNotifications, setShowNotifications] = useState(false);
  const notiRef = useRef();

  const notifications = [
    { id: 1, type: "success", message: "✅ Sách 'Clean Code' đã được duyệt." },
    { id: 2, type: "warning", message: "⏰ Sách 'Lập trình C' sắp đến hạn trả vào 04/07/2025." },
  ];

  useEffect(() => {
    const updateStatus = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const role = localStorage.getItem("role") || "";
      setAuth({ isLoggedIn, role });
    };
    updateStatus();
    window.addEventListener("authChanged", updateStatus);
    return () => window.removeEventListener("authChanged", updateStatus);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setKeyword("");
      setSuggestions([]);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
      setSuggestions([]);
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (!value.trim()) return setSuggestions([]);

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/books?search=${value}`);
      setSuggestions(res.data?.slice(0, 6));
    } catch (error) {
      console.error("Gợi ý lỗi:", error);
      setSuggestions([]);
    }
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm p-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img
            src="https://media.istockphoto.com/id/1202911884/vi/vec-to/logo-s%C3%A1ch-v%C4%83n-h%E1%BB%8Dc-gi%C3%A1o-d%E1%BB%A5c-th%C6%B0-vi%E1%BB%87n-ki%E1%BA%BFn-th%E1%BB%A9c-%C4%91%E1%BB%8Dc-trang-nghi%C3%AAn-c%E1%BB%A9u-gi%E1%BA%A5y-vector-h%E1%BB%8Dc-tr%C6%B0%E1%BB%9Dng.jpg?s=170667a&w=0&k=20&c=kfffsGCfUSLINQSvjA3PNfxflPmimOYnTP-s1Orkmpc="
            alt="Thư Viện Logo"
            className="me-2"
            style={{ width: 60, height: 60 }}
          />
          <Link to="/" className="navbar-brand h4 text-dark text-decoration-none me-3">Trang Chủ</Link>
          <Link to="/books" className="navbar-brand h4 text-dark text-decoration-none me-3">Kho Sách</Link>
          <Link to="/categories" className="navbar-brand h4 text-dark text-decoration-none">Danh mục</Link>
        </div>

        <div className="d-flex align-items-center position-relative">
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sách..."
              value={keyword}
              onChange={handleChange}
              style={{ width: "250px" }}
            />
            <button className="btn btn-outline-primary ms-2" type="submit">🔍</button>
            {suggestions.length > 0 && (
              <div className="position-absolute bg-white shadow rounded mt-5 p-2"
                   style={{ top: "100%", left: 0, zIndex: 1000, width: "100%" }}>
                {suggestions.map((book) => (
                  <div
                    key={book.id}
                    className="p-2 border-bottom text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/book/${book.id}`);
                      setKeyword("");
                      setSuggestions([]);
                    }}
                  >
                    <strong>{book.title}</strong> – {book.authors?.map(a => a.name).join(", ") || "Không rõ"}
                  </div>
                ))}
              </div>
            )}
          </form>

          <div className="me-3 position-relative" ref={notiRef}>
            <button
              className="btn btn-outline-secondary position-relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="bi bi-bell fs-5"></i>
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="position-absolute bg-white shadow rounded mt-2 p-3"
                   style={{ width: "300px", right: 0, zIndex: 999 }}>
                <h6 className="mb-2">🔔 Thông báo</h6>
                {notifications.map((n) => (
                  <div key={n.id}
                       className={`alert alert-${n.type === "success" ? "success" : "warning"} py-2 mb-2`}
                       style={{ fontSize: "0.9rem" }}>
                    {n.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Tài khoản
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {!auth.isLoggedIn ? (
                <>
                  <li><Link className="dropdown-item" to="/login">Đăng nhập</Link></li>
                  <li><Link className="dropdown-item" to="/register">Đăng ký</Link></li>
                </>
              ) : (
                <>
                  <li><Link className="dropdown-item" to="/history">Lịch sử mượn sách</Link></li>
                  <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
                  <li><Link className="dropdown-item" to="/change-password">Đổi mật khẩu</Link></li>
                  {auth.role === "admin" && (
                    <li><Link className="dropdown-item" to="/library-management">Quản lý thư viện</Link></li>
                  )}
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</button></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
