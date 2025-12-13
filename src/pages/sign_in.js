import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { register } from "../API/Auth"; // 🔹 Import API đăng ký

const Signinpage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    diachi: "",
    sdt: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullname: formData.fullname,
        diachi: formData.diachi,
        sdt: formData.sdt,
      });
      setMessage("✅ Đăng ký thành công! Vui lòng đăng nhập.");
      setFormData({
        username: "",
        email: "",
        password: "",
        diachi: "",
        fullname: "",
        sdt: "",
      });
    } catch (err) {
      setMessage(err.message || "❌ Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: "linear-gradient(135deg, #007bff, #004085)" }}
    >
      <div className="text-center w-100" style={{ maxWidth: "400px" }}>
        {/* Icon */}
        <div className="mb-4 text-white">
          <i className="bi bi-cart3 display-1"></i>
        </div>

        {/* Card */}
        <div className="card shadow border-0 rounded-4 p-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="USERNAME"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="PASSWORD"
                    required
                  />
                </div>
              </div>

              {/* ĐỊA CHỈ*/}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="text"
                    name="diachi"
                    value={formData.diachi}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="ĐỊA CHỈ"
                    required
                  />
                </div>
              </div>
              {/*sdt */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="text"
                    name="sdt"
                    value={formData.sdt}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, sdt: onlyNums });
                    }}
                    className="form-control border-start-0"
                    placeholder="SỐ ĐIỆN THOẠI"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="FULL NAME"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control border-start-0"
                    placeholder="EMAIL"
                    required
                  />
                </div>
              </div>

              {/* Button */}
              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-primary fw-bold"
                  disabled={loading}
                >
                  {loading ? "Đang đăng ký..." : "SIGN UP"}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className="alert alert-info py-2" role="alert">
                  {message}
                </div>
              )}

              {/* Link đến login */}
              <div>
                <a
                  href="/login"
                  className="text-decoration-none small"
                  style={{ color: "#0d6efd" }}
                >
                  Đã có tài khoản? Đăng nhập ngay
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signinpage;
