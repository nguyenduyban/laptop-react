import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const getAllDonHang = async (page = 1) => {
  const res = await api.get(`/admin/donhang?page=${page}`);
  return res.data;
};

export const getDonHangDetail = async (id) => {
  const res = await api.get(`/admin/donhang/${id}`);
  return res.data;
};

export const updateDonHangStatus = async (id, data) => {
  const res = await api.put(`/admin/donhang/${id}/status`, data);
  return res.data;
};
