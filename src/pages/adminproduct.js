import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { getAllProducts, deleteProduct } from "../API/ProductAPI";
import { getAllCategories } from "../API/Categories";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load dữ liệu
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      Swal.fire("Lỗi!", "Không thể tải sản phẩm", "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
    }
  };

  // Reset trang khi filter
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const handleDelete = async (masp) => {
    const result = await Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(masp);
      Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
      fetchProducts();
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể xóa sản phẩm.", "error");
    }
  };

  // Lọc frontend
  const filtered = (products || []).filter((p) => {
    const matchSearch = p.tensp?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? p.danhmuc_id == category : true;
    return matchSearch && matchCategory;
  });

  // Phân trang
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* TITLE */}
        <h3 className="fw-bold">
          <i className="fa-solid fa-box text-primary me-2"></i>
          Quản lý Sản phẩm
        </h3>

        {/* FILTER BAR */}
        <div className="row g-3 my-4">
          <div className="col-md-5">
            <input
              className="form-control rounded-pill"
              placeholder="Tìm tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select rounded-pill"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tendanhmuc}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <Link
              to="/admin/product/add"
              className="btn btn-success rounded-pill w-100"
            >
              + Thêm sản phẩm
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
            </div>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Hãng</th>
                  <th>Giá mới</th>
                  <th>Giá cũ</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      <i className="fa-solid fa-inbox fa-2x mb-2 d-block"></i>
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p, idx) => (
                    <tr key={p.masp}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>
                        <img
                          src={`https://be-laravel.onrender.com/storage/img/${p.anhdaidien}`}
                          alt={p.tensp}
                          width="60"
                          height="60"
                          className="rounded"
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </td>
                      <td>
                        <b>{p.tensp}</b>
                        <br />
                        <small className="text-muted">
                          {p.mota?.substring(0, 50)}...
                        </small>
                      </td>
                      <td>{p.danhmuc?.tendanhmuc || "—"}</td>
                      <td>{p.hang?.tenhang || "—"}</td>
                      <td className="text-danger fw-bold">
                        {Number(p.giamoi || 0).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="text-muted text-decoration-line-through">
                        {Number(p.giacu || 0).toLocaleString("vi-VN")}đ
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            p.trangthai === 1 ? "success" : "secondary"
                          }`}
                        >
                          {p.trangthai === 1 ? "Hiển thị" : "Ẩn"}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/admin/product/edit/${p.masp}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          Sửa
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p.masp)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-primary me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ◀ Trang trước
            </button>

            <span className="px-3 py-2 border rounded">
              Trang {currentPage} / {totalPages}
            </span>

            <button
              className="btn btn-outline-primary ms-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Trang sau ▶
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminProducts;
