import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetails } from "../API/Checkout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const formatPrice = (price) => {
  if (!price) return "0đ";
  return Number(price).toLocaleString("vi-VN") + "đ";
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderDetails(id)
      .then((data) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5 text-secondary">
        <div className="spinner-border text-primary me-2" /> Đang tải...
      </div>
    );

  if (!order)
    return (
      <div className="text-center mt-5 text-danger fw-bold">
        Không tìm thấy đơn hàng
      </div>
    );

  return (
    <div className="container my-5">
      <div className="bg-white shadow-sm rounded-4 p-4 border">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary mb-0">
            🧾 Chi tiết đơn hàng #{order.code}
          </h4>
          <Link to="/orders" className="btn btn-outline-secondary rounded-pill">
            <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
          </Link>
        </div>

        {/* 🧍 Thông tin khách hàng */}
        <div className="row mb-4">
          <div className="col-md-6">
            <h6 className="fw-bold text-secondary mb-2">
              Thông tin người nhận
            </h6>
            <p className="mb-1">
              <strong>Tên:</strong> {order.ten_khachhang}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {order.email}
            </p>
            <p className="mb-1">
              <strong>SĐT:</strong> {order.sdt}
            </p>
            <p className="mb-1">
              <strong>Địa chỉ:</strong> {order.diachi}
            </p>
          </div>

          <div className="col-md-6">
            <h6 className="fw-bold text-secondary mb-2">Thông tin đơn hàng</h6>
            <p className="mb-1">
              <strong>Mã đơn:</strong> {order.code}
            </p>
            <p className="mb-1">
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
            <p className="mb-1">
              <strong>Phương thức thanh toán:</strong>{" "}
              {order.phuong_thuc_thanh_toan?.toUpperCase()}
            </p>
            <p className="mb-1">
              <strong>Trạng thái:</strong>{" "}
              <span className="badge bg-warning text-dark">{order.status}</span>
            </p>
          </div>
        </div>

        {/* 📦 Danh sách sản phẩm */}
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th className="text-end">Giá</th>
                <th className="text-center">Số lượng</th>
                <th className="text-end"></th>
              </tr>
            </thead>
            <tbody>
              {order.chitiet?.length > 0 ? (
                order.chitiet.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={`https://be-laravel.onrender.com/storage/img/${item.sanpham?.anhdaidien}`}
                          alt={item.sanpham?.tensp}
                          className="rounded-3 me-3"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                        <span>{item.sanpham?.tensp}</span>
                      </div>
                    </td>

                    <td className="text-end">{formatPrice(item.gia)}</td>
                    <td className="text-center">{item.soluong}</td>
                    <td className="text-end"></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    Không có sản phẩm trong đơn hàng này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Tổng tiền */}
        <div className="text-end mt-3">
          <h5 className="fw-bold">
            Tổng tiền:{" "}
            <span className="text-danger">
              {formatPrice(order.total_price)}
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
