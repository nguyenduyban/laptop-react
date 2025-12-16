import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getComments, postComment } from "../API/Comment";
import { getProductById } from "../API/ProductAPI";
import { getProductByCategories } from "../API/Categories";

import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProductDetail = () => {
  const { masp } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await getProductById(masp);
        setProduct(prod);

        if (prod?.danhmuc_id) {
          const rel = await getProductByCategories(prod.danhmuc_id);
          setRelated(rel.filter((item) => item.masp !== prod.masp));
        }

        const data = await getComments(masp);
        setComments(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchData();
  }, [masp]);

  if (!product)
    return (
      <p className="text-center mt-5 text-secondary fw-semibold">
        Đang tải sản phẩm...
      </p>
    );

  const handleAddToCart = () => {
    addToCart(product);
    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire("Bạn cần đăng nhập để bình luận!", "", "warning");
      return;
    }
    if (newComment.trim() === "") return;

    try {
      const comment = await postComment({
        user_id: user.id,
        sanpham_id: masp,
        noidung: newComment,
      });
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể gửi bình luận.", "error");
    }
  };

  return (
    <div className="detail-page py-5">
      <div className="container">
        {/* THÔNG TIN SẢN PHẨM */}
        <div className="row bg-white rounded-4 p-4 shadow-sm border">
          <div className="col-md-6 text-center">
            <img
              src={`https://be-laravel.onrender.com/storage/img/${product.anhdaidien}`}
              alt={product.tensp}
              className="img-fluid rounded-4 mb-3"
              style={{ maxHeight: "420px", objectFit: "cover" }}
            />
          </div>

          <div className="col-md-6 ps-md-5">
            <h3 className="fw-bold text-dark mb-3">{product.tensp}</h3>

            <h4 className="text-primary fw-bold mb-2">
              {formatPrice(product.giamoi)}
            </h4>

            {product.giacu && (
              <p className="text-muted text-decoration-line-through">
                {formatPrice(product.giacu)}
              </p>
            )}

            {/* CAM KẾT */}
            <div className="product-commit-box mt-4">
              {/* THÔNG SỐ KỸ THUẬT */}
              <ThongSoSection thongso={product.thongso} />
              <h5 className="fw-bold mb-3 text-dark">Cam kết</h5>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 rounded-4 bg-light border h-50% shadow-sm">
                    <i className="bi bi-box-seam text-danger fs-4 icon-bg"></i>
                    <p className="mt-2 mb-0 text-secondary">
                      Nguyên hộp, đầy đủ phụ kiện từ nhà sản xuất.
                    </p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="p-3 rounded-4 bg-light border h-50% shadow-sm">
                    <i className="bi bi-shield-check text-danger fs-4 icon-bg"></i>
                    <p className="mt-2 mb-0 text-secondary">
                      Bảo hành 1 đổi 1 trong 12 tháng bởi Nhà Phân Phối.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="btn btn-outline-primary fw-semibold px-4 rounded-pill"
              >
                <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ hàng
              </button>

              <button
                className="btn btn-primary fw-semibold px-4 rounded-pill"
                onClick={() => navigate("/checkout")}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        {/* TAB MÔ TẢ + BÌNH LUẬN */}
        <div className="mt-5 bg-white rounded-4 p-4 shadow-sm border">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className="nav-link active fw-semibold"
                data-bs-toggle="tab"
                data-bs-target="#desc"
              >
                Mô tả chi tiết
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link fw-semibold"
                data-bs-toggle="tab"
                data-bs-target="#review"
              >
                Bình luận
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {/* ⭐ MÔ TẢ CÓ ĐỌC THÊM */}
            <div className="tab-pane fade show active" id="desc">
              <DescriptionSection text={product.mota} />
            </div>

            {/* COMMENTS */}
            <div className="tab-pane fade" id="review">
              <h5 className="fw-bold mb-3 text-dark">Bình luận</h5>

              {loadingComments ? (
                <p className="text-muted">Đang tải bình luận...</p>
              ) : (
                <>
                  <form
                    onSubmit={handleSubmitComment}
                    className="p-3 rounded-3 border bg-light mb-4 shadow-sm"
                  >
                    <textarea
                      className="form-control mb-3 border-0 shadow-sm"
                      rows="3"
                      placeholder="Chia sẻ cảm nhận của bạn..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>

                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-primary px-4 rounded-pill fw-semibold"
                      >
                        Gửi bình luận
                      </button>
                    </div>
                  </form>

                  {comments.length === 0 ? (
                    <p className="text-muted">Chưa có bình luận nào.</p>
                  ) : (
                    <ul className="list-group border-0">
                      {comments.map((c) => (
                        <li
                          key={c.id}
                          className="list-group-item border-0 border-bottom py-3"
                        >
                          <div className="d-flex align-items-start">
                            <i className="bi bi-person-circle fs-3 text-primary me-3"></i>

                            <div>
                              <h6 className="fw-semibold mb-1 text-dark">
                                {c.user?.fullname || "Người dùng"}
                              </h6>
                              <p className="mb-1 text-secondary">{c.noidung}</p>
                              <small className="text-muted">
                                {new Date(c.created_at).toLocaleString("vi-VN")}
                              </small>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-5 bg-white rounded-4 p-4 shadow-sm border">
            <h4 className="fw-bold mb-3 text-dark">Sản phẩm liên quan</h4>

            <div
              id="relatedCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {Array.from({ length: Math.ceil(related.length / 3) }).map(
                  (_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className={`carousel-item ${
                        slideIndex === 0 ? "active" : ""
                      }`}
                    >
                      <div className="row g-3">
                        {related
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((item) => (
                            <div className="col-md-4 col-12" key={item.masp}>
                              <div className="card h-100 shadow-sm border-0 rounded-4 p-2">
                                <img
                                  src={`https://be-laravel.onrender.com/storage/img/${item.anhdaidien}`}
                                  className="card-img-top rounded-4"
                                  style={{
                                    height: "220px",
                                    objectFit: "cover",
                                  }}
                                />

                                <div className="card-body text-center">
                                  <h6 className="fw-bold text-dark">
                                    {item.tensp.length > 50
                                      ? item.tensp.substring(0, 50) + "..."
                                      : item.tensp}
                                  </h6>

                                  <p className="text-primary fw-semibold mb-2">
                                    {formatPrice(item.giamoi)}
                                  </p>

                                  <button
                                    className="btn btn-outline-primary rounded-pill px-3"
                                    onClick={() =>
                                      navigate(`/product/${item.masp}`)
                                    }
                                  >
                                    Xem chi tiết
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#relatedCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#relatedCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        body {
          background-color: #f8f9fa;
        }
        .detail-page {
          min-height: 100vh;
        }
        .nav-tabs .nav-link.active {
          color: #0d6efd;
          border-bottom: 3px solid #0d6efd;
          background: transparent;
        }
        .nav-tabs .nav-link {
          color: #555;
          border: none;
        }
        .nav-tabs .nav-link:hover {
          color: #0d6efd;
        }
        .icon-bg {
          background: #ffeaea;
          padding: 10px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;

export const DescriptionSection = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  const LIMIT = 350;
  const isLong = text.length > LIMIT;
  const shown = expanded ? text : text.slice(0, LIMIT) + (isLong ? "..." : "");

  return (
    <div>
      <p
        className="text-secondary fs-6"
        style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}
      >
        {shown}
      </p>

      {isLong && (
        <button
          className="btn btn-outline-primary btn-sm rounded-pill fw-semibold"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Thu gọn" : "Đọc tiếp"}
        </button>
      )}
    </div>
  );
};
const ThongSoSection = ({ thongso }) => {
  if (!thongso) return null;

  const rows = thongso
    .split(/\r?\n/)
    .map((line) => {
      const index = line.indexOf(":");
      if (index === -1) return null;
      return {
        label: line.slice(0, index).trim(),
        value: line.slice(index + 1).trim(),
      };
    })
    .filter(Boolean);

  return (
    <div className="mt-4 mb-3">
      {/* TIÊU ĐỀ */}
      <h5 className="fw-bold mb-4 position-relative thongso-title">
        Thông số kỹ thuật
      </h5>

      {/* CARD */}
      <div className="border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <table className="table mb-0 align-middle">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="fw-semibold text-secondary w-35 px-4 py-3 bg-light">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-dark">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
