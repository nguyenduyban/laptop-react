import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { getAllHang, createHang, updateHang, deleteHang } from "../API/Hang";

const AdminHang = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [preview, setPreview] = useState(null);
  const [newBrand, setNewBrand] = useState({
    tenhang: "",
    hinhanh: null,
    trangthai: 1,
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getAllHang();
      setBrands(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Lỗi!", "Không thể tải danh sách hãng", "error");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  // Submit thêm / sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBrand.tenhang.trim()) {
      Swal.fire("Cảnh báo", "Tên hãng không được để trống", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("tenhang", newBrand.tenhang);
    formData.append("trangthai", newBrand.trangthai);
    if (newBrand.hinhanh instanceof File) {
      formData.append("hinhanh", newBrand.hinhanh);
    }

    try {
      if (editing) {
        await updateHang(editing.id, formData);
        Swal.fire("Thành công!", "Đã cập nhật hãng.", "success");
      } else {
        await createHang(formData);
        Swal.fire("Thành công!", "Đã thêm hãng mới.", "success");
      }

      resetForm();
      fetchBrands();
    } catch {
      Swal.fire("Lỗi", "Không thể lưu hãng.", "error");
    }
  };

  const resetForm = () => {
    setNewBrand({ tenhang: "", hinhanh: null, trangthai: 1 });
    setPreview(null);
    setEditing(null);
  };

  const handleEdit = (b) => {
    setEditing(b);
    setNewBrand({
      tenhang: b.tenhang,
      hinhanh: b.hinhanh,
      trangthai: b.trangthai,
    });
    setPreview(`https://be-laravel.onrender.com/storage/img/${b.hinhanh}`);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Xóa hãng?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteHang(id);
      Swal.fire("Đã xóa!", "Hãng đã được xóa.", "success");
      fetchBrands();
    } catch {
      Swal.fire("Lỗi", "Không thể xóa hãng", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewBrand({ ...newBrand, hinhanh: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // =======================
  //  FILTER + PAGINATION
  // =======================
  const filteredBrands = brands.filter((b) =>
    b.tenhang?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const currentItems = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* TITLE */}
        <h3 className="fw-bold mb-4">
          <i className="fa-solid fa-layer-group text-primary me-2"></i>
          Quản lý Hãng sản xuất
        </h3>

        {/* FORM */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Tên hãng..."
              value={newBrand.tenhang}
              onChange={(e) =>
                setNewBrand({ ...newBrand, tenhang: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <input
              type="file"
              className="form-control rounded-pill"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <img
                src={preview}
                className="img-thumbnail mt-2"
                width="60"
                height="60"
                style={{ objectFit: "cover" }}
                alt=""
              />
            )}
          </div>

          <div className="col-md-5 d-flex gap-2">
            <button
              className="btn btn-success rounded-pill px-4"
              onClick={handleSubmit}
            >
              {editing ? "Cập nhật" : "Thêm mới"}
            </button>
            {editing && (
              <button
                className="btn btn-secondary rounded-pill px-4"
                onClick={resetForm}
              >
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="row mb-4">
          <div className="col-md-5">
            <input
              className="form-control rounded-pill"
              placeholder="Tìm kiếm hãng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 text-muted">Đang tải hãng...</p>
            </div>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Ảnh</th>
                  <th>Tên hãng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      Không tìm thấy hãng nào
                    </td>
                  </tr>
                ) : (
                  currentItems.map((b, idx) => (
                    <tr key={b.id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>

                      <td>
                        <img
                          src={`https://be-laravel.onrender.com/storage/img/${b.hinhanh}`}
                          className="brand-img"
                          alt={b.tenhang}
                        />
                      </td>

                      <td>{b.tenhang}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(b)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(b.id)}
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
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  onClick={() => goToPage(i + 1)}
                >
                  <button className="page-link">{i + 1}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>
      <style>{`
  .brand-img {
    width: 60px;
    height: 60px;
    object-fit: contain;  
    background: #f8f9fa;  
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 5px;          /* tạo khoảng cách để logo không sát mép */
  }
`}</style>
    </div>
  );
};

export default AdminHang;
