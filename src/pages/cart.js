import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { formatPrice, parsePrice } from "../utils/format";
import axios from "axios";

const CartPage = () => {
  const { cart, setCart, removeFromCart, clearCart } = useCart();
  const [stock, setStock] = useState({}); // lưu tồn kho theo masp

  useEffect(() => {
    const fetchStock = async () => {
      const result = {};
      for (const item of cart) {
        try {
          const res = await axios.get(
            `https://be-laravel.onrender.com/api/kho/sp/${item.masp}`
          );
          result[item.masp] = res.data.soluong_ton ?? 0;
        } catch (e) {
          result[item.masp] = 0;
        }
      }
      setStock(result);
    };
    fetchStock();
  }, [cart]);

  const updateQuantity = async (masp, delta) => {
    const item = cart.find((i) => i.masp === masp);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    const maxStock = stock[masp] ?? 0;

    if (newQty > maxStock) {
      alert(`Chỉ còn ${maxStock} sản phẩm trong kho!`);
      updateQuantityLocal(masp, maxStock);
      return;
    }

    updateQuantityLocal(masp, newQty);
  };

  const updateQuantityLocal = (masp, quantity) => {
    const newCart = cart.map((item) =>
      item.masp === masp ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => {
    const price = parsePrice(item.giamoi);
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  const totalQuantity = cart.reduce((sum, item) => {
    return sum + (item.quantity ?? 1);
  }, 0);

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4 text-center">🛒 Giỏ hàng của bạn</h3>

      {cart.length === 0 ? (
        <div className="text-center p-5 bg-light rounded-4 shadow-sm">
          <h5 className="text-muted mb-3">
            Chưa có sản phẩm nào trong giỏ hàng.
          </h5>
          <a href="/" className="btn btn-danger rounded-pill px-4">
            Tiếp tục mua sắm
          </a>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {cart.map((item) => (
              <div
                key={item.masp}
                className="d-flex align-items-start p-3 mb-3 bg-white border rounded-4 shadow-sm cart-item"
              >
                <img
                  src={`https://be-laravel.onrender.com/storage/img/${item.anhdaidien}`}
                  alt={item.tensp}
                  width="110"
                  height="110"
                  className="rounded-3 me-3 object-fit-cover"
                />

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="fw-semibold mb-1">{item.tensp}</h6>
                    <button
                      className="btn btn-sm text-danger"
                      onClick={() => removeFromCart(item.masp)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>

                  <p className="text-muted small mb-2">
                    Danh mục: {item.chuyenmuc?.tenchuyenmuc || "Chưa xác định"}
                  </p>

                  {/* Tồn kho */}
                  <p className="small text-primary mb-2">
                    Tồn kho: {stock[item.masp] ?? "…"} sản phẩm
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-danger mb-0">
                      {formatPrice(item.giamoi)} đ
                    </h5>

                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.masp, -1)}
                      >
                        –
                      </button>
                      <span className="px-3 fw-semibold">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.masp, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-3">
              <button
                className="btn btn-outline-danger rounded-pill"
                onClick={clearCart}
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="p-4 bg-white rounded-4 border shadow-sm">
              <h5 className="fw-bold mb-3 text-center">Tóm tắt đơn hàng</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng sản phẩm:</span>
                <strong>{totalQuantity}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tạm tính:</span>
                <strong className="text-success">{formatPrice(total)}</strong>
              </div>
              <Link
                className="btn btn-danger w-100 py-2 fw-semibold rounded-pill"
                to={"/checkout"}
              >
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cart-item:hover {
          transform: translateY(-3px);
          transition: 0.3s;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        }
        img.object-fit-cover {
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default CartPage;