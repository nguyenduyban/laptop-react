import React, { useState, useEffect } from "react";
import { createProduct } from "../API/ProductAPI";
import { getAllCategories } from "../API/Categories";
import { getAllHang } from "../API/Hang";
import { getAllTopic } from "../API/Topic";
import { useNavigate } from "react-router-dom";

// Icons
import {
  FaUpload,
  FaTimes,
  FaSave,
  FaBox,
  FaTag,
  FaDollarSign,
  FaAlignLeft,
  FaLayerGroup,
  FaTrademark,
} from "react-icons/fa";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tensp: "",
    mota: "",
    thongso: "",
    giamoi: "",
    giacu: "",
    trangthai: 1,
    danhMucId: "",
    hangId: "",
    chuyenMucId: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, hangs, topics] = await Promise.all([
          getAllCategories(),
          getAllHang(),
          getAllTopic(),
        ]);
        setCategories(cats || []);
        setBrands(hangs || []);
        setSubs(topics || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    document.querySelector('input[type="file"]').value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("tensp", form.tensp);
    fd.append("mota", form.mota);
    fd.append("thongso", form.thongso);
    fd.append("giamoi", form.giamoi);
    fd.append("giacu", form.giacu);
    fd.append("trangthai", form.trangthai);
    fd.append("danhmuc_id", form.danhMucId);
    fd.append("hang_id", form.hangId);
    fd.append("chuyenmuc_id", form.chuyenMucId);
    if (image) fd.append("anhdaidien", image);

    try {
      await createProduct(fd);
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/product");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-4">
              <h3 className="mb-0 text-center fw-bold d-flex align-items-center justify-content-center gap-2">
                <FaBox /> Thêm Sản Phẩm Mới
              </h3>
            </div>

            <div className="card-body p-5">
              <form onSubmit={handleSubmit} className="row g-4">
                {/* Tên sản phẩm */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaTag className="me-1 text-primary" /> Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-3"
                    name="tensp"
                    value={form.tensp}
                    onChange={handleInput}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                {/* Giá mới */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaDollarSign className="me-1 text-success" /> Giá mới
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg rounded-3"
                    name="giamoi"
                    value={form.giamoi}
                    onChange={handleInput}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* Giá cũ */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaDollarSign className="me-1 text-secondary" /> Giá cũ
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg rounded-3"
                    name="giacu"
                    value={form.giacu}
                    onChange={handleInput}
                    placeholder="Không bắt buộc"
                    min="0"
                  />
                </div>

                {/* Danh mục */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    <FaLayerGroup className="me-1 text-info" /> Danh mục
                  </label>
                  <select
                    name="danhMucId"
                    className="form-select form-select-lg rounded-3"
                    value={form.danhMucId}
                    onChange={handleInput}
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tendanhmuc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hãng */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    <FaTrademark className="me-1 text-warning" /> Hãng
                  </label>
                  <select
                    name="hangId"
                    className="form-select form-select-lg rounded-3"
                    value={form.hangId}
                    onChange={handleInput}
                    required
                  >
                    <option value="">-- Chọn hãng --</option>
                    {brands.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.tenhang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chuyên mục */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    <FaBox className="me-1 text-danger" /> Chuyên mục
                  </label>
                  <select
                    name="chuyenMucId"
                    className="form-select form-select-lg rounded-3"
                    value={form.chuyenMucId}
                    onChange={handleInput}
                    required
                  >
                    <option value="">-- Chọn chuyên mục --</option>
                    {subs.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.tenchuyenmuc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mô tả */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    <FaAlignLeft className="me-1 text-muted" /> Mô tả sản phẩm
                  </label>
                  <textarea
                    className="form-control rounded-3"
                    name="mota"
                    rows="4"
                    value={form.mota}
                    onChange={handleInput}
                    placeholder="Nhập mô tả chi tiết..."
                  />
                </div>
                {/* Thông số */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    <FaAlignLeft className="me-1 text-muted" /> Thông số kỹ thuật
                  </label>
                  <textarea
                    className="form-control rounded-3"
                    name="thongso"
                    rows="6"
                    value={form.thongso}
                    onChange={handleInput}
                    placeholder="CPU: Intel Core i5-13420H..."
                  />
                </div>
                {/* Ảnh đại diện */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    <FaUpload className="me-1 text-primary" /> Ảnh đại diện
                  </label>
                  <div className="border border-dashed rounded-3 p-4 text-center bg-light">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control form-control-lg"
                      onChange={handleImage}
                    />
                    {preview && (
                      <div className="mt-3 position-relative d-inline-block">
                        <img
                          src={preview}
                          alt="Preview"
                          className="rounded-3 shadow-sm"
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 translate-middle"
                          onClick={removeImage}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nút submit */}
                <div className="col-12 text-center mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2 mx-auto transition-all"
                    style={{
                      minWidth: "180px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "translateY(0)")
                    }
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <FaSave /> Thêm sản phẩm
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
