import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import { sendEmail } from "../services/emailService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

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
      const exists = await ApiService.checkEmailExists(email);
      if (!exists.exists) {
        setNotFound(true);
        setError("Email không tồn tại trong hệ thống.");
      } else {
        await handleSendOtp(email);
        navigate("/enter-otp", { state: { email } });
      }
    }
  };

  const handleSendOtp = async (email) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await sendEmail({
        serviceId: "service_iz7a11j", // Thay bằng ID bạn tạo ở EmailJS
        templateId: "template_jchuvse", // Thay bằng template ID
        publicKey: "jMVWFjbzNWko1v5d2", // Thay bằng public key trong dashboard
        templateParams: {
          email: email,
          otp: otpCode
        },
      });
      console.log("OTP đã được gửi tới email của bạn!");
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      console.log("Gửi OTP thất bại!");
    }
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
