import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getProductById, updateProduct } from "../API/ProductAPI";
import { getAllCategories } from "../API/Categories";
import { getAllHang } from "../API/Hang";
import { getAllTopic } from "../API/Topic";

// Icons
import {
  FaEdit,
  FaTag,
  FaDollarSign,
  FaAlignLeft,
  FaLayerGroup,
  FaTrademark,
  FaBox,
  FaUpload,
  FaTimes,
  FaSave,
  FaImage,
} from "react-icons/fa";

const AdminProductUpdate = () => {
  const { masp } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tensp: "",
    mota: "",
    giamoi: "",
    giacu: "",
    trangthai: 1,
    danhmuc_id: "",
    hang_id: "",
    chuyenmuc_id: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [topics, setTopics] = useState([]);

  // Load dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, hangs, tops, product] = await Promise.all([
          getAllCategories(),
          getAllHang(),
          getAllTopic(),
          getProductById(masp),
        ]);

        setCategories(cats || []);
        setBrands(hangs || []);
        setTopics(tops || []);

        setForm({
          tensp: product.tensp || "",
          mota: product.mota || "",
          giamoi: product.giamoi || "",
          giacu: product.giacu || "",
          trangthai: product.trangthai || 1,
          danhmuc_id: product.danhmuc_id || "",
          hang_id: product.hang_id || "",
          chuyenmuc_id: product.chuyenmuc_id || "",
        });

        setOldImage(product.anhdaidien);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        Swal.fire("Lỗi!", "Không thể tải thông tin sản phẩm", "error");
      }
    };

    if (masp) fetchData();
  }, [masp]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeNewImage = () => {
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
    fd.append("giamoi", form.giamoi);
    fd.append("giacu", form.giacu);
    fd.append("trangthai", form.trangthai);
    fd.append("danhmuc_id", form.danhmuc_id);
    fd.append("hang_id", form.hang_id);
    fd.append("chuyenmuc_id", form.chuyenmuc_id);
    if (image) fd.append("anhdaidien", image);

    try {
      await updateProduct(masp, fd);
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Cập nhật sản phẩm thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/admin/product");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      Swal.fire("Lỗi!", "Không thể cập nhật sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  const imageUrl =
    preview ||
    (oldImage ? `https://be-laravel.onrender.com/storage/img/${oldImage}` : null);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header */}
            <div
              className="card-header bg-gradient text-white py-4"
              style={{
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              }}
            >
              <h3 className="mb-0 text-center fw-bold d-flex align-items-center justify-content-center gap-2">
                <FaEdit /> Cập Nhật Sản Phẩm
              </h3>
            </div>

            {/* Body */}
            <div className="card-body p-5">
              <form onSubmit={handleSubmit} className="row g-4">
                {/* Tên sản phẩm */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold d-flex align-items-center gap-1">
                    <FaTag className="text-primary" /> Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-3 shadow-sm"
                    name="tensp"
                    value={form.tensp}
                    onChange={handleChange}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                {/* Giá mới */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold d-flex align-items-center gap-1">
                    <FaDollarSign className="text-success" /> Giá mới
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg rounded-3 shadow-sm"
                    name="giamoi"
                    value={form.giamoi}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                {/* Giá cũ */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold d-flex align-items-center gap-1">
                    <FaDollarSign className="text-secondary" /> Giá cũ
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg rounded-3 shadow-sm"
                    name="giacu"
                    value={form.giacu}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                {/* Danh mục */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold d-flex align-items-center gap-1">
                    <FaLayerGroup className="text-info" /> Danh mục
                  </label>
                  <select
                    name="danhmuc_id"
                    className="form-select form-select-lg rounded-3 shadow-sm"
                    value={form.danhmuc_id}
                    onChange={handleChange}
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
                  <label className="form-label fw-semibold d-flex align-items-center gap-1">
                    <FaTrademark className="text-warning" /> Hãng
                  </label>
                  <select
                    name="hang_id"
                    className="form-select form-select-lg rounded-3 shadow-sm"
                    value={form.hang_id}
                    onChange={handleChange}
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
                  <label className="form-label fw-semibold d-flex align-items-center gap-1">
                    <FaBox className="text-danger" /> Chuyên mục
                  </label>
                  <select
                    name="chuyenmuc_id"
                    className="form-select form-select-lg rounded-3 shadow-sm"
                    value={form.chuyenmuc_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn chuyên mục --</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.tenchuyenmuc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mô tả */}
                <div className="col-12">
                  <label className="form-label fw-semibold d-flex align-items-center gap-1">
                    <FaAlignLeft className="text-muted" /> Mô tả sản phẩm
                  </label>
                  <textarea
                    className="form-control rounded-3 shadow-sm"
                    name="mota"
                    rows="4"
                    value={form.mota}
                    onChange={handleChange}
                    placeholder="Nhập mô tả chi tiết..."
                  />
                </div>

                {/* Ảnh đại diện */}
                <div className="col-12">
                  <label className="form-label fw-semibold d-flex align-items-center gap-1">
                    <FaImage className="text-primary" /> Ảnh đại diện
                  </label>

                  {/* Upload mới */}
                  <div className="border border-dashed rounded-3 p-4 bg-light text-center mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control form-control-lg"
                      onChange={handleImage}
                    />
                    <small className="text-muted d-block mt-2">
                      {preview
                        ? "Ảnh mới đã chọn"
                        : "Chọn ảnh mới (nếu muốn thay đổi)"}
                    </small>
                  </div>

                  {/* Preview ảnh */}
                  {imageUrl && (
                    <div className="position-relative d-inline-block">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="rounded-3 shadow-sm"
                        style={{
                          width: "220px",
                          height: "220px",
                          objectFit: "cover",
                        }}
                      />
                      {preview && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 translate-middle"
                          onClick={removeNewImage}
                          style={{ width: "32px", height: "32px" }}
                        >
                          <FaTimes />
                        </button>
                      )}
                      {!preview && oldImage && (
                        <div
                          className="position-absolute bottom-0 start-0 bg-success text-white px-2 py-1 rounded-end small fw-semibold"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Ảnh hiện tại
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Nút submit */}
                <div className="col-12 text-center mt-5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-success btn-lg px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2 mx-auto"
                    style={{
                      minWidth: "200px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "translateY(-3px)")
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
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <FaSave /> Cập nhật sản phẩm
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

export default AdminProductUpdate;
