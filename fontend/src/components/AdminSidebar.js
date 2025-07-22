import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ApiService from "../services/api";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";

export default function AdminSidebarLayout({ children }) {
  const location = useLocation();
  const notiRef = useRef();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 768);
  const [notifications, setNotifications] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "admin", avatar: "" });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width >= 768) {
        setIsSidebarVisible(true);
      } else if (!isSidebarVisible) {
        setIsSidebarVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Đóng thông báo khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy thông tin người dùng & thông báo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ApiService.getMyUserInfor();
        const avatar = process.env.REACT_APP_STORAGE_URL + (res?.avatar || "");
        const name =
          localStorage.getItem("username") === "null"
            ? "admin"
            : localStorage.getItem("username") || "admin";

        setUserInfo({ name, avatar });

        const userId = localStorage.getItem("user_id");
        if (userId) {
          const noti = await ApiService.getNotificationsByUser(userId);
          setNotifications(noti);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin admin hoặc thông báo:", err);
      }
    };

    if (localStorage.getItem("isLoggedIn") === "true") {
      fetchData();
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleCloseSidebar = () => {
    if (windowWidth < 768) setIsSidebarVisible(false);
  };

  const shouldShowSidebar = isSidebarVisible;

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 bg-light">
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 sidebar-custom position-fixed top-0 bottom-0 start-0 z-2 ${
          shouldShowSidebar ? "d-block" : "d-none"
        }`}
        style={{
          width: "250px",
          top: "60px", // Bắt đầu từ dưới top bar
          overflowY: "auto", // Thêm cuộn nếu nội dung sidebar dài
          height: "calc(100% - 60px)", // Chiều cao trừ đi top bar
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white">Thư Viện</h5>
          {windowWidth < 768 && (
            <button
              className="btn btn-sm btn-outline-light"
              onClick={handleCloseSidebar}
            >
              <i className="bi bi-x" />
            </button>
          )}
        </div>

        <ul className="nav flex-column gap-2">
          {[
            { to: "/library-management", icon: "grid", label: "Dashboard" },
            { to: "/admin/bookmanagement", icon: "journal-bookmark-fill", label: "Quản lý sách" },
            { to: "/admin/usermanagement", icon: "people", label: "Quản lý người dùng" },
            { to: "/admin/borrowManagement", icon: "arrow-left-right", label: "Quản lý mượn trả" },
            { to: "/admin/history", icon: "clock-history", label: "Lịch sử thao tác" },
            { to: "/admin/statisticsreport", icon: "bar-chart-line", label: "Báo cáo thống kê" },
          ].map(({ to, icon, label }) => (
            <li key={to} className="nav-item">
              <Link
                to={to}
                className={`nav-link ${isActive(to) ? "text-warning fw-bold" : "text-white"}`}
                onClick={handleCloseSidebar}
              >
                <i className={`bi bi-${icon} me-2`} /> {label}
              </Link>
            </li>
          ))}

          <li className="nav-item mt-4">
            <Link to="/" className="nav-link text-danger" onClick={handleCloseSidebar}>
              <i className="bi bi-box-arrow-left me-2" /> Thoát
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div
        className="flex-grow-1"
        style={{
          paddingLeft: shouldShowSidebar && windowWidth >= 768 ? "260px" : "15px", // Giảm padding-left trên mobile
          transition: "padding-left 0.3s",
          paddingTop: "70px", // Đảm bảo nội dung không bị che bởi top bar
          marginLeft: shouldShowSidebar && windowWidth < 768 ? "250px" : "0", // Dịch nội dung sang phải khi sidebar mở trên mobile
        }}
      >
        {/* Top bar */}
        <div
          className="d-flex justify-content-between align-items-center p-3 shadow-sm bg-white sticky-top"
          style={{ zIndex: 3, position: "fixed", top: 0, width: "100%" }} // Top bar cố định
        >
          <button
            className="btn btn-outline-secondary"
            onClick={handleToggleSidebar}
            style={{ display: shouldShowSidebar && windowWidth < 768 ? "none" : "block" }} // Ẩn nút khi sidebar mở trên mobile
          >
            <i className="bi bi-list fs-4" />
          </button>

          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* Notifications */}
            <div className="position-relative" ref={notiRef}>
              <button
                className="btn btn-outline-secondary position-relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi bi-bell fs-5" />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div
                  className="position-absolute bg-white shadow p-3 rounded"
                  style={{
                    right: 0,
                    top: "calc(100% + 10px)",
                    width: "300px",
                    zIndex: 999,
                  }}
                >
                  <h6 className="mb-2">🔔 Thông báo (Admin)</h6>
                  {notifications.length === 0 ? (
                    <div className="text-muted small">Không có thông báo.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`alert alert-${n.type === "success" ? "success" : "warning"} py-2 mb-2`}
                        style={{ fontSize: "0.9rem" }}
                      >
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="d-flex align-items-center">
              <img
                src={userInfo.avatar || "/default-avatar.png"}
                alt="admin"
                className="rounded-circle me-2"
                style={{ width: 40, height: 40, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}