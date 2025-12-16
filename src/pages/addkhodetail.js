import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { nhapKhoChiTiet } from "../API/KhoDetail";
import { getAllNCC } from "../API/NhaCungCap";
import { useParams, useNavigate } from "react-router-dom";

const AddKhoDetail = () => {
  const { masp } = useParams();
  const navigate = useNavigate();

  const [soluong, setSoluong] = useState("");
  const [giaMua, setGiaMua] = useState("");
  const [ncc, setNcc] = useState("");
  const [ngayBHStart, setNgayBHStart] = useState("");
  const [ngayBHEnd, setNgayBHEnd] = useState("");

  const [listNCC, setListNCC] = useState([]);

  useEffect(() => {
    fetchNCC();
  }, []);

  const fetchNCC = async () => {
    try {
      const res = await getAllNCC();
      setListNCC(res.data);
    } catch (error) {
      console.log("Lỗi load NCC:", error);
      Swal.fire("Lỗi", "Không thể tải danh sách nhà cung cấp", "error");
    }
  };

  const handleSubmit = async () => {
    if (!soluong || !giaMua) {
      Swal.fire("Cảnh báo", "Vui lòng nhập đầy đủ thông tin", "warning");
      return;
    }

    try {
      await nhapKhoChiTiet({
        masp: masp,
        soluong_nhap: Number(soluong),
        gia_mua: Number(giaMua),
        id_ncc: ncc ? Number(ncc) : null,
        ngay_bao_hanh: ngayBHStart || null,
        han_bao_hanh: ngayBHEnd || null,
      });

      Swal.fire("Thành công", "Đã nhập kho chi tiết", "success");
      navigate(`/admin/kho-detail/${masp}`);
    } catch (e) {
      console.log("ERR ===>", e.response?.data);
      Swal.fire("Lỗi", JSON.stringify(e.response?.data), "error");
    }
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-3">Nhập kho chi tiết SP: {masp}</h3>

      <div className="mb-3">
        <label>Số lượng</label>
        <input
          type="number"
          className="form-control"
          value={soluong}
          onChange={(e) => setSoluong(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Giá mua</label>
        <input
          type="number"
          className="form-control"
          value={giaMua}
          onChange={(e) => setGiaMua(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Nhà cung cấp</label>
        <select
          className="form-control"
          value={ncc}
          onChange={(e) => setNcc(e.target.value)}
        >
          <option value="">-- Chọn nhà cung cấp --</option>

          {listNCC.map((n) => (
            <option key={n.id} value={n.id}>
              {n.ten}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Ngày bắt đầu bảo hành</label>
        <input
          type="date"
          className="form-control"
          value={ngayBHStart}
          onChange={(e) => setNgayBHStart(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Ngày hết bảo hành</label>
        <input
          type="date"
          className="form-control"
          value={ngayBHEnd}
          onChange={(e) => setNgayBHEnd(e.target.value)}
        />
      </div>

      <button className="btn btn-primary me-2" onClick={handleSubmit}>
        Nhập kho
      </button>

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Hủy
      </button>
    </div>
  );
};

export default AddKhoDetail;
