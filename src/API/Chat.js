import axios from "axios";

const API_URL = "https://be-laravel.onrender.com/api";
const getToken = () => localStorage.getItem("token");

// Gửi tin nhắn – token chỉ dùng nếu là admin, user thường không cần
export const sendMessage = (data) => {
  const token = getToken();
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return axios.post(`${API_URL}/send`, data, config);
};

// Lấy tin nhắn của 1 user – chỉ admin mới cần token
export const getMessages = (userId) => {
  const token = getToken();
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return axios.get(`${API_URL}/messages/${userId}`, config);
};

// Lấy danh sách khách hàng chat – admin mới cần token
export const getChatUsers = () => {
  const token = getToken();
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return axios.get(`${API_URL}/chat/users`, config);
};
