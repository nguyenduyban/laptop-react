import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../API/Categories";

const AdminDanhMuc = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    tendanhmuc: "",
    mota: "",
    hinhanh: null,
    trangthai: 1, // Mặc định hiển thị
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể tải danh mục", "error");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tendanhmuc.trim()) {
      Swal.fire("Cảnh báo", "Tên danh mục không được để trống", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("tendanhmuc", form.tendanhmuc);
    formData.append("mota", form.mota || "");
    formData.append("trangthai", form.trangthai);
    if (form.hinhanh instanceof File) {
      formData.append("hinhanh", form.hinhanh);
    }

    Swal.fire({
      title: editing ? "Đang cập nhật..." : "Đang thêm...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      if (editing) {
        await updateCategory(editing.id, formData);
      } else {
        await createCategory(formData);
      }

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: editing ? "Cập nhật thành công" : "Thêm danh mục thành công",
        timer: 1500,
        showConfirmButton: false,
      });

      resetForm();
      fetchData();
    } catch (err) {
      const response = err.response;
      let msg = "Không thể lưu danh mục.";

      if (response?.status === 422 && response.data?.errors) {
        msg = Object.values(response.data.errors).flat().join("<br>");
      } else if (response?.data?.message) {
        msg = response.data.message;
      }

      Swal.fire({ icon: "error", title: "Lỗi", html: msg });
    }
  };

  const resetForm = () => {
    setForm({ tendanhmuc: "", mota: "", hinhanh: null, trangthai: 1 });
    setPreview(null);
    setEditing(null);
  };

  const handleEdit = (dm) => {
    setEditing(dm);
    setForm({
      tendanhmuc: dm.tendanhmuc,
      mota: dm.mota || "",
      hinhanh: null,
      trangthai: dm.trangthai ?? 1,
    });
    setPreview(
      dm.hinhanh ? `https://be-laravel.onrender.com/storage/img/${dm.hinhanh}` : null
    );
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa danh mục?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory(id);
      Swal.fire("Đã xóa!", "Danh mục đã được xóa.", "success");
      fetchData();
    } catch {
      Swal.fire("Lỗi", "Không thể xóa danh mục", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, hinhanh: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const filtered = (categories || []).filter((d) =>
    d.tendanhmuc?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* TITLE */}
        <h3 className="fw-bold mb-4">
          <i className="fa-solid fa-folder text-primary me-2"></i>
          Quản lý Danh mục
        </h3>

        {/* FILTER BAR */}
        <div className="row g-3 my-4">
          <div className="col-md-5">
            <input
              className="form-control rounded-pill"
              placeholder="Tìm tên danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FORM */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Tên danh mục..."
              value={form.tendanhmuc}
              onChange={(e) => setForm({ ...form, tendanhmuc: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Mô tả..."
              value={form.mota}
              onChange={(e) => setForm({ ...form, mota: e.target.value })}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select rounded-pill"
              value={form.trangthai}
              onChange={(e) =>
                setForm({ ...form, trangthai: Number(e.target.value) })
              }
            >
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="file"
              className="form-control rounded-pill"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="col-md-2 d-flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-success rounded-pill w-100"
            >
              {editing ? "Cập nhật" : "Thêm mới"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary rounded-pill w-100"
                onClick={resetForm}
              >
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* PREVIEW ẢNH */}
        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail"
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
        )}

        {/* TABLE */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Đang tải danh mục...</p>
            </div>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Ảnh</th>
                  <th>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      <i className="fa-solid fa-inbox fa-2x mb-2 d-block"></i>
                      Không có danh mục nào
                    </td>
                  </tr>
                ) : (
                  filtered.map((dm, idx) => (
                    <tr key={dm.id}>
                      <td>{idx + 1}</td>
                      <td>
                        {dm.hinhanh ? (
                          <img
                            src={`https://be-laravel.onrender.com/storage/img/${dm.hinhanh}`}
                            alt={dm.tendanhmuc}
                            width="60"
                            height="60"
                            className="rounded"
                            style={{ objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light border rounded d-flex align-items-center justify-content-center text-muted"
                            style={{ width: 60, height: 60, fontSize: 12 }}
                          >
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{dm.tendanhmuc}</td>
                      <td>
                        <small className="text-muted">
                          {dm.mota?.substring(0, 50) || "—"}
                          {dm.mota?.length > 50 && "..."}
                        </small>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(dm)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(dm.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDanhMuc;
