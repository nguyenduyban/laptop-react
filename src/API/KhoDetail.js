import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAllKhoDetail = async () => {
  const res = await api.get("/admin/kho/chitiet");
  return res.data;
};

export const getKhoDetailById = async (id) => {
  const res = await api.get(`/admin/kho/chitiet/${id}`);
  return res.data;
};

export const nhapKhoChiTiet = async (data) => {
  const res = await api.post("/admin/kho/chitiet/nhap", data);
  return res.data;
};

export const updateKhoDetail = async (id, data) => {
  const res = await api.put(`/admin/kho/chitiet/${id}`, data);
  return res.data;
};

export const deleteKhoDetail = async (id) => {
  const res = await api.delete(`/admin/kho/chitiet/${id}`);
  return res.data;
};

export const getKhoDetailByProduct = async (masp) => {
  const res = await api.get(`/admin/kho/chitiet/product/${masp}`);
  return res.data;
};
