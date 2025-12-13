import React, { useEffect, useState } from "react";
import {
  getAllCarousel,
  createCarousel,
  updateCarousel,
  deleteCarousel,
} from "../API/Carousel";

const AdminCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    tenfile: null,
    trangthai: 1,
  });

  const [editing, setEditing] = useState(null);

  const fetchSlides = async () => {
    const data = await getAllCarousel();
    setSlides(data);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, tenfile: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (form.tenfile) formData.append("tenfile", form.tenfile);
    formData.append("trangthai", form.trangthai);

    if (editing) {
      await updateCarousel(editing, formData);
      alert("Cập nhật thành công!");
    } else {
      await createCarousel(formData);
      alert("Thêm slideshow thành công!");
    }

    setForm({ tenfile: null, trangthai: 1 });
    setPreview(null);
    setEditing(null);
    fetchSlides();
  };

  const handleEdit = (slide) => {
    setEditing(slide.STT);
    setForm({ tenfile: null, trangthai: slide.trangthai });
    setPreview(`https://be-laravel.onrender.com/storage/img/${slide.tenfile}`);
  };

  const handleDelete = async (STT) => {
    if (!window.confirm("Bạn chắc muốn xóa?")) return;
    await deleteCarousel(STT);
    fetchSlides();
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">Quản lý Banner</h2>

      {/* FORM */}
      <form className="mt-4" onSubmit={handleSubmit}>
        <label className="fw-bold">Ảnh:</label>
        <input type="file" className="form-control" onChange={handleFile} />

        {preview && (
          <img
            src={preview}
            className="mt-3"
            width="300"
            style={{ borderRadius: "8px" }}
          />
        )}

        <label className="mt-3 fw-bold">Trạng thái:</label>
        <select
          className="form-select"
          value={form.trangthai}
          onChange={(e) => setForm({ ...form, trangthai: e.target.value })}
        >
          <option value="1">Hiển thị</option>
          <option value="0">Ẩn</option>
        </select>

        <button className="btn btn-primary mt-3">
          {editing ? "Cập nhật" : "Thêm mới"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => {
              setEditing(null);
              setForm({ tenfile: null, trangthai: 1 });
              setPreview(null);
            }}
          >
            Hủy
          </button>
        )}
      </form>

      {/* TABLE */}
      <h3 className="mt-4">Danh sách banner</h3>
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {slides.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                Không có banner nào
              </td>
            </tr>
          ) : (
            slides.map((s) => (
              <tr key={s.STT}>
                <td>{s.STT}</td>
                <td>
                  <img
                    src={`https://be-laravel.onrender.com/storage/img/${s.tenfile}`}
                    width="150"
                  />
                </td>
                <td>
                  <span
                    className={`badge ${
                      s.trangthai == 1 ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {s.trangthai == 1 ? "Hiển thị" : "Ẩn"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(s)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(s.STT)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCarousel;
