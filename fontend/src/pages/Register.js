import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiService from "../services/api";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "", password: "", confirmPassword: "", phone: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) =>
    /^[\w-.]+@[\w-]+\.(edu\.vn)$/.test(email);

  const validateForm = () => {
    const errs = {};
    const { email, password, confirmPassword, phone } = form;

    if (!email.trim()) errs.email = "Vui lòng nhập email.";
    else if (!validateEmail(email)) errs.email = "Email phải có định dạng .edu.vn";

    if (!password) errs.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6) errs.password = "Mật khẩu phải từ 6 ký tự.";

    if (!confirmPassword) errs.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    else if (password !== confirmPassword) errs.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";

    if (!phone.trim()) errs.phone = "Vui lòng nhập số điện thoại.";

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (existingUsers.some(u => u.email === email)) errs.email = "Email đã được sử dụng.";

    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      // Gọi API đăng ký
      await ApiService.register(form.phone, form.email, form.password);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      setErrors({ general: err.message || "Đăng ký thất bại." });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row shadow rounded overflow-hidden" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="col-md-6 bg-white p-5">
          <h3 className="text-center mb-4 text-danger">Đăng ký</h3>

          <div className="d-flex justify-content-center gap-3 mb-3">
            {["Đ", "K", "T", "K"].map((c, i) => (
              <button key={i} className="btn btn-outline-danger rounded-circle">{c}</button>
            ))}
          </div>

          <p className="text-center text-muted">Điền đầy đủ thông tin bên dưới</p>

          <form onSubmit={handleRegister} noValidate>
            {/* Email */}
            <div className="mb-3 position-relative">
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email .edu.vn"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div className="mb-3">
              <input
                type="text"
                name="phone"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#aaa"
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="mb-3 position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                placeholder="Xác nhận mật khẩu"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#aaa"
                }}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            {/* Checkbox + Submit */}
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" required id="agree" />
              <label className="form-check-label" htmlFor="agree">
                Tôi đồng ý với điều khoản sử dụng
              </label>
            </div>

            {errors.general && <div className="alert alert-danger">{errors.general}</div>}

            <button type="submit" className="btn btn-danger w-100">Đăng ký</button>
            <p className="text-center mt-3">
              Đã có tài khoản? <Link to="/login" className="text-decoration-none">Đăng nhập</Link>
            </p>
          </form>
        </div>

        <div className="col-md-6 p-0 d-none d-md-block">
          <img
            src="https://anybooks.vn/uploads/images/sach-999-la-thu-gui-cho-chinh-minh.jpeg"
            alt="Register"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
