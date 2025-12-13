import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { getAllAccounts, deleteAccount } from "../API/Account";
import { useNavigate } from "react-router-dom";

const AdminAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await getAllAccounts();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể tải danh sách tài khoản", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Xóa tài khoản?",
      text: "Bạn có chắc muốn xóa tài khoản này? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteAccount(id);

      Swal.fire("Thành công!", "Tài khoản đã được xóa.", "success");

      // reload danh sách
      loadAccounts();
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể xóa tài khoản.", "error");
    }
  };

  const filtered = accounts.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.username.toLowerCase().includes(q) ||
      (a.fullname || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">
        <i className="fa-solid fa-users text-primary me-2"></i>
        Quản lý Tài khoản
      </h3>

      <input
        className="form-control rounded-pill w-50 mb-4"
        placeholder="Tìm username, email, họ tên..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((acc, i) => (
              <tr key={acc.id}>
                <td>{i + 1}</td>
                <td>{acc.username}</td>
                <td>{acc.fullname}</td>
                <td>{acc.email}</td>
                <td>{acc.sdt}</td>
                <td>{acc.diachi}</td>
                <td>
                  <span
                    className={`badge ${
                      acc.loaiTK === 1
                        ? "bg-warning text-dark"
                        : acc.loaiTK === 2
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    {acc.loaiTK === 1
                      ? "Admin"
                      : acc.loaiTK === 2
                      ? "User"
                      : "Guest"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/admin/account/${acc.id}`)}
                  >
                    Xem
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(acc.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Không có tài khoản nào
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Đang tải...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAccount;
