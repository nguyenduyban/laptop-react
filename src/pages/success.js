import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getOrderDetails } from "../API/Checkout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const formatPrice = (price) => {
  if (!price) return "0đ";
  return Number(price).toLocaleString("vi-VN") + " đ";
};

const SuccessPage = () => {
  const { clearCart } = useCart();
  const [params] = useSearchParams();
  const orderId = params.get("donhang");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (!orderId) return;

    getOrderDetails(orderId)
      .then((data) => setOrder(data))
      .catch((err) => {
        console.error("Order load error:", err);
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading)
    return (
      <div className="text-center mt-5 text-secondary">
        <div className="spinner-border text-success me-2" /> Đang tải đơn
        hàng...
      </div>
    );

  if (!order)
    return (
      <div className="text-center mt-5 text-danger fw-bold">
        Không tìm thấy thông tin đơn hàng!
      </div>
    );

  return (
    <div className="container my-5">
      <div className="bg-white shadow-sm rounded-4 p-4 border">
        <h2 className="text-success fw-bold text-center mb-1">
          Thanh toán thành công!
        </h2>
        <p className="text-center text-muted mb-4">Cảm ơn bạn đã đặt hàng.</p>

 
        <h4 className="fw-bold mb-3">Thông tin đơn hàng</h4>
        <div className="row mb-4">
          <div className="col-md-6">
            <p>
              <strong>Mã đơn hàng:</strong>{" "}
              <span className="text-primary">#{order.code}</span>
            </p>
            <p>
              <strong>Người nhận:</strong> {order.ten_khachhang}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.sdt}
            </p>
          </div>

          <div className="col-md-6">
            <p>
              <strong>Địa chỉ:</strong> {order.diachi}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {order.phuong_thuc_thanh_toan}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              <span className="text-danger fw-bold">
                {formatPrice(order.total_price)}
              </span>
            </p>
          </div>
        </div>


        <h4 className="fw-bold mb-3">Sản phẩm đã mua</h4>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th className="text-end">Giá</th>
                <th className="text-center">Số lượng</th>
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
                          className="rounded me-2"
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    Không có sản phẩm nào trong đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="btn btn-primary px-4">
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
