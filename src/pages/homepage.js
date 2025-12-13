import React, { useEffect, useState } from "react";
import { getAllCarousel } from "../API/Carousel";
import { getAllTopic, getProductByTopic } from "../API/Topic";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Homepage = () => {
  const [carousel, setCarousel] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topicProducts, setTopicProducts] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getAllCarousel()
      .then(setCarousel)
      .catch((error) => console.error("Lỗi khi tải slide:", error));
  }, []);

  useEffect(() => {
    getAllTopic()
      .then(async (topicsData) => {
        setTopics(topicsData);
        const allProducts = {};
        for (const t of topicsData) {
          try {
            const products = await getProductByTopic(t.id);
            allProducts[t.id] = products.slice(0, 4);
          } catch (err) {
            console.error(`Lỗi khi lấy sản phẩm cho ${t.tenchuyenmuc}`, err);
          }
        }
        setTopicProducts(allProducts);
      })
      .catch((error) => console.error("Lỗi khi tải chuyên mục:", error));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container py-4">
        <div
          id="homepage-carousel"
          className="carousel slide rounded-4 overflow-hidden shadow-sm mb-5 border"
          data-bs-ride="carousel"
          data-bs-interval="2000"
        >
          <div className="carousel-inner">
            {carousel.length > 0 ? (
              carousel.map((item, index) => (
                <div
                  key={item.STT}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={`https://be-laravel.onrender.com/storage/img/${item.tenfile}`}
                    className="d-block w-100"
                    alt={item.tieude || `Slide ${index + 1}`}
                    style={{
                      height: "450px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="carousel-item active">
                <img
                  src="https://via.placeholder.com/1200x450?text=No+Slides+Found"
                  className="d-block w-100"
                  alt="No slides"
                />
              </div>
            )}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homepage-carousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homepage-carousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>

        {topics.length > 0 ? (
          topics.map((topic) => (
            <section key={topic.id} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h3
                  className="fw-bold text-uppercase mb-0"
                  style={{ color: "#0d6efd", letterSpacing: "1px" }}
                >
                  {topic.tenchuyenmuc}
                </h3>
              </div>

              <div className="row g-4">
                {topicProducts[topic.id] &&
                topicProducts[topic.id].length > 0 ? (
                  topicProducts[topic.id].map((p) => (
                    <div className="col-lg-3 col-md-4 col-sm-6" key={p.masp}>
                      <div
                        className="card h-100 border-0 shadow-sm position-relative overflow-hidden"
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "15px",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow =
                            "0 10px 25px rgba(0,0,0,0.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Link
                          to={`/product/${p.masp}`}
                          className="text-decoration-none text-dark"
                        >
                          <div className="overflow-hidden rounded-top">
                            <img
                              src={`https://be-laravel.onrender.com/storage/img/${p.anhdaidien}`}
                              alt={p.tensp}
                              className="card-img-top"
                              style={{
                                height: "230px",
                                objectFit: "cover",
                                transition: "transform 0.4s ease",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(1.05)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            />
                          </div>
                        </Link>

                        <div className="card-body text-center p-3">
                          <h6
                            className="fw-semibold text-truncate mb-2"
                            title={p.tensp}
                          >
                            {p.tensp}
                          </h6>
                          <p className="text-primary fw-bold mb-1 fs-5">
                            {formatPrice(p.giamoi)}
                          </p>
                          {p.giacu && (
                            <small className="text-muted text-decoration-line-through">
                              {formatPrice(p.giacu)}
                            </small>
                          )}
                        </div>

                        {/* 🛒 Nút thêm vào giỏ */}
                        <div className="d-flex justify-content-center gap-2 mb-3">
                          <button
                            className="btn btn-sm btn-outline-primary fw-semibold px-3 rounded-pill"
                            onClick={() => handleAddToCart(p)}
                          >
                            <i className="bi bi-cart-plus me-1"></i> Thêm vào
                            giỏ
                          </button>
                          <Link
                            to={`/product/${p.masp}`}
                            className="btn btn-sm btn-primary rounded-pill px-3 text-white"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">
                    Không có sản phẩm trong chuyên mục này
                  </p>
                )}
              </div>
            </section>
          ))
        ) : (
          <p className="text-center text-muted mt-5">Đang tải chuyên mục...</p>
        )}
      </div>

      <style>{`
        body {
          background-color: #f8f9fa;
          color: #212529;
        }
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
};

export default Homepage;
