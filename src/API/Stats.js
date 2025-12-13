import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};
export const getAdminStatsByMonth = async () => {
  const res = await api.get("/admin/stats/revenue");
  return res.data;
};
