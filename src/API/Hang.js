import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});

export const getAllHang = async () => {
  try {
    const response = await api.get("/hang");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chuyen muc:", error);
    throw error;
  }
};
export const getHangByid = async (id) => {
  try {
    const response = await api.get(`/hang/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết chuyen muc:", error);
    throw error;
  }
};
export const getProductByHang = async (hang_id) => {
  try {
    const response = await api.get(`/hang/sanpham/${hang_id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy san pham chuyen muc:", error);
    throw error;
  }
};
export const createHang = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post("/admin/themhang", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi thêm hãng:", error.response?.data || error);
    throw error;
  }
};

export const updateHang = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");

    formData.append("_method", "PUT");

    const res = await api.post(`/admin/updatehang/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật hãng:", error.response?.data || error);
    throw error;
  }
};

export const deleteHang = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/admin/xoahang/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi xóa hãng:", error);
    throw error;
  }
};
