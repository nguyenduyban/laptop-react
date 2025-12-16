import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import AccountPage from "./editprofile";

const UserProfile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // 🔹 Lấy danh sách đơn hàng theo user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.id) return;

        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://be-laravel.onrender.com/api/checkout/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setOrders(res.data);
      } catch (error) {
        console.error(
          "❌ Lỗi khi tải đơn hàng:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <h5>Vui lòng đăng nhập để xem thông tin cá nhân.</h5>
      </div>
    );
  }

  // ✅ Hàm format tiền VND chuẩn
  const formatPrice = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0đ";
    return num.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="container-fluid bg-light py-4">
      <div className="container">
        {/* HEADER */}
        <div className="bg-white p-3 rounded-4 shadow-sm d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <img
              src={
                user.avatar
                  ? `https://be-laravel.onrender.com/storage/avatars/${user.avatar}`
                  : "https://be-laravel.onrender.com/storage/img/account.png"
              }
              alt="avatar"
              className="rounded-circle"
              width="70"
              height="70"
            />
            <div>
              <h5 className="fw-bold mb-1">{user.fullname || user.username}</h5>
              <p className="text-muted small mb-1">
                {user.email || "Chưa cập nhật"}
              </p>
            </div>
          </div>
          <div className="text-end">
            <h6 className="fw-bold text-primary mb-1">
              {orders.length} đơn hàng
            </h6>
          </div>
        </div>

        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3 mb-4">
            <div className="bg-white rounded-4 shadow-sm p-3">
              <ul className="list-unstyled mb-0">
                <li
                  className={`py-2 px-3 rounded-3 mb-2 fw-bold ${
                    activeTab === "overview"
                      ? "bg-light text-primary"
                      : "text-secondary"
                  }`}
                  onClick={() => setActiveTab("overview")}
                  style={{ cursor: "pointer" }}
                >
                  <FaUser className="me-2" /> Đơn hàng của bạn
                </li>

                <li
                  className={`py-2 px-3 rounded-3 mb-2 fw-bold ${
                    activeTab === "account"
                      ? "bg-light text-primary"
                      : "text-secondary"
                  }`}
                  onClick={() => setActiveTab("account")}
                  style={{ cursor: "pointer" }}
                >
                  <FaInfoCircle className="me-2" /> Thông tin tài khoản
                </li>
              </ul>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-md-6 mb-4">
            <div className="bg-white rounded-4 shadow-sm p-4">
              {activeTab === "overview" && (
                <>
                  <h5 className="fw-bold mb-3">Đơn hàng của bạn</h5>

                  {loading ? (
                    <p className="text-center text-muted">Đang tải...</p>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="border rounded-4 p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>Mã đơn:</strong> #{order.id}
                            <br />
                            <small className="text-muted">
                              Ngày đặt:{" "}
                              {new Date(order.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </small>
                          </div>
                          <span
                            className={`badge ${
                              order.status === "Đã nhận hàng"
                                ? "bg-success"
                                : order.status === "Đã hủy"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {order.status || order.trang_thai}
                          </span>
                        </div>

                        <div className="ms-2">
                          <p className="mb-1">
                            <strong>Người nhận:</strong> {order.ten_khachhang}
                          </p>
                          <p className="mb-1">
                            <strong>Địa chỉ:</strong> {order.diachi}, {order.xa}
                            , {order.huyen}, {order.thanhpho}
                          </p>
                          <p className="mb-1">
                            <strong>Phương thức:</strong>{" "}
                            {order.phuong_thuc_thanh_toan}
                          </p>
                          <p className="fw-bold text-danger">
                            Tổng tiền:{" "}
                            {Number(
                              order.total_price || order.tong_tien || 0
                            ).toLocaleString("vi-VN")}
                            đ
                          </p>
                        </div>

                        {/* ✅ Nút xem chi tiết */}
                        <div className="text-end">
                          <a
                            href={`/detailorder/${order.id}`}
                            className="btn btn-sm btn-outline-primary rounded-pill mt-2"
                          >
                            Xem chi tiết
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center">
                      Chưa có đơn hàng nào.
                    </p>
                  )}
                </>
              )}

              {activeTab === "account" && <AccountPage />}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-3 mb-4">
            <div className="bg-white rounded-4 shadow-sm p-4 text-center">
              <h6 className="fw-bold mb-3">Ưu đãi của bạn</h6>
              <img
                src="https://cdn-icons-png.flaticon.com/512/760/760826.png"
                alt="gift"
                width="80"
                className="mb-3"
              />
              <p className="text-muted mb-1">Bạn chưa có ưu đãi nào.</p>
              <a href="#" className="text-primary small fw-bold">
                Xem sản phẩm
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
