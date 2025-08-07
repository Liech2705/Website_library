import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ApiService from "../services/api";

// Sử dụng CDN cho Bootstrap CSS và JS
const bootstrapCSS = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
const bootstrapJS = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
const bootstrapIcons = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const notiRef = useRef();

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [auth, setAuth] = useState({ isLoggedIn: false, role: "" });
  const [userInfo, setUserInfo] = useState({ name: "", avatar: "" });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const userInfor = await ApiService.getMyUserInfor();
        const updateStatus = () => {
          const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
          const role = localStorage.getItem("role") || "";
          const name = localStorage.getItem("username") === "null" ? "Người dùng" : localStorage.getItem("username");
          const avatar = process.env.REACT_APP_STORAGE_URL + (userInfor?.avatar || "");
          setAuth({ isLoggedIn, role });
          setUserInfo({ name, avatar });
        };
        updateStatus();
        window.addEventListener("authChanged", updateStatus);
        return () => window.removeEventListener("authChanged", updateStatus);
      } catch (err) {
        console.error("Lỗi khi tải thông tin người dùng:", err);
      }
    };
    if (localStorage.getItem("isLoggedIn") === "true") {
      fetchAvatar();
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!auth.isLoggedIn || !userId) return;

    ApiService.getNotificationsByUser(userId)
      .then(setNotifications)
      .catch((err) => {
        console.error("Lỗi khi tải thông báo:", err);
        setNotifications([]);
      });
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setKeyword("");
      setSuggestions([]);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notiRef.current &&
        !notiRef.current.contains(e.target) &&
        !e.target.closest(".dropdown")
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setNotifications([]);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      const offcanvasEl = document.getElementById("offcanvasMenu");
      const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance?.(offcanvasEl);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
      setSuggestions([]);
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (!value.trim()) return setSuggestions([]);

    try {
      const res = await axios.get(process.env.REACT_APP_API_URL + `/reviews_books?search=${value}`);
      setSuggestions(res.data?.slice(0, 6) || []);
    } catch (err) {
      console.error("Gợi ý lỗi:", err);
      setSuggestions([]);
    }
  };

  const handleCloseMenu = () => {
    const offcanvasElement = document.getElementById("offcanvasMenu");
    const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance?.(offcanvasElement);
    if (bsOffcanvas) bsOffcanvas.hide();
  };


  return (
    <>
      <link rel="stylesheet" href={bootstrapCSS} />
      <link rel="stylesheet" href={bootstrapIcons} />
      <style>
        {`.dropdown-toggle::after {
          display: none;
        }`}
      </style>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="https://media.istockphoto.com/id/1202911884/vi/vec-to/logo-s%C3%A1ch-v%C4%83n-h%E1%BB%8Dc-gi%C3%A1o-d%E1%BB%A5c-th%C6%B0-vi%E1%BB%87n-ki%E1%BA%BFn-th%E1%BB%A9c-%C4%91%E1%BB%8Dc-trang-nghi%C3%AAn-c%E1%BB%A9u-gi%E1%BA%A5y-vector-h%E1%BB%8Dc-tr%C6%B0%E1%BB%9Dng.jpg?s=170667a&w=0&k=20&c=kfffsGCfUSLINQSvjA3PNfxflPmimOYnTP-s1Orkmpc="
              alt="Logo"
              width="50"
              height="50"
              className="me-2"
            />
            <span className="fw-bold">Thư viện số</span>
          </Link>

          <button
            className="btn btn-outline-secondary d-lg-none ms-auto"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <i className="bi bi-list fs-3"></i>
          </button>

          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
              <li className="nav-item">
                <Link to="/books" className="nav-link">
                  Kho Sách
                </Link>
              </li>
            </ul>

            <form className="position-relative me-3" style={{ width: "250px" }} onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control pe-5"
                placeholder="Tìm kiếm sách..."
                value={keyword}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent text-secondary"
                style={{ fontSize: "1.2rem" }}
              >
                <i className="bi bi-search"></i>
              </button>

              {suggestions.length > 0 && (
                <div
                  className="position-absolute bg-white shadow rounded mt-2 p-2"
                  style={{ top: "100%", left: 0, zIndex: 1000, width: "100%" }}
                >
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
                      <strong>{book.title}</strong> – {book.authors?.map((a) => a.name).join(", ") || "Không rõ"}
                    </div>
                  ))}
                </div>
              )}
            </form>

            {auth.isLoggedIn && (
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
                  <div
                    className="position-absolute bg-white shadow rounded mt-2 p-3"
                    style={{ width: "300px", right: 0, zIndex: 1000 }}
                  >
                    <h6 className="mb-2">🔔 Thông báo</h6>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`alert alert-${n.type === "success" ? "success" : "warning"} py-2 mb-2`}
                        style={{ fontSize: "0.9rem" }}
                      >
                        {n.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="d-flex align-items-center gap-2">
              {auth.isLoggedIn && (
                <img
                  src={userInfo.avatar}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "32px", height: "32px", objectFit: "cover" }}
                />
              )}

              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="dropdownUser"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {auth.isLoggedIn ? userInfo.name : "Khách"}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" style={{ zIndex: 1050 }} aria-labelledby="dropdownUser">
                  {!auth.isLoggedIn ? (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/login">
                          Đăng nhập
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/register">
                          Đăng ký
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/history">
                          Lịch sử mượn sách
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Thông tin cá nhân
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/change-password">
                          Đổi mật khẩu
                        </Link>
                      </li>
                      {auth.role === "admin" && (
                        <li>
                          <Link className="dropdown-item" to="/library-management">
                            Quản lý thư viện
                          </Link>
                        </li>
                      )}
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          Đăng xuất
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
        style={{ width: "66vw", maxWidth: "400px" }}
      >
        <div className="offcanvas-header">
          <Link
            to="/"
            onClick={handleCloseMenu}
            className="offcanvas-title fw-bold text-decoration-none text-dark"
            id="offcanvasMenuLabel"
          >
            Thư Viện Số
          </Link>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body px-4">
          {auth.isLoggedIn && (
            <div className="d-flex align-items-center mb-4 p-2 rounded shadow-sm bg-light">
              <img
                src={userInfo.avatar}
                alt="avatar"
                className="rounded-circle me-3"
                style={{ width: "48px", height: "48px", objectFit: "cover" }}
              />
              <div>
                <div className="fw-bold">{userInfo.name}</div>
                <div className="text-muted small">
                  {auth.role === "admin" ? "Thủ thư" : "Người đọc"}
                </div>
              </div>
            </div>
          )}

          <form className="mb-4" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control rounded-pill shadow-sm"
              placeholder="Tìm kiếm sách..."
              value={keyword}
              onChange={handleChange}
            />
          </form>

          <ul className="list-unstyled fs-5">
            <li className="mb-3">
              <Link className="text-decoration-none text-dark" to="/books" onClick={handleCloseMenu}>
                📚 Kho Sách
              </Link>
            </li>
            <li className="mb-3">
              <Link className="text-decoration-none text-dark" to="/categories" onClick={handleCloseMenu}>
                🗂️ Danh Mục
              </Link>
            </li>
            {!auth.isLoggedIn ? (
              <>
                <li className="mb-3">
                  <Link className="text-decoration-none text-dark" to="/login" onClick={handleCloseMenu}>
                    🔑 Đăng nhập
                  </Link>
                </li>
                <li className="mb-3">
                  <Link className="text-decoration-none text-dark" to="/register" onClick={handleCloseMenu}>
                    📝 Đăng ký
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="mb-3">
                  <Link className="text-decoration-none text-dark" to="/history" onClick={handleCloseMenu}>
                    🕘 Lịch sử
                  </Link>
                </li>
                <li className="mb-3">
                  <Link className="text-decoration-none text-dark" to="/profile" onClick={handleCloseMenu}>
                    👤 Thông tin
                  </Link>
                </li>
                <li className="mb-3">
                  <Link className="text-decoration-none text-dark" to="/change-password" onClick={handleCloseMenu}>
                    🔒 Đổi mật khẩu
                  </Link>
                </li>
                {auth.role === "admin" && (
                  <li className="mb-3">
                    <Link
                      className="text-decoration-none text-dark"
                      to="/library-management"
                      onClick={handleCloseMenu}
                    >
                      🛠️ Quản lý
                    </Link>
                  </li>
                )}
                <li>
                  <button className="btn btn-link text-danger p-0" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <script src={bootstrapJS}></script>
    </>
  );
}