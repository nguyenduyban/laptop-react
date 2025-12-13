// src/pages/AdminKho.jsx
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { getAllKho } from "../API/Kho";
import { useNavigate } from "react-router-dom";

const numberVN = (n) => (Number(n) || 0).toLocaleString("vi-VN");

const AdminKho = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchKho();
  }, []);

  const fetchKho = async () => {
    setLoading(true);
    try {
      const data = await getAllKho();
      setRows(Array.isArray(data.data) ? data.data : data);
    } catch (e) {
      Swal.fire("Lỗi", "Không thể tải dữ liệu kho", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = r?.sanpham?.tensp?.toLowerCase() || "";
      const idStr = String(r?.sanpham?.masp || r?.id_sanpham || "");
      return name.includes(q) || idStr.includes(q);
    });
  }, [rows, search]);

  const stats = useMemo(() => {
    const totalTon = filtered.reduce(
      (s, r) => s + (Number(r.soluong_ton) || 0),
      0
    );
    const totalDaBan = filtered.reduce(
      (s, r) => s + (Number(r.soluong_daban) || 0),
      0
    );
    return { totalTon, totalDaBan };
  }, [filtered]);

  const handleProductClick = (row) => {
    const masp = row.id_sanpham ?? row.sanpham?.masp;
    if (!masp) return;
    navigate(`/admin/kho-detail/${masp}`);
  };

  const handleAddKhoDetail = (row) => {
    const masp = row.id_sanpham ?? row.sanpham?.masp;
    if (!masp) return;
    navigate(`/admin/add-kho-detail/${masp}`);
  };

  return (
    <div className="container py-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="fw-bold mb-3">
          <i className="fa-solid fa-warehouse text-primary me-2" />
          Quản lý kho
        </h3>

        {/* Controls */}
        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-5">
            <input
              className="form-control rounded-pill"
              placeholder="Tìm theo tên sản phẩm hoặc mã SP…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-7 text-md-end">
            <span className="badge bg-info me-2">
              Tổng tồn: <b>{numberVN(stats.totalTon)}</b>
            </span>
            <span className="badge bg-success">
              Đã bán: <b>{numberVN(stats.totalDaBan)}</b>
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th className="text-center">Thao tác</th>
                <th className="text-end">Tồn</th>
                <th className="text-end">Đã bán</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    Đang tải…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const idSP = r.id_sanpham ?? r.sanpham?.masp;
                  return (
                    <tr key={r.id ?? idSP ?? idx}>
                      <td>{idx + 1}</td>
                      <td
                        style={{ minWidth: 280, cursor: "pointer" }}
                        onClick={() => handleProductClick(r)}
                      >
                        <td
                          style={{
                            minWidth: 280,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                          onClick={() => handleProductClick(r)}
                        >
                          {r.sanpham?.anhdaidien && (
                            <img
                              src={`https://be-laravel.onrender.com/storage/img/${r.sanpham.anhdaidien}`}
                              alt={r.sanpham?.tensp}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          )}
                        </td>
                        {r.sanpham?.tensp || "Sản phẩm"} <br />
                        <small className="text-muted">Mã SP: {idSP}</small>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAddKhoDetail(r)}
                        >
                          <i className="fa-solid fa-plus me-1" />
                          Nhập kho chi tiết
                        </button>
                      </td>
                      <td className="text-end">{numberVN(r.soluong_ton)}</td>
                      <td className="text-end">{numberVN(r.soluong_daban)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminKho;
