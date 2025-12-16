import React, { useEffect, useState, useCallback } from "react";
import { getAllCategories, getProductByCategories } from "../API/Categories";
import { getAllHang } from "../API/Hang";
import { getAllProducts } from "../API/ProductAPI";
import { getProductByTopic } from "../API/Topic";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]); //CHỌN NHIỀU HÃNG
  const [sortOption, setSortOption] = useState("popular");
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

  const [selectedSeries, setSelectedSeries] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState([]);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, brandData, allProductData, featured] =
          await Promise.all([
            getAllCategories(),
            getAllHang(),
            getAllProducts(),
            getProductByTopic(1),
          ]);

        setCategories(catData);
        setBrands(brandData);
        setOriginalProducts(allProductData);
        setAllProducts(allProductData);
        setProducts(allProductData);
        setFeaturedProducts(featured);

        const prices = allProductData.map((p) =>
          parseFloat(p.giamoi || p.giacu || 0)
        );
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //  CHỌN NHIỀU HÃNG – Toggle
  const toggleBrand = (id) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // CHỌN NHIỀU DANH MỤC – Toggle
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // ÁP DỤNG BỘ LỌC
  const applyFilters = useCallback(() => {
    let filtered = [...originalProducts];

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.hang_id));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.danhmuc_id)
      );
    }

    filtered = filtered.filter((p) => {
      const price = parseFloat(p.giamoi || p.giacu || 0);
      return price >= priceRange.min && price <= priceRange.max;
    });

    if (selectedSeries.length > 0) {
      filtered = filtered.filter((p) =>
        selectedSeries.includes(p.series || "")
      );
    }

    if (selectedDemand.length > 0) {
      filtered = filtered.filter((p) =>
        selectedDemand.includes(p.nhucau || "")
      );
    }

    if (sortOption === "price-asc") {
      filtered.sort(
        (a, b) =>
          parseFloat(a.giamoi || a.giacu || 0) -
          parseFloat(b.giamoi || b.giacu || 0)
      );
    } else if (sortOption === "price-desc") {
      filtered.sort(
        (a, b) =>
          parseFloat(b.giamoi || b.giacu || 0) -
          parseFloat(a.giamoi || a.giacu || 0)
      );
    }

    setProducts(filtered);
    setCurrentPage(1);
  }, [
    originalProducts,
    selectedBrands,
    selectedCategories,
    priceRange,
    selectedSeries,
    selectedDemand,
    sortOption,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Slider giá
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const resetPrice = () => {
    const prices = originalProducts.map((p) =>
      parseFloat(p.giamoi || p.giacu || 0)
    );
    setPriceRange({
      min: Math.min(...prices),
      max: Math.max(...prices),
    });
  };

  // Phân trang
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const featuredChunks = chunkArray(featuredProducts, 5);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );

  return (
    <div className="product-page py-4">
      <div className="container">
        <div className="row">
          {/* BỘ LỌC BÊN TRÁI */}
          <div className="col-lg-3">
            <div className="" style={{ top: "20px" }}>
              {/* Lọc theo giá */}
              <div className="card border-0 shadow-sm mb-3 p-3">
                <h6 className="fw-bold d-flex justify-content-between align-items-center">
                  Khoảng giá
                  {(priceRange.min > 0 || priceRange.max < 100000000) && (
                    <button
                      className="btn btn-link text-danger p-0 fs-6"
                      onClick={resetPrice}
                    >
                      Xóa
                    </button>
                  )}
                </h6>

                <div className="mb-2">
                  <div className="d-flex justify-content-between small text-primary fw-semibold">
                    <span>{formatPrice(priceRange.min)}</span>
                    <span>{formatPrice(priceRange.max)}</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100000000}
                    name="min"
                    value={priceRange.min}
                    step={500000}
                    onChange={handleRangeChange}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100000000}
                    name="max"
                    value={priceRange.max}
                    step={500000}
                    onChange={handleRangeChange}
                  />
                </div>
              </div>

              {/* Lọc theo nhiều hãng */}
              <div className="card border-0 shadow-sm mb-3 p-3">
                <h6 className="fw-bold">Thương hiệu</h6>
                <div className="d-flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      className={`btn btn-sm ${
                        selectedBrands.includes(b.id)
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => toggleBrand(b.id)}
                    >
                      {b.tenhang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <h5 className="fw-bold text-dark mb-3">Hãng sản xuất</h5>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {brands.map((b) => (
                <button
                  key={b.id}
                  className={`brand-btn ${
                    selectedBrands.includes(b.id) ? "active" : ""
                  }`}
                  onClick={() => toggleBrand(b.id)}
                >
                  <img
                    src={`https://be-laravel.onrender.com/storage/img/${b.hinhanh}`}
                    alt={b.tenhang}
                    style={{ height: "25px", objectFit: "contain" }}
                  />
                </button>
              ))}
            </div>

            {/* Danh mục */}
            <div className="mb-4">
              <h5 className="fw-bold">Danh mục</h5>
              <div className="d-flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`text-center p-3 rounded-4 category-item ${
                      selectedCategories.includes(cat.id) ? "active" : ""
                    }`}
                    onClick={() => toggleCategory(cat.id)}
                    style={{ width: "130px", cursor: "pointer" }}
                  >
                    <img
                      src={`https://be-laravel.onrender.com/storage/img/${cat.hinhanh}`}
                      alt={cat.tendanhmuc}
                      className="img-fluid rounded-3 mb-2"
                      style={{ height: "70px", objectFit: "cover" }}
                    />
                    <p className="small fw-semibold text-truncate mb-0">
                      {cat.tendanhmuc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {featuredProducts.length > 0 && (
              <div className="mb-5">
                <div className="bg-primary text-white text-center py-2 rounded-top-3">
                  <h5 className="fw-bold mb-0 fs-6">
                    Các sản phẩm laptop nổi bật
                  </h5>
                </div>
                <div className="border border-primary border-top-0 rounded-bottom-3 overflow-hidden">
                  <div
                    id="featuredCarousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                    data-bs-interval="4000"
                  >
                    <div className="carousel-inner">
                      {featuredChunks.map((chunk, idx) => (
                        <div
                          key={idx}
                          className={`carousel-item ${
                            idx === 0 ? "active" : ""
                          }`}
                        >
                          <div
                            className="d-flex flex-nowrap overflow-x-auto px-3 py-2 gap-3"
                            style={{ scrollbarWidth: "none" }}
                          >
                            {chunk.map((p) => {
                              const oldPrice = parseFloat(p.giacu || 0);
                              const newPrice = parseFloat(p.giamoi || 0);
                              const discountAmount = oldPrice - newPrice;
                              const discountPercent = oldPrice
                                ? Math.round((discountAmount / oldPrice) * 100)
                                : 0;
                              const comboDiscount = 1000000;
                              return (
                                <div
                                  key={p.masp}
                                  className="featured-fpt-card flex-shrink-0"
                                >
                                  <Link
                                    to={`/product/${p.masp}`}
                                    className="text-decoration-none"
                                  >
                                    <div className="bg-white rounded-3 p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-between">
                                      <div className="mb-2">
                                        <img
                                          src={`https://be-laravel.onrender.com/storage/img/${p.anhdaidien}`}
                                          alt={p.tensp}
                                          className="img-fluid"
                                          style={{
                                            height: "90px",
                                            objectFit: "contain",
                                          }}
                                        />
                                      </div>
                                      {discountAmount > 0 && (
                                        <div className="mb-1">
                                          <span
                                            className="badge bg-danger text-white fw-bold px-2 py-1"
                                            style={{ fontSize: "0.7rem" }}
                                          >
                                            TIẾT KIỆM
                                            {formatPrice(discountAmount)}
                                          </span>
                                        </div>
                                      )}
                                      <p
                                        className="text-primary fw-bold mb-0"
                                        style={{ fontSize: "0.8rem" }}
                                      >
                                        {
                                          brands.find((b) => b.id === p.hang_id)
                                            ?.tenhang
                                        }
                                      </p>
                                      <p
                                        className="text-dark mb-1 text-truncate"
                                        style={{
                                          fontSize: "0.75rem",
                                          lineHeight: "1.2",
                                        }}
                                      >
                                        {p.tensp}
                                      </p>
                                      <div>
                                        <p
                                          className="text-primary fw-bold mb-0"
                                          style={{ fontSize: "0.9rem" }}
                                        >
                                          {formatPrice(
                                            newPrice + comboDiscount
                                          )}
                                        </p>
                                        <p
                                          className="text-muted"
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          <del>
                                            {formatPrice(
                                              oldPrice + comboDiscount
                                            )}
                                          </del>
                                          <span className="text-danger ms-1">
                                            -{discountPercent}%
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              );
                            })}
                            {Array(5 - chunk.length)
                              .fill()
                              .map((_, i) => (
                                <div
                                  key={`empty-${i}`}
                                  className="featured-fpt-card flex-shrink-0"
                                  style={{ visibility: "hidden" }}
                                >
                                  <div className="bg-white rounded-3 p-3">
                                    &nbsp;
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {featuredChunks.length > 1 && (
                      <>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target="#featuredCarousel"
                          data-bs-slide="prev"
                        >
                          <span className="carousel-control-prev-icon">
                            <i className="bi bi-chevron-left"></i>
                          </span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target="#featuredCarousel"
                          data-bs-slide="next"
                        >
                          <span className="carousel-control-next-icon">
                            <i className="bi bi-chevron-right"></i>
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sắp xếp */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <h6 className="fw-bold mb-0">Sắp xếp theo:</h6>
              <button
                className={`sort-btn ${
                  sortOption === "popular" ? "active" : ""
                }`}
                onClick={() => setSortOption("popular")}
              >
                Phổ biến
              </button>
              <button
                className={`sort-btn ${
                  sortOption === "price-asc" ? "active" : ""
                }`}
                onClick={() => setSortOption("price-asc")}
              >
                Giá Thấp - Cao
              </button>
              <button
                className={`sort-btn ${
                  sortOption === "price-desc" ? "active" : ""
                }`}
                onClick={() => setSortOption("price-desc")}
              >
                Giá Cao - Thấp
              </button>
            </div>

            <p className="mb-0 text-muted">
              Hiển thị <strong>{products.length}</strong> sản phẩm
            </p>

            {/* Danh sách sản phẩm */}
            <div className="row g-3 mb-4">
              {paginatedProducts.map((p) => (
                <div className="col-lg-4 col-md-6" key={p.masp}>
                  <Link
                    to={`/product/${p.masp}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="product-card p-3 rounded-4 shadow-sm h-100">
                      <img
                        src={`https://be-laravel.onrender.com/storage/img/${p.anhdaidien}`}
                        alt={p.tensp}
                        className="img-fluid rounded-3 mb-3"
                      />

                      <h6 className="fw-semibold text-truncate mb-1">
                        {p.tensp}
                      </h6>

                      <p className="text-primary fw-bold fs-5 mb-1">
                        {formatPrice(p.giamoi)}
                      </p>

                      {p.giacu && (
                        <small className="text-muted text-decoration-line-through">
                          {formatPrice(p.giacu)}
                        </small>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mb-5">
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 && "disabled"}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      «
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 && "active"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages && "disabled"
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      »
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* CSS giữ nguyên */}
      <style>{`
        .product-page { background: #f8f9fa; min-height: 100vh; }
        .category-item { background: #fff; border: 1px solid #e5e7eb; transition: all 0.3s; }
        .category-item:hover, .category-item.active { border-color: #0d6efd; transform: translateY(-3px); box-shadow: 0 4px 12px rgba(13,110,253,0.15); }
        .product-card { background: #fff; transition: all 0.3s; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }

        /* Carousel FPT Shop Style */
        .featured-fpt-card {
          width: 180px;
          flex: 0 0 180px;
        }
        .featured-fpt-card .badge {
          font-size: 0.7rem !important;
        }

        /* Nút điều hướng nhỏ, tròn, viền xám */
        .carousel-control-prev,
        .carousel-control-next {
          background: white;
          border: 1.5px solid #ddd;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .carousel-control-prev { left: -16px; }
        .carousel-control-next { right: -16px; }
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          background-image: none !important;
          color: #666;
          font-size: 1rem;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .featured-fpt-card { width: 160px; flex: 0 0 160px; }
        }
        @media (max-width: 768px) {
          .featured-fpt-card { width: 140px; flex: 0 0 140px; }
          .carousel-control-prev { left: -10px; }
          .carousel-control-next { right: -10px; }
        }

        .multi-range-container { position: relative; height: 6px; border-radius: 3px; margin: 0 6px; }
        .multi-range-container input[type="range"] { position: absolute; width: 100%; height: 100%; background: none; pointer-events: none; -webkit-appearance: none; top: 0; left: 0; }
        .multi-range-container input[type="range"]::-webkit-slider-thumb {
          height: 18px; width: 18px; border-radius: 50%; background: #0d6efd; pointer-events: auto; -webkit-appearance: none; box-shadow: 0 0 6px rgba(0,0,0,0.2); cursor: pointer; z-index: 2;
        }
           .brand-btn {
          background-color: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 5px 15px;
          transition: all 0.3s ease;
        }
        .brand-btn.active,
        .brand-btn:hover {
          border-color: #0d6efd;
          box-shadow: 0 0 10px rgba(13,110,253,0.2);
        }
        .sort-btn {
          background-color: #fff;
          border: 1px solid #d1d5db;
          color: #333;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .sort-btn:hover,
        .sort-btn.active {
          background-color: #0d6efd;
          border-color: #0d6efd;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default ProductPage;
