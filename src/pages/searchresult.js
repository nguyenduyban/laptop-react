import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchProducts } from "../API/Search";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("query") || "";
  const urlPage = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(urlQuery);

  const itemsPerPage = 12;

  // Tìm kiếm + phân trang
  const fetchResults = async (q, page = 1) => {
    setLoading(true);
    try {
      const data = await searchProducts(q, page, itemsPerPage);
      setProducts(data.products || data);
      setTotal(data.total || data.length);
    } catch (err) {
      console.error("Lỗi:", err);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Load từ URL
  useEffect(() => {
    if (urlQuery) {
      setSearchInput(urlQuery);
      fetchResults(urlQuery, urlPage);
    }
  }, [urlQuery, urlPage]);

  // Tìm khi gõ
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchInput.trim()) {
        setSearchParams({ query: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchInput]);

  // Submit form
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ query: searchInput, page: 1 });
    }
  };

  // Đổi trang
  const handlePageChange = (page) => {
    setSearchParams({ query: urlQuery, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const startItem = (urlPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(urlPage * itemsPerPage, total);

  return (
    <div className="container my-5">
      <h4 className="fw-bold text-dark mb-4 text-center">
        Kết quả tìm kiếm cho: <span className="text-primary">"{urlQuery}"</span>
      </h4>

      {/* Ô tìm kiếm */}
      <form onSubmit={handleSearch} className="mb-5">
        <div
          className="position-relative"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <input
            type="text"
            className="form-control form-control-lg rounded-pill shadow-sm ps-5 pe-5"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          <button
            type="submit"
            className="btn btn-primary position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle"
            style={{ width: "38px", height: "38px" }}
          >
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Đang tìm...</span>
          </div>
        </div>
      )}

      {/* Kết quả */}
      {!loading && products.length > 0 && (
        <>
          <p className="text-muted text-center mb-4">
            Hiển thị{" "}
            <strong>
              {startItem}–{endItem}
            </strong>{" "}
            trong <strong>{total}</strong> kết quả
          </p>

          <div className="row g-4">
            {products.map((p) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={p.masp}>
                <Link
                  to={`/product/${p.masp}`}
                  className="text-decoration-none"
                >
                  <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-lift">
                    <img
                      src={`https://be-laravel.onrender.com/storage/img/${p.anhdaidien}`}
                      alt={p.tensp}
                      className="card-img-top"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        transition: "0.3s",
                      }}
                    />
                    <div className="card-body text-center p-3">
                      <h6 className="fw-semibold text-dark text-truncate mb-2">
                        {p.tensp}
                      </h6>
                      <p className="text-primary fw-bold fs-5 mb-1">
                        {p.giamoi
                          ? `${parseFloat(p.giamoi).toLocaleString("vi-VN")}đ`
                          : "Liên hệ"}
                      </p>
                      {p.giacu && (
                        <p className="text-muted small text-decoration-line-through">
                          {parseFloat(p.giacu).toLocaleString("vi-VN")}đ
                        </p>
                      )}
                    </div>
                    <div className="card-footer bg-white border-0 text-center pb-3">
                      <span className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        Xem chi tiết
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-5">
              <ul className="pagination pagination-lg">
                <li className={`page-item ${urlPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link rounded-pill"
                    onClick={() => handlePageChange(urlPage - 1)}
                    disabled={urlPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (urlPage <= 3) {
                    pageNum = i + 1;
                  } else if (urlPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = urlPage - 2 + i;
                  }
                  return (
                    <li
                      key={pageNum}
                      className={`page-item ${
                        urlPage === pageNum ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link rounded-pill"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                {totalPages > 5 && urlPage < totalPages - 2 && (
                  <>
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                    <li className="page-item">
                      <button
                        className="page-link rounded-pill"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  </>
                )}

                <li
                  className={`page-item ${
                    urlPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link rounded-pill"
                    onClick={() => handlePageChange(urlPage + 1)}
                    disabled={urlPage === totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {!loading && products.length === 0 && urlQuery && (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown fs-1 text-muted mb-3"></i>
          <p className="text-muted fs-5">
            Không tìm thấy sản phẩm nào phù hợp với "<strong>{urlQuery}</strong>
            "
          </p>
          <p className="text-secondary">Hãy thử từ khóa khác!</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
