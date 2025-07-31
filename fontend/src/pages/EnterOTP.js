import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendEmail } from "../services/emailService";

export default function EnterOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [resending, setResending] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Lấy email và OTP từ ForgotPassword truyền sang
  const { email, otp: expectedOtp } = location.state || {};

  useEffect(() => {
    if (!email || !expectedOtp) {
      navigate("/forgot-password");
    }
  }, [email, expectedOtp, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Vui lòng nhập mã OTP.");
    } else if (timeLeft <= 0) {
      setError("Mã OTP đã hết hạn. Vui lòng thử lại.");
    } else if (otp !== expectedOtp) {
      setError("Mã OTP không chính xác!");
    } else {
      // Mã đúng → chuyển sang đặt lại mật khẩu
      navigate("/reset-password", { state: { email } });
    }
  };

  const handleResend = async () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setResending(true);
    setError("");
    setOtp("");

    try {
      await sendEmail({
        serviceId: "service_iz7a11j",
        templateId: "template_jchuvse",
        publicKey: "jMVWFjbzNWko1v5d2",
        templateParams: {
          email: email,
          otp: newOtp,
        },
      });

      // Cập nhật expectedOtp mới vào location.state
      location.state.otp = newOtp;
      console.log("OTP mới đã gửi:", newOtp);

      setTimeLeft(60);
    } catch (error) {
      console.error("Lỗi gửi lại OTP:", error);
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white shadow rounded p-5" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center text-danger mb-4">Xác minh mã OTP</h3>

        <p className="text-center text-muted mb-3">
          Mã xác minh đã được gửi đến email <strong>{email}</strong>.
        </p>
        <p className="text-center text-muted mb-3">
          Thời gian còn lại: <strong>{timeLeft}s</strong>
        </p>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={timeLeft <= 0}
            />
          </div>
          <button className="btn btn-danger w-100" type="submit" disabled={timeLeft <= 0}>
            Xác nhận
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-link text-danger"
            onClick={handleResend}
            disabled={resending || timeLeft > 0}
          >
            {resending ? "Đang gửi lại..." : "Thử lại"}
          </button>
        </div>
      </div>
    </div>
  );
}
