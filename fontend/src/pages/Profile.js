import React, { useState } from "react";
import "./style.css";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Admin",
    email: "admin@student.edu.com",
    phone: "0899804328",
    address: "Bình Yên, Nam Thanh, Nam Trực",
    school_name: "Trường Đại học Công nghệ",
    role: "admin",
    status: "active", // hoặc 'locked'
    avatar:
      "https://yt3.ggpht.com/yti/ANjgQV-FgWf4XF8YlaoUDJNhBbH7KQ8nK9jSlWtuRle6_trGSaY=s88-c-k-c0x00ffffff-no-rj-mo",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateInfo = () => {
    const errs = {};
    if (!user.name.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!user.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    if (!user.address.trim()) errs.address = "Vui lòng nhập địa chỉ";
    if (!user.school_name.trim()) errs.school_name = "Vui lòng nhập trường học";
    return errs;
  };

  const validatePassword = () => {
    const errs = {};
    if (!user.password) errs.password = "Vui lòng nhập mật khẩu hiện tại";
    if (!user.newPassword) errs.newPassword = "Vui lòng nhập mật khẩu mới";
    else if (user.newPassword.length < 6)
      errs.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    if (user.newPassword !== user.confirmPassword)
      errs.confirmPassword = "Xác nhận mật khẩu không trùng khớp";
    return errs;
  };

  const handleSaveInfo = () => {
    const errs = validateInfo();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      alert("✅ Cập nhật thông tin thành công!");
      setErrors({});
    }
  };

  const handleUpdatePassword = () => {
    const errs = validatePassword();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      alert("✅ Cập nhật mật khẩu thành công!");
      setErrors({});
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="container">
        <h3 className="mb-4 fw-bold text-center">Trang cá nhân</h3>
        <div className="row">
          <div className="col-md-10 col-lg-8 mx-auto">
            <div className="card p-4 shadow-sm mb-4">
              <h5 className="mb-3 fw-bold">Thông tin tài khoản</h5>

              <div className="row">
                {/* Avatar */}
                <div className="col-md-3 text-center">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="rounded border mb-2"
                    style={{
                      width: "100%",
                      maxWidth: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <label className="btn btn-light btn-sm border">
                    📤 Thay ảnh đại diện
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () =>
                            setUser({ ...user, avatar: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Info fields */}
                <div className="col-md-9">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Họ và tên *</label>
                      <input
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input className="form-control" value={user.email} disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Số điện thoại *</label>
                      <input
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Địa chỉ *</label>
                      <input
                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Trường học *</label>
                      <input
                        className={`form-control ${errors.school_name ? "is-invalid" : ""}`}
                        name="school_name"
                        value={user.school_name}
                        onChange={handleChange}
                      />
                      {errors.school_name && (
                        <div className="invalid-feedback">{errors.school_name}</div>
                      )}
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Vai trò</label>
                      <input className="form-control" value={user.role} disabled />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Trạng thái</label>
                      <input
                        className="form-control"
                        value={user.status === "active" ? "Hoạt động" : "Bị khóa"}
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary mt-3" onClick={handleSaveInfo}>
                        💾 Lưu thông tin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
