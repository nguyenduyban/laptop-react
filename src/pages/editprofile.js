import React, { useState } from "react";
import { updateProfile } from "../API/Auth";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaEdit, FaPlus, FaLock, FaLink } from "react-icons/fa";
import { CgPassword } from "react-icons/cg";

function AccountPage() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const { user, loginUser } = useAuth();
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    password: "",
    sdt: user?.sdt || "",
    email: user?.email || "",
    diachi: user?.diachi || "",
  });
  const validate = (name, value) => {
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

    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    validate("email", formData.email);
    validate("sdt", formData.sdt);

    if (errors.email || errors.sdt) {
      Swal.fire("Lỗi", "❌ Vui lòng nhập đúng Email và Số điện thoại", "error");
      return;
    }

    try {
      const res = await updateProfile(formData);
      loginUser(res.user);
      Swal.fire("Thành công", res.message, "success");
    } catch (err) {
      Swal.fire("Lỗi", err.message || "Không thể cập nhật", "error");
    }
  };

  return (
    <div className="container my-5">
      {/* 🧍 Hồ sơ người dùng */}
      <div className="card border-0 shadow-lg rounded-4 mb-5 overflow-hidden">
        <div className="card-header bg-primary text-white py-3">
          <h5 className="m-0 fw-bold">Hồ sơ cá nhân</h5>
        </div>
        <div className="card-body">
          <div className="row align-items-center mb-4">
            <div className="col-md-2 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Avatar"
                className="rounded-circle shadow-sm"
                width="60"
                height="60"
              />
            </div>
            <div className="col-md-10">
              <h5 className="fw-semibold mb-1">
                {user?.fullname || "Người dùng mới"}
              </h5>
              <p className="text-muted mb-2">{user?.email}</p>
            </div>
          </div>

          <hr />

          <form onSubmit={handleUpdate}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Họ và tên</label>
                <input
                  type="text"
                  name="fullname"
                  className="form-control rounded-3"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control rounded-3"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Số điện thoại</label>
                <input
                  type="text"
                  name="sdt"
                  className={`form-control rounded-3 ${
                    errors.sdt ? "is-invalid" : ""
                  }`}
                  value={formData.sdt}
                  onChange={handleChange}
                />
                {errors.sdt && (
                  <div className="invalid-feedback">{errors.sdt}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control rounded-3 ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Địa chỉ</label>
                <input
                  type="text"
                  name="diachi"
                  className="form-control rounded-3"
                  value={formData.diachi}
                  onChange={handleChange}
                />
              </div>
              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary">
                  <FaEdit className="me-2" /> Lưu thay đổi
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
