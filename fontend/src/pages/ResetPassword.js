import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiServiceAdmin from "../services/admin/api";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [submitError, setSubmitError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải từ 6 ký tự trở lên.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setSubmitError("");

    if (validate()) {
      try {
        await ApiServiceAdmin.resetPassword(email, newPassword);
        setSuccessMsg("✅ Cập nhật mật khẩu thành công!");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error("Lỗi khi đổi mật khẩu:", err);
        setSubmitError("Đổi mật khẩu thất bại. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white shadow rounded p-5" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center text-danger mb-4">Đặt lại mật khẩu</h3>
        <p className="text-center text-muted mb-4">
          Vui lòng nhập mật khẩu mới cho tài khoản <strong>{email || "người dùng"}</strong>
        </p>

        {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}
        {submitError && <div className="alert alert-danger text-center">{submitError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && (
              <div className="invalid-feedback">{errors.newPassword}</div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>
          <button type="submit" className="btn btn-danger w-100">
            Xác nhận đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}
