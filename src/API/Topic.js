import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});

// 🔐 Hàm tạo header xác thực (tránh lỗi khi token thay đổi)
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
};

// 🧩 Lấy tất cả chuyên mục
export const getAllTopic = async () => {
  const res = await api.get("/chuyenmuc");
  return res.data;
};

// 🧩 Lấy chi tiết chuyên mục theo ID
export const getTopicById = async (id) => {
  const res = await api.get(`/chuyenmuc/${id}`);
  return res.data;
};

// 🧩 Lấy danh sách sản phẩm theo chuyên mục
export const getProductByTopic = async (chuyenmuc_id) => {
  const res = await api.get(`/chuyenmuc/sanpham/${chuyenmuc_id}`);
  return res.data;
};

// ➕ Thêm chuyên mục mới
export const addTopic = async (data) => {
  try {
    const res = await api.post("/admin/themchuyenmuc", data, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error("🔥 Lỗi thêm chuyên mục:", err.response?.data || err);
    throw err;
  }
};

// ✏️ Cập nhật chuyên mục
export const updateTopic = async (id, data) => {
  try {
    const res = await api.put(
      `/admin/updatechuyenmuc/${id}`,
      data,
      getAuthHeader()
    );
    return res.data;
  } catch (err) {
    console.error("🔥 Lỗi cập nhật chuyên mục:", err.response?.data || err);
    throw err;
  }
};

// 🗑️ Xóa chuyên mục
export const deleteTopic = async (id) => {
  try {
    const res = await api.delete(`/admin/xoachuyenmuc/${id}`, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error("🔥 Lỗi xóa chuyên mục:", err.response?.data || err);
    throw err;
  }
};
