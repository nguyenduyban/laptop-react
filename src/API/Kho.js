// src/API/Kho.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Lấy toàn bộ kho (không phân trang)
export const getAllKho = async () => {
  const res = await api.get("/kho"); // Route: GET /kho
  return res.data;
};

// Chi tiết 1 dòng kho (nếu cần)
export const getKhoById = async (id) => {
  const res = await api.get(`/kho/${id}`);
  return res.data;
};

// Nhập kho 1 sản phẩm
export const nhapKho = async ({ id_sanpham, soluong_nhap }) => {
  const res = await api.post("/admin/kho/nhap", { id_sanpham, soluong_nhap });
  return res.data;
};
export const getStockByProduct = async (masp) => {
  const res = await api.get(`/kho/sp/${masp}`);
  return res.data;
};

