import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { register } from "../API/Auth";

const Signinpage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullname: "",
    diachi: "",
    sdt: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Validate từng field
  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "Email không được để trống";
      else if (!emailRegex.test(value)) error = "Email không hợp lệ";
    }

    if (name === "sdt") {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if (!value) error = "Số điện thoại không được để trống";
      else if (!phoneRegex.test(value)) error = "Số điện thoại không hợp lệ";
    }

    if (name === "password") {
      if (!value) error = "Mật khẩu không được để trống";
      else if (value.length < 6) error = "Mật khẩu tối thiểu 6 ký tự";
    }

    if (name === "username" && !value) {
      error = "Username không được để trống";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // 🟢 Khi nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // 🟣 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    const hasError = Object.values(errors).some((err) => err);
    if (hasError) return;

    setLoading(true);
    try {
      await register(formData);
      setMessage("✅ Đăng ký thành công! Vui lòng đăng nhập.");
      setFormData({
        username: "",
        password: "",
        email: "",
        fullname: "",
        diachi: "",
        sdt: "",
      });
      setErrors({});
    } catch (err) {
      setMessage(err.message || "❌ Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
    if (errors.email || errors.sdt) {
      setMessage("❌ Vui lòng nhập đúng thông tin");
      return;
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: "linear-gradient(135deg, #007bff, #004085)" }}
    >
      <div className="text-center w-100" style={{ maxWidth: "420px" }}>
        <div className="mb-4 text-white">
          <i className="bi bi-cart3 display-1"></i>
        </div>

        <div className="card shadow border-0 rounded-4 p-4">
          <div className="card-body">
            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-3">
                <input
                  type="text"
                  name="username"
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  placeholder="USERNAME"
                  value={formData.username}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.username}</div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.password}</div>
              </div>

              {/* Fullname */}
              <div className="mb-3">
                <input
                  type="text"
                  name="fullname"
                  className="form-control"
                  placeholder="FULL NAME"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>

              {/* Địa chỉ */}
              <div className="mb-3">
                <input
                  type="text"
                  name="diachi"
                  className="form-control"
                  placeholder="ĐỊA CHỈ"
                  value={formData.diachi}
                  onChange={handleChange}
                />
              </div>

              {/* SĐT */}
              <div className="mb-3">
                <input
                  type="text"
                  name="sdt"
                  className={`form-control ${errors.sdt ? "is-invalid" : ""}`}
                  placeholder="SỐ ĐIỆN THOẠI"
                  value={formData.sdt}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.sdt}</div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-primary fw-bold"
                  disabled={loading}
                >
                  {loading ? "Đang đăng ký..." : "SIGN UP"}
                </button>
              </div>

              {message && (
                <div className="alert alert-info py-2">{message}</div>
              )}

              <a
                href="/login"
                className="text-decoration-none small text-primary"
              >
                Đã có tài khoản? Đăng nhập ngay
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signinpage;
