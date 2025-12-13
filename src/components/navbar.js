import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // ✅ Gọi API gợi ý (debounce 300ms)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim() !== "") {
        try {
          const res = await axios.get(
            `https://be-laravel.onrender.com/api/sanpham/search`,
            { params: { query: searchTerm } }
          );
          setSuggestions(res.data); // LẤY TẤT CẢ → để tính "Xem thêm"
          setShowSuggestions(true);
        } catch (err) {
          console.error("Lỗi khi tìm kiếm:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-2 sticky-top border-bottom">
      <div className="container d-flex align-items-center justify-content-between">
        <Link
          className="navbar-brand fw-bold text-primary fs-4 d-flex align-items-center"
          to="/"
        >
          <i className="bi bi-laptop me-2"></i>
          BT<span className="text-dark"> LAPTOP</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <i className="bi bi-list fs-2 text-primary"></i>
        </button>

        <div
          className="collapse navbar-collapse justify-content-between align-items-center"
          id="navbarNav"
        >
          <ul className="navbar-nav d-flex align-items-center gap-3 mb-0">
            {[
              { to: "/", label: "Trang chủ", icon: "bi-house-door" },
              { to: "/product", label: "Sản phẩm", icon: "bi-bag" },
              { to: "/about", label: "Liên hệ", icon: "bi-envelope" },
              { to: "/cart", label: "Giỏ hàng", icon: "fa fa-cart-plus" },
            ].map((item, i) => (
              <li key={i} className="nav-item">
                <Link
                  className="nav-link fw-semibold text-dark hover-primary px-2 d-flex align-items-center"
                  to={item.to}
                >
                  <i className={`${item.icon} me-1`}></i> {item.label}
                </Link>
              </li>
            ))}

            {/* 🔍 Thanh tìm kiếm */}
            <li className="nav-item position-relative">
              <form
                className="d-flex align-items-center"
                onSubmit={handleSearch}
                role="search"
              >
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control rounded-pill ps-3 pe-5"
                    style={{
                      width: "260px",
                      height: "38px",
                      fontSize: "0.9rem",
                    }}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                  />
                  <button
                    className="btn btn-primary position-absolute end-0 top-0 mt-1 me-1 rounded-circle "
                    style={{ width: "32px", height: "32px" }}
                    type="submit"
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </div>

                {/* 🔹 Gợi ý sản phẩm */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 shadow-sm"
                    style={{
                      top: "45px",
                      zIndex: 1000,
                      borderRadius: "10px",
                      overflow: "hidden",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    {/* 5 gợi ý đầu */}
                    {suggestions.slice(0, 5).map((item) => (
                      <li
                        key={item.masp}
                        className="list-group-item list-group-item-action d-flex align-items-center border-0"
                      >
                        <Link
                          to={`/product/${item.masp}`}
                          className="text-decoration-none text-dark d-flex align-items-center w-100 p-2"
                          onClick={() => {
                            setSearchTerm("");
                            setShowSuggestions(false);
                          }}
                        >
                          <img
                            src={`https://be-laravel.onrender.com/storage/img/${item.anhdaidien}`}
                            alt={item.tensp}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              marginRight: "10px",
                            }}
                          />
                          <span
                            className="text-truncate flex-grow-1"
                            style={{ maxWidth: "180px" }}
                          >
                            {item.tensp}
                          </span>
                        </Link>
                      </li>
                    ))}

                    {/* Nút "Xem thêm" nếu có > 5 */}
                    {suggestions.length > 5 && (
                      <li className="list-group-item border-0 bg-light text-center">
                        <Link
                          to={`/search?query=${encodeURIComponent(searchTerm)}`}
                          className="text-primary fw-semibold small d-block py-2 text-decoration-none"
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchTerm("");
                          }}
                        >
                          Xem thêm ({suggestions.length - 5} sản phẩm khác)
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </form>
            </li>
          </ul>

          {/* Khu vực người dùng */}
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <Link
                  className="d-flex align-items-center bg-light rounded-pill px-3 py-1 me-3 shadow-sm text-decoration-none"
                  to={user.loaiTK === 1 ? "/admin" : "/profile"} // ĐÚNG
                >
                  <i className="bi bi-person-circle text-primary me-2 fs-5"></i>
                  <span className="fw-semibold text-primary small">
                    {user.fullname || user.username}
                  </span>
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
                </button>
              </>
            ) : (
              <Link
                className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold"
                to="/login"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
