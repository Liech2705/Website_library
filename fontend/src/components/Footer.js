import { Link } from "react-router-dom";
import './style.css';
// import "bootstrap-icons/font/bootstrap-icons.css";


export default function Footer() {
  const navLinks = [
    { path: "/", label: "Trang Chủ" },
    { path: "/login", label: "Đăng Nhập" },
    { path: "/register", label: "Đăng Ký" },
  ];

  return (
          <footer className="bg-light text-dark mt-5 pt-4 pb-3">
        <div className="container">
          <div className="row">
            {/* Thông tin liên hệ */}
            <div className="col-md-4 mb-4">
              <h5 className="mb-3">📍 Thông Tin Liên Hệ</h5>
              <p className="mb-1">Địa chỉ: 257 Nguyễn Đệ, An Hòa, Ninh Kiều, Cần Thơ</p>
              <p className="mb-1">Email: thuvien@gmail.com</p>
              <p className="mb-0">Điện thoại: 0909 123 456</p>
            </div>

            {/* Liên kết nhanh */}
            <div className="col-md-4 mb-4">
              <h5 className="mb-3">🔗 Liên Kết Nhanh</h5>
              <ul className="list-unstyled">
                {navLinks.map((link, i) => (
                  <li key={i} className="mb-2">
                    <Link to={link.path} className="text-dark text-decoration-none">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mạng xã hội */}
            <div className="col-md-4 mb-4">
              <h5 className="mb-3">🌐 Theo Dõi Chúng Tôi</h5>
              <p className="mb-2">
                <a
                  href="https://facebook.com/thuvien"
                  className="text-dark text-decoration-none me-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📘 Facebook
                </a>
              </p>
              <p className="mb-0">
                <a
                  href="https://twitter.com/thuvien"
                  className="text-dark text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🐦 Twitter
                </a>
              </p>
            </div>
          </div>

          <hr className="bg-dark" />
          <div className="text-center small">
            &copy; {new Date().getFullYear()} <strong>Thư Viện Số</strong>. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>

  );
}
