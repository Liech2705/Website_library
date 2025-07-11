import React, { useState, useEffect } from "react";
import ApiService from "../services/api";
import "./style.css";

export default function ProfilePage() {
  // Lấy user từ localStorage (nếu đã đăng nhập)
  const localUser = ApiService.getCurrentUser();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    school_name: "",
    role: "",
    status: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Lấy thông tin user_infor và user từ backend khi vào trang
  useEffect(() => {
    const fetchUserInfor = async () => {
      try {
        // Lấy thông tin user cơ bản từ localStorage
        let baseUser = {
          name: localUser.name || "",
          email: localUser.email || "",
          role: localUser.role || "",
          status: "active"

        };
        // Lấy thông tin user_infor từ backend
        const infor = await ApiService.getMyUserInfor();
        setUser({
          ...baseUser,
          phone: infor?.phone || "",
          address: infor?.address || "",
          school_name: infor?.school_name || "",
          avatar: process.env.REACT_APP_STORAGE_URL + infor?.avatar || "",
        });
      } catch (err) {
        // Nếu lỗi vẫn gán thông tin cơ bản
        setUser({
          name: localUser.name || "",
          email: localUser.email || "",
          role: localUser.role || "",
          status: localUser.status || "",
          avatar: "",
          phone: "",
          address: "",
          school_name: "",
        });
      }
    };
    fetchUserInfor();
    // eslint-disable-next-line
  }, []);

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

  const handleSaveInfo = async () => {
    const errs = validateInfo();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSuccess("");
    } else {
      try {
        await ApiService.updateUserProfile({
          phone: user.phone,
          address: user.address,
          school_name: user.school_name,
        });
        setSuccess("✅ Cập nhật thông tin thành công!");
        setErrors({});
      } catch (err) {
        setErrors({ general: err.message || "Cập nhật thất bại." });
        setSuccess("");
      }
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const res = await ApiService.updateUserAvatar(file);
        setUser({ ...user, avatar: res.url });
        setSuccess("✅ Đổi ảnh đại diện thành công!");
      } catch (err) {
        setErrors({ general: err.message || "Đổi ảnh đại diện thất bại." });
        setSuccess("");
      }
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
                    src={user.avatar || "https://yt3.ggpht.com/yti/ANjgQV-FgWf4XF8YlaoUDJNhBbH7KQ8nK9jSlWtuRle6_trGSaY=s88-c-k-c0x00ffffff-no-rj-mo"}
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
                      onChange={handleAvatarChange}
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
                        value={user.status === "active" ? "Hoạt động" : user.status === "locked" ? "Bị khóa" : user.status}
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary mt-3" onClick={handleSaveInfo}>
                        💾 Lưu thông tin
                      </button>
                      {success && <div className="alert alert-success mt-2">{success}</div>}
                      {errors.general && <div className="alert alert-danger mt-2">{errors.general}</div>}
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
