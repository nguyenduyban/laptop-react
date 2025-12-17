import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllNCC, createNCC, updateNCC, deleteNCC } from "../API/NhaCungCap";

const AdminNhaCungCap = () => {
  const [list, setList] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    ten: "",
    email: "",
    sdt: "",
    dia_chi: "",
    ghi_chu: "",
  });
  const [editId, setEditId] = useState(null);

  // Load danh sách
  const loadData = async () => {
    const res = await getAllNCC();
    setList(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);
  const validate = () => {
    let newErrors = {};

    // Tên
    if (!form.ten.trim()) {
      newErrors.ten = "Tên nhà cung cấp không được để trống";
    }

    // Email
    if (form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Email không hợp lệ";
      }
    }
    if (!form.email.trim()) {
      newErrors.email = "Email nhà cung cấp không được để trống";
    }

    // SĐT
    if (form.sdt) {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if (!phoneRegex.test(form.sdt)) {
        newErrors.sdt = "Số điện thoại không hợp lệ";
      }
    }
    if (!form.sdt.trim()) {
      newErrors.sdt = "Số điện thoại nhà cung cấp không được để trống";
    }
    //dia chi
    if (!form.dia_chi.trim()) {
      newErrors.dia_chi = "Địa chỉ nhà cung cấp không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (editId) {
        await updateNCC(editId, form);
        Swal.fire("Thành công", "Cập nhật nhà cung cấp thành công!", "success");
      } else {
        await createNCC(form);
        Swal.fire("Thành công", "Thêm nhà cung cấp mới!", "success");
      }

      setForm({ ten: "", email: "", sdt: "", dia_chi: "", ghi_chu: "" });
      setEditId(null);
      setErrors({});
      loadData();
    } catch (err) {
      Swal.fire("Lỗi", "Không thể xử lý yêu cầu!", "error");
    }
  };

  // Xóa
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn chắc chưa?",
      text: "Dữ liệu sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteNCC(id);
        loadData();
        Swal.fire("Đã xóa!", "", "success");
      }
    });
  };

  // Edit
  const handleEdit = (ncc) => {
    setForm(ncc);
    setEditId(ncc.id);
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý Nhà Cung Cấp</h3>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="card p-3 mt-3">
        <div className="row">
          <div className="col-md-6 mb-2">
            <label>Tên</label>
            <input
              className={`form-control ${errors.ten ? "is-invalid" : ""}`}
              name="ten"
              value={form.ten}
              onChange={handleChange}
            />
            {errors.ten && <div className="invalid-feedback">{errors.ten}</div>}
          </div>

          <div className="col-md-6 mb-2">
            <label>Email</label>
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="col-md-6 mb-2">
            <label>Số điện thoại</label>
            <input
              className={`form-control ${errors.sdt ? "is-invalid" : ""}`}
              name="sdt"
              value={form.sdt}
              onChange={handleChange}
            />
            {errors.sdt && <div className="invalid-feedback">{errors.sdt}</div>}
          </div>

          <div className="col-md-6 mb-2">
            <label>Địa chỉ</label>
            <input
              className="form-control"
              name="dia_chi"
              value={form.dia_chi}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-12 mb-2">
            <label>Ghi chú</label>
            <textarea
              className="form-control"
              name="ghi_chu"
              value={form.ghi_chu}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3">
          {editId ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      {/* TABLE */}
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Địa Chỉ</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.ten}</td>
              <td>{item.email}</td>
              <td>{item.sdt}</td>
              <td>{item.dia_chi}</td>
              <td>{item.ghi_chu}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(item)}
                >
                  Sửa
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNhaCungCap;