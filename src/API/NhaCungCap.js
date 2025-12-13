import axios from "axios";

const API_URL = "https://be-laravel.onrender.com/api/admin/nhacungcap";

// Tạo axios instance
const axiosAuth = axios.create();

// Gắn token vào tất cả request
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ======================= API =======================

// GET: danh sách nhà cung cấp
export const getAllNCC = async () => {
  return await axiosAuth.get(API_URL);
};

// POST: thêm NCC
export const createNCC = async (data) => {
  return await axiosAuth.post(`${API_URL}/them`, data);
};

// GET: lấy 1 NCC
export const getOneNCC = async (id) => {
  return await axiosAuth.get(`${API_URL}/${id}`);
};

// PUT: update
export const updateNCC = async (id, data) => {
  return await axiosAuth.put(`${API_URL}/update/${id}`, data);
};

// DELETE: xóa
export const deleteNCC = async (id) => {
  return await axiosAuth.delete(`${API_URL}/xoa/${id}`);
};
