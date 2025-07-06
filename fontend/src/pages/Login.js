import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiService from "../services/api";

export default function LoginForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!user.email) errs.email = "Vui lòng nhập email";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.vn$/.test(user.email))
      errs.email = "Email phải có đuôi edu.vn";

    if (!user.password) errs.password = "Vui lòng nhập mật khẩu";
    else if (user.password.length < 6) errs.password = "Mật khẩu phải từ 6 ký tự";

    return errs;
  };

  const login = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Attempting login with:', { email: user.email });

      // Login using API service
      const loginData = await ApiService.login(user.email, user.password);

      // Store token
      localStorage.setItem('access_token', loginData.access_token);
      localStorage.setItem('token_type', loginData.token_type);
      localStorage.setItem('isLoggedIn', 'true');

      // Lưu thông tin user từ response
      if (loginData.user) {
        localStorage.setItem('user_id', loginData.user.id);
        localStorage.setItem('username', loginData.user.name);
        localStorage.setItem('role', loginData.user.role || 'reader');
        localStorage.setItem('email', loginData.user.email);

        console.log('Login successful, user role:', loginData.user.role);
      } else {
        // Fallback nếu không có thông tin user
        localStorage.setItem('email', user.email);
        localStorage.setItem('role', 'reader');
        localStorage.setItem('username', user.email.split('@')[0]);
      }

      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row shadow rounded overflow-hidden" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="col-md-6 bg-white p-5">
          <h3 className="text-center mb-4 text-danger">Đăng nhập</h3>

          <div className="d-flex justify-content-center gap-3 mb-3">
            {["Đ", "N", "T", "K"].map((c, i) => (
              <button key={i} className="btn btn-outline-danger rounded-circle">{c}</button>
            ))}
          </div>

          <p className="text-center text-muted">Điền đầy đủ thông tin bên dưới</p>
          {errors.general && <div className="alert alert-danger">{errors.general}</div>}

          <form onSubmit={login}>
            {[
              { name: "email", type: "email", placeholder: "Email .edu.vn" },
              { name: "password", type: "password", placeholder: "Mật khẩu" }
            ].map(({ name, type, placeholder }) => (
              <div className="mb-3" key={name}>
                <input
                  type={type}
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  placeholder={placeholder}
                  value={user[name]}
                  onChange={(e) => setUser({ ...user, [name]: e.target.value })}
                />
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
              </div>
            ))}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="agree" />
                <label className="form-check-label" htmlFor="agree">Ghi nhớ tài khoản</label>
              </div>
              <Link to="/forgot-password" className="text-decoration-none text-danger">
                Quên mật khẩu?
              </Link>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-danger w-50"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
              <Link to="/register" className="btn btn-outline-danger w-50">Đăng ký</Link>
            </div>

            {/* Test accounts info */}
            <div className="mt-3 p-3 bg-light rounded">
              <small className="text-muted">
                <strong>Test Accounts:</strong><br />
                Admin: hoailinh@student.ctuet.edu.vn / HoaiLinh12345<br />
                User: user@student.ctuet.edu.vn / User12345
              </small>
            </div>
          </form>
        </div>

        <div className="col-md-6 p-0 d-none d-md-block">
          <img
            src="https://www.netabooks.vn/Data/Sites/1/Product/68167/mot-cuon-sach-chua-lanh-4.jpg"
            alt="Login"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}