import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";

export default function AdminSidebarLayout({ children }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [openBookMenu, setOpenBookMenu] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const notiRef = useRef();

  const notifications = [
    { id: 1, type: "success", message: "✅ Đã thêm sách mới thành công." },
    { id: 2, type: "warning", message: "⚠️ Sách 'Lập trình C' sắp hết." },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className={`sidebar-custom p-3 text-white bg-dark ${isSidebarVisible ? "show" : "hide"}`}>

          <div className="text-center mb-4">
            <img
              src="https://media.istockphoto.com/id/1202911884/vi/vec-to/logo-s%C3%A1ch-v%C4%83n-h%E1%BB%8Dc-gi%C3%A1o-d%E1%BB%A5c-th%C6%B0-vi%E1%BB%87n-ki%E1%BA%BFn-th%E1%BB%A9c-%C4%91%E1%BB%8Dc-trang-nghi%C3%AAn-c%E1%BB%A9u-gi%E1%BA%A5y-vector-h%E1%BB%8Dc-tr%C6%B0%E1%BB%9Dng.jpg?s=170667a&w=0&k=20&c=kfffsGCfUSLINQSvjA3PNfxflPmimOYnTP-s1Orkmpc="
              alt="logo"
              className="sidebar-logo mb-2"
              style={{ width: 50, height: 50 }}
            />
            <h5>Thư Viện</h5>
          </div>

          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <Link
                to="/library-management"
                className={`nav-link ${isActive("/library-management") ? "text-warning fw-bold" : "text-white"}`}
              >
                <i className="bi bi-grid me-1" /> Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/bookmanagement"
                className={`nav-link ${isActive("/admin/bookmanagement") ? "text-warning fw-bold" : "text-white"}`}
              >
                <i className="bi bi-journal-bookmark-fill me-2" /> Quản lý sách 
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/usermanagement"
                className={`nav-link ${isActive("/admin/usermanagement") ? "text-warning fw-bold" : "text-white"}`}
              >
                <i className="bi bi-people me-2" /> Quản lý người dùng
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/borrowManagement"
                className={`nav-link ${isActive("/admin/borrowManagement") ? "text-warning fw-bold" : "text-white"}`}
              >
                <i className="bi bi-arrow-left-right me-2" /> Quản lý mượn trả
              </Link>
            </li>

             <li className="nav-item">
                  <Link
                    to="/admin/history"
                    className={`nav-link ${isActive("/admin/history") ? "text-warning fw-bold" : "text-white"}`}
                  >
                    <i className="bi bi-clock-history me-2" /> Lịch sử thao tác
                  </Link>
                </li>

            <li className="nav-item">
              <Link
                to="/admin/statisticsreport"
                className={`nav-link ${isActive("/admin/statisticsreport") ? "text-warning fw-bold" : "text-white"}`}
              >
                <i className="bi bi-bar-chart-line me-2" /> Báo cáo thống kê
              </Link>
            </li>


            <li className="nav-item mt-4">
              <Link to="/" className="nav-link text-danger">
                <i className="bi bi-box-arrow-left me-2" /> Thoát
              </Link>
            </li>
          </ul>
        </div>
      

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ overflowX: "hidden" }}>
        {/* Topbar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Hamburger icon */}
          <button
            className="btn btn-outline-secondary me-3"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          >
            <i className="bi bi-list fs-4" />
          </button>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <div className="position-relative" ref={notiRef}>
              <button
                className="btn btn-outline-secondary"
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
                  style={{ right: 0, width: "300px", zIndex: 999 }}
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

            <div className="d-flex align-items-center">
              <img
                src="https://lh3.googleusercontent.com/a/ACg8ocJr4wXQHjw_iFCjcNpKVonq6ZioOtci-_udeGEjy1JxE7oflru2=s192-c-rg-br100"
                alt="admin"
                className="rounded-circle me-2"
                style={{ width: 50, height: 50 }}
              />
              <span className="fw-bold">admin</span>
            </div>
          </div>
        </div>

        {/* Content children */}
        {children}
      </div>
    </div>
  );
}
