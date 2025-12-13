import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllDonHang,
  getDonHangDetail,
  updateDonHangStatus,
} from "../API/DonHang";

const AdminDonHang = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    last: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllDonHang(page);

      setOrders(data.data);

      setPagination({
        current: data.current_page,
        last: data.last_page,
        total: data.total,
      });
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể tải đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      "chờ xử lý": { text: "Chờ xử lý", color: "warning" },
      "đã xác nhận": { text: "Đã xác nhận", color: "primary" },
      "đang giao": { text: "Đang giao", color: "info" },
      "đã hoàn thành": { text: "Hoàn thành", color: "success" },
      "đã hủy": { text: "Đã hủy", color: "danger" },
    };

    return labels[status] || { text: "Không xác định", color: "secondary" };
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDonHangStatus(id, { trang_thai: newStatus });

      Swal.fire("Thành công", "Đã cập nhật trạng thái", "success");
      fetchOrders();
    } catch (error) {
      Swal.fire("Lỗi", "Không thể cập nhật", "error");
    }
  };

  const handleStatusChangeModal = async (newStatus) => {
    try {
      await updateDonHangStatus(selectedOrder.id, { trang_thai: newStatus });

      Swal.fire("Thành công", "Đã cập nhật trạng thái", "success");

      fetchOrders();
      setSelectedOrder({ ...selectedOrder, trang_thai: newStatus });
    } catch (err) {
      Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
    }
  };

  const viewDetail = async (id) => {
    try {
      const detail = await getDonHangDetail(id);
      setSelectedOrder(detail);
      setShowDetail(true);
    } catch {
      Swal.fire("Lỗi", "Không thể tải chi tiết đơn hàng", "error");
    }
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;

    const matchSearch =
      o.ten_khachhang?.toLowerCase().includes(search.toLowerCase()) ||
      o.sdt?.includes(search);

    return matchSearch;
  });

  return (
    <div className="container py-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="fw-bold">
          <i className="fa-solid fa-shopping-cart text-success me-2"></i>
          Quản lý Đơn hàng
        </h3>

        <div className="row g-3 my-4">
          <div className="col-md-5">
            <input
              className="form-control rounded-pill"
              placeholder="Tìm khách hàng hoặc SĐT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-success">
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const status = getStatusLabel(o.trang_thai);

                  return (
                    <tr key={o.id}>
                      <td>#{o.id}</td>

                      <td>
                        <b>{o.ten_khachhang}</b>
                        <br />
                        <small>{o.sdt}</small>
                      </td>

                      <td>
                        {parseFloat(o.tong_tien).toLocaleString("vi-VN")}đ
                      </td>

                      <td>
                        {new Date(o.created_at).toLocaleDateString("vi-VN")}
                      </td>

                      <td>
                        <span className={`badge bg-${status.color}`}>
                          {status.text}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => viewDetail(o.id)}
                        >
                          Xem
                        </button>

                        <select
                          className="form-select form-select-sm w-auto d-inline"
                          value={o.trang_thai}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value)
                          }
                        >
                          <option value="chờ xử lý">Chờ xử lý</option>
                          <option value="đã xác nhận">Đã xác nhận</option>
                          <option value="đang giao">Đang giao</option>
                          <option value="đã hoàn thành">Đã hoàn thành</option>
                          <option value="đã hủy">Hủy</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Trang {pagination.current} / {pagination.last}
          </span>

          <div>
            <button
              className="btn btn-outline-primary me-2"
              disabled={pagination.current <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀ Trước
            </button>

            <button
              className="btn btn-outline-primary"
              disabled={pagination.current >= pagination.last}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau ▶
            </button>
          </div>
        </div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {showDetail && selectedOrder && (
          <motion.div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              className="modal-dialog modal-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5>Chi tiết đơn hàng #{selectedOrder.id}</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowDetail(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* CUSTOMER INFO */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Thông tin khách hàng</h6>
                      <p>
                        <b>Họ tên:</b> {selectedOrder.ten_khachhang} <br />
                        <b>SĐT:</b> {selectedOrder.sdt} <br />
                        <b>Email:</b> {selectedOrder.email} <br />
                        <b>Địa chỉ:</b> {selectedOrder.diachi}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <h6 className="fw-bold">Thanh toán</h6>
                      <p>
                        <b>Phương thức:</b>{" "}
                        {selectedOrder.phuong_thuc_thanh_toan}
                        <br />
                        <b>Tổng tiền:</b>{" "}
                        <span className="text-success fw-bold">
                          {parseFloat(selectedOrder.tong_tien).toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </span>
                      </p>

                      <h6 className="fw-bold mt-3">Cập nhật trạng thái</h6>
                      <select
                        className="form-select w-50"
                        value={selectedOrder.trang_thai}
                        onChange={(e) =>
                          handleStatusChangeModal(e.target.value)
                        }
                      >
                        <option value="chờ xử lý">Chờ xử lý</option>
                        <option value="đã xác nhận">Đã xác nhận</option>
                        <option value="đang giao">Đang giao</option>
                        <option value="đã hoàn thành">Đã hoàn thành</option>
                        <option value="đã hủy">Hủy</option>
                      </select>
                    </div>
                  </div>

                  <hr />

                  {/* ORDER ITEMS */}
                  {selectedOrder.chi_tiet_don_hang?.length > 0 ? (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.chi_tiet_don_hang.map((item, i) => (
                          <tr key={i}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={`https://be-laravel.onrender.com/storage/img/${item.sanpham.anhdaidien}`}
                                  width="55"
                                  height="55"
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                  }}
                                  onError={(e) =>
                                    (e.target.src = "/placeholder.jpg")
                                  }
                                />
                                <span className="fw-semibold">
                                  {item.sanpham?.tensp}
                                </span>
                              </div>
                            </td>

                            <td>{item.so_luong}</td>

                            <td>
                              {parseFloat(item.don_gia).toLocaleString("vi-VN")}
                              đ
                            </td>

                            <td>
                              {parseFloat(item.thanh_tien).toLocaleString(
                                "vi-VN"
                              )}
                              đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="alert alert-warning">
                      Không có sản phẩm trong đơn hàng này
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDetail(false)}
                  >
                    Đóng
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => window.print()}
                  >
                    In hóa đơn
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDonHang;
