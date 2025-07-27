import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[\w.-]+@([\w-]+\.)+edu\.vn$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotFound(false);

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
    } else if (!validateEmail(email)) {
      setError("Email không đúng định dạng .edu.vn");
    } else {
      // Giả lập kiểm tra email tồn tại
      const exists = await mockCheckEmailExists(email);
      if (!exists) {
        setNotFound(true);
        setError("Email không tồn tại trong hệ thống.");
      } else {
        await fakeSendOTP(email); // Gửi OTP giả lập
        navigate("/enter-otp", { state: { email } });
      }
    }
  };

  // Giả lập API gửi OTP
  const fakeSendOTP = (email) => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Giả lập kiểm tra email tồn tại trong hệ thống
  const mockCheckEmailExists = (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exists = email === "camloan@student.ctuet.edu.vn"; // chỉ email này hợp lệ
        resolve(exists);
      }, 500);
    });
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white shadow rounded p-5" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center text-danger mb-4">Quên mật khẩu</h3>
        <p className="text-center text-muted mb-4">Nhập email đã đăng ký để lấy lại mật khẩu</p>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email .edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-danger w-100">Gửi mã OTP</button>

          <p className="text-center mt-3">
            Trở lại <Link to="/login" className="text-decoration-none">Đăng nhập</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
