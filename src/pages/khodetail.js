import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getKhoDetailByProduct } from "../API/KhoDetail";
import { useParams, useNavigate } from "react-router-dom";

// Format số VN
const numberVN = (n) => (Number(n) || 0).toLocaleString("vi-VN");

// Format ngày dd/mm/yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("vi-VN");
};

const Khodetail = () => {
  const { masp } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [masp]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await getKhoDetailByProduct(masp);
      setRows(Array.isArray(data.data) ? data.data : data);
    } catch (e) {
      Swal.fire("Lỗi", "Không thể tải kho chi tiết", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-3">Kho chi tiết SP: {masp}</h3>
      <button
        className="btn btn-sm btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Quay lại
      </button>

      <button
        className="btn btn-sm btn-primary mb-3 ms-2"
        onClick={() => navigate(`/admin/add-kho-detail/${masp}`)}
      >
        Nhập kho chi tiết
      </button>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Nhà cung cấp</th>
              <th>Số lượng</th>
              <th>Giá mua</th>
              <th>Ngày nhập</th>
              <th>Bắt đầu BH</th>
              <th>Hết BH</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-5">
                  Đang tải…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.id ?? idx}>
                  <td>{idx + 1}</td>
                  <td>{r.nhacungcap?.ten || "Chưa có NCC"}</td>
                  <td>{numberVN(r.soluong_nhap)}</td>
                  <td>{numberVN(r.gia_mua)}</td>
                  <td>{new Date(r.created_at).toLocaleDateString("vi-VN")}</td>
                  <td>{formatDate(r.ngay_bao_hanh)}</td>
                  <td>{formatDate(r.han_bao_hanh)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Khodetail;
