import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { getAllTopic, addTopic, updateTopic, deleteTopic } from "../API/Topic";

const AdminTopic = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    tenchuyenmuc: "",
    mota: "",
    trangthai: 1,
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const data = await getAllTopic();
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể tải danh sách chuyên mục", "error");
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tenchuyenmuc.trim()) {
      Swal.fire("Cảnh báo", "Tên chuyên mục không được để trống", "warning");
      return;
    }

    try {
      if (editing) {
        await updateTopic(editing.id, form);
        Swal.fire("Thành công!", "Đã cập nhật chuyên mục", "success");
      } else {
        await addTopic(form);
        Swal.fire("Thành công!", "Đã thêm chuyên mục mới", "success");
      }
      resetForm();
      fetchTopics();
    } catch (err) {
      Swal.fire("Lỗi", "Không thể lưu chuyên mục", "error");
    }
  };

  const resetForm = () => {
    setForm({ tenchuyenmuc: "", mota: "", trangthai: 1 });
    setEditing(null);
  };

  const handleEdit = (topic) => {
    setEditing(topic);
    setForm({
      tenchuyenmuc: topic.tenchuyenmuc,
      mota: topic.mota || "",
      trangthai: topic.trangthai,
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa chuyên mục?",
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
      await deleteTopic(id);
      Swal.fire("Đã xóa!", "Chuyên mục đã được xóa.", "success");
      fetchTopics();
    } catch {
      Swal.fire("Lỗi", "Không thể xóa chuyên mục", "error");
    }
  };

  const filtered = (topics || []).filter((t) =>
    t.tenchuyenmuc?.toLowerCase().includes(search.toLowerCase())
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
          <i className="fa-solid fa-icons text-primary me-2"></i>
          Quản lý Chuyên mục
        </h3>

        {/* FORM + SEARCH BAR */}
        <div className="row g-3 mb-4">
          {/* TÊN CHUYÊN MỤC */}
          <div className="col-md-4">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Tên chuyên mục..."
              value={form.tenchuyenmuc}
              onChange={(e) =>
                setForm({ ...form, tenchuyenmuc: e.target.value })
              }
            />
          </div>

          {/* NÚT */}
          <div className="col-md-5 d-flex gap-2 align-items-start">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-success rounded-pill px-4"
            >
              {editing ? "Cập nhật" : "Thêm mới"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary rounded-pill px-4"
                onClick={resetForm}
              >
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* TÌM KIẾM */}
        <div className="row g-3 mb-4">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Tìm chuyên mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* BẢNG */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Đang tải chuyên mục...</p>
            </div>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Tên chuyên mục</th>
                  <th></th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      <i className="fa-solid fa-inbox fa-2x mb-2 d-block"></i>
                      Không có chuyên mục nào
                    </td>
                  </tr>
                ) : (
                  filtered.map((t, idx) => (
                    <tr key={t.id}>
                      <td>{idx + 1}</td>
                      <td className="fw-semibold">{t.tenchuyenmuc}</td>

                      <td></td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(t)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(t.id)}
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

export default AdminTopic;
