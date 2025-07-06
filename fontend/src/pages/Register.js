import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiService from "../services/api";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) =>
    /^[\w-.]+@[\w-]+\.(edu\.vn)$/.test(email);

  const validateForm = () => {
    const errs = {};
    const { name, email, password, confirmPassword, phone } = form;

    if (!name.trim()) errs.name = "Vui lòng nhập tên đăng nhập.";
    else if (name.length < 6) errs.name = "Tên đăng nhập không được nhỏ hơn 6 ký tự.";

    if (!email.trim()) errs.email = "Vui lòng nhập email.";
    else if (!validateEmail(email)) errs.email = "Email phải có định dạng .edu.vn";

    if (!password) errs.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6) errs.password = "Mật khẩu phải từ 6 ký tự.";

    if (!confirmPassword) errs.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    else if (password !== confirmPassword) errs.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";

    if (!phone.trim()) errs.phone = "Vui lòng nhập số điện thoại.";

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

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Attempting registration...');
      // Register using API service
      await ApiService.register(form.name, form.email, form.password);

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      console.error('Register error:', error);

      // Handle validation errors from backend
      if (error.message.includes('{')) {
        try {
          const backendErrors = JSON.parse(error.message);
          setErrors(backendErrors);
          return;
        } catch (parseError) {
          console.error('Error parsing backend errors:', parseError);
        }
      }

      setErrors({ general: error.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
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
          {errors.general && <div className="alert alert-danger">{errors.general}</div>}

          <form onSubmit={handleRegister} noValidate>
            {[
              { name: "name", type: "text", placeholder: "Tên đăng nhập" },
              { name: "phone", type: "text", placeholder: "Số điện thoại" },
              { name: "email", type: "email", placeholder: "Email .edu.vn" },
              { name: "password", type: "password", placeholder: "Mật khẩu" },
              { name: "confirmPassword", type: "password", placeholder: "Xác nhận mật khẩu" }
            ].map(({ name, type, placeholder }) => (
              <div className="mb-3" key={name}>
                <input
                  type={type}
                  name={name}
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                />
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
              </div>
            ))}

            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" required id="agree" />
              <label className="form-check-label" htmlFor="agree">
                Tôi đồng ý với điều khoản sử dụng
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
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
