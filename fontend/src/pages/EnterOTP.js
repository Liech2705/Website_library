import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EnterOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

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
    } else if (otp !== "123456") {
      setError("Mã OTP không chính xác!");
    } else if (timeLeft <= 0) {
      setError("Mã OTP đã hết hạn. Vui lòng thử lại.");
    } else {
      navigate("/reset-password", { state: { email } });
    }
  };

  const fakeSendOTP = (email) => {
    return new Promise((resolve) => {
      console.log("Gửi OTP mới đến:", email);
      setTimeout(resolve, 1000);
    });
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setOtp("");
    await fakeSendOTP(email);
    setTimeLeft(60);
    setResending(false);
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
