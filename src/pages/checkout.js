import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import { checkout, createVNPayPayment } from "../API/Checkout";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    note: "",
    payment: "cod",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Tính tổng tiền
  const total = Math.round(
    cart.reduce((sum, item) => {
      const price = Math.round(Number(item.giamoi ?? item.gia ?? 0));
      return sum + price * (item.quantity ?? 1);
    }, 0)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      Swal.fire("Giỏ hàng trống", "Vui lòng thêm sản phẩm!", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Chưa đăng nhập", "Vui lòng đăng nhập!", "warning");
      return;
    }

    if (!form.payment) {
      Swal.fire("Lỗi", "Vui lòng chọn phương thức thanh toán!", "error");
      return;
    }

    const payload = {
      ten_khachhang: form.name,
      email: form.email,
      sdt: form.phone,
      diachi:
        `${form.address}, ${form.ward}, ${form.district}, ${form.city}`.trim(),
      ghi_chu: form.note || null,
      phuong_thuc_thanh_toan: form.payment, // ← BẮT BUỘC
      giohang: cart.map((item) => ({
        sanpham_id: item.masp,
        so_luong: item.quantity ?? 1,
        don_gia: Math.round(Number(item.giamoi ?? item.gia ?? 0)),
      })),
      tong_tien: total,
    };

    try {
      // VNPAY
      if (form.payment === "vietqr") {
        const response = await createVNPayPayment(payload);

        if (response?.payment_url) {
          window.location.href = response.payment_url;
          return;
        }
        throw new Error("Không nhận được link thanh toán");
      }

      // COD & CÁC PHƯƠNG THỨC KHÁC
      const res = await checkout(payload);

      if (res?.donhang_id) {
        clearCart();
        window.location.href = `/thanh-toan-thanh-cong?donhang=${res.donhang_id}`;
        return;
      }

      throw new Error("Không nhận được mã đơn hàng");
      // Reset form
      setForm({
        email: "",
        name: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        address: "",
        note: "",
        payment: "cod",
      });
    } catch (err) {
      console.error("Checkout error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        "Không thể đặt hàng";

      Swal.fire("Lỗi", message, "error");
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* FORM */}
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <h5 className="fw-bold mb-3">Thông tin nhận hàng</h5>

            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Họ và tên"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <select
                  name="city"
                  className="form-select"
                  value={form.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Tỉnh thành</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                </select>
              </div>

              <div className="col-md-6">
                <select
                  name="district"
                  className="form-select"
                  value={form.district}
                  onChange={handleChange}
                  required
                >
                  <option value="">Quận / Huyện</option>
                  <option>Quận 1</option>
                  <option>Quận 3</option>
                  <option>Quận 5</option>
                </select>
              </div>

              <div className="col-md-6">
                <select
                  name="ward"
                  className="form-select"
                  value={form.ward}
                  onChange={handleChange}
                  required
                >
                  <option value="">Phường / Xã</option>
                  <option>Phường 1</option>
                  <option>Phường 2</option>
                  <option>Phường 3</option>
                </select>
              </div>

              <div className="col-12">
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Số nhà, tên đường"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <textarea
                  name="note"
                  className="form-control"
                  placeholder="Ghi chú (tùy chọn)"
                  rows="3"
                  value={form.note}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr className="my-4" />

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <h5 className="fw-bold mb-3">Phương thức thanh toán</h5>

            {[
              { value: "cod", label: "COD (Thanh toán khi nhận hàng)" },
              { value: "vietqr", label: "Thanh toán VNPay" },
              { value: "momo", label: "Thanh toán MOMO" },
            ].map((method) => (
              <div className="form-check mb-2" key={method.value}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={form.payment === method.value}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label">{method.label}</label>
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-success w-100 mt-4 fw-semibold"
              disabled={cart.length === 0}
            >
              {form.payment === "vietqr" ? "Thanh toán VNPay" : "Đặt hàng"}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="col-lg-4">
          <div className="border rounded p-3 bg-white shadow-sm">
            <h6 className="fw-bold mb-3">Đơn hàng ({cart.length} sản phẩm)</h6>

            {cart.map((item) => (
              <div key={item.masp} className="d-flex mb-3">
                <img
                  src={`https://be-laravel.onrender.com/storage/img/${item.anhdaidien}`}
                  width="80"
                  height="80"
                  className="rounded me-2 object-fit-cover"
                  alt={item.tensp}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
                <div className="flex-grow-1">
                  <p className="small mb-1">{item.tensp}</p>
                  <p className="fw-semibold text-success mb-0">
                    {Number(item.giamoi ?? item.gia).toLocaleString("vi-VN")} đ
                    x {item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Tổng cộng</span>
              <span className="text-success">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
