import axios from "axios";

const API_URL = "https://be-laravel.onrender.com/api";

// Lấy danh sách tài khoản
export const getAllAccounts = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/admin/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách tài khoản:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy chi tiết 1 tài khoản
export const getAccountById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/admin/accounts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Lỗi lấy tài khoản:", error.response?.data || error.message);
    throw error;
  }
};

// Thêm tài khoản mới
export const createAccount = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(`${API_URL}/admin/accounts`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Lỗi tạo tài khoản:", error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật tài khoản
export const updateAccount = async (id, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(`${API_URL}/admin/accounts/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Lỗi cập nhật tài khoản:", error.response?.data || error.message);
    throw error;
  }
};

// Xóa tài khoản
export const deleteAccount = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(`${API_URL}/admin/accounts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Lỗi xóa tài khoản:", error.response?.data || error.message);
    throw error;
  }
};
