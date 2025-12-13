import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import { getAccountById, updateAccount } from "../API/Account";
import { getOrdersByUser } from "../API/Checkout";
import { getCommentsByUserAdmin } from "../API/Comment";

const AdminAccountDetail = () => {
  const { id } = useParams();

  const [account, setAccount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState([]);

  // Form update state
  const [editData, setEditData] = useState({
    fullname: "",
    email: "",
    sdt: "",
    diachi: "",
    loaiTK: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const acc = await getAccountById(id);
      const ord = await getOrdersByUser(id);
      const cmt = await getCommentsByUserAdmin(id);

      setAccount(acc);
      setOrders(ord);
      setComments(cmt);

      setEditData({
        fullname: acc.fullname || "",
        email: acc.email || "",
        sdt: acc.sdt || "",
        diachi: acc.diachi || "",
        loaiTK: acc.loaiTK || "user",
      });
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể tải dữ liệu tài khoản", "error");
    }
  };

  const handleSave = async () => {
    Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn cập nhật tài khoản?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateAccount(id, editData);
          Swal.fire("Thành công!", "Tài khoản đã được cập nhật", "success");

          // Reload data
          loadData();
        } catch (err) {
          Swal.fire("Lỗi!", "Cập nhật thất bại", "error");
        }
      }
    });
  };

  if (!account) return <div className="text-center py-5">Đang tải...</div>;

  return (
    <div className="container py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="fw-bold mb-4">
          <i className="fa-solid fa-user text-primary me-2"></i>
          Chi tiết tài khoản: {account.username}
        </h3>

        {/* FORM UPDATE TÀI KHOẢN */}
        <div className="card shadow-sm p-3 mb-4">
          <h5 className="fw-bold mb-3">Chỉnh sửa thông tin</h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Họ tên</label>
              <input
                className="form-control"
                value={editData.fullname}
                onChange={(e) =>
                  setEditData({ ...editData, fullname: e.target.value })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input
                className="form-control"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Số điện thoại</label>
              <input
                className="form-control"
                value={editData.sdt}
                onChange={(e) =>
                  setEditData({ ...editData, sdt: e.target.value })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Địa chỉ</label>
              <input
                className="form-control"
                value={editData.diachi}
                onChange={(e) =>
                  setEditData({ ...editData, diachi: e.target.value })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Loại tài khoản</label>
              <select
                className="form-select"
                value={editData.loaiTK}
                onChange={(e) =>
                  setEditData({ ...editData, loaiTK: e.target.value })
                }
              >
                <option value={2}>user</option>
                <option value={1}>admin</option>
              </select>
            </div>
          </div>

          <button className="btn btn-success mt-3" onClick={handleSave}>
            Lưu thay đổi
          </button>
        </div>

        {/* ĐƠN HÀNG */}
        <div className="card shadow-sm p-3 mb-4">
          <h5 className="fw-bold mb-3">Đơn hàng đã mua</h5>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày mua</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.created_at}</td>
                    <td>{Number(o.total_price).toLocaleString("vi-VN")}đ</td>
                    <td>
                      <span className="badge bg-info">{o.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    Chưa có đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BÌNH LUẬN */}
        <div className="card shadow-sm p-3 mb-4">
          <h5 className="fw-bold mb-3">Bình luận của tài khoản</h5>

          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="border-bottom py-2">
                <b>{c.sanpham?.tensp}</b>
                <p className="m-0">{c.noidung}</p>
                <span className="badge bg-info">{c.trangthai}</span>
              </div>
            ))
          ) : (
            <p className="text-muted">Không có bình luận nào</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAccountDetail;
