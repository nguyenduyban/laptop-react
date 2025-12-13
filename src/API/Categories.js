import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});

export const getAllCategories = async () => {
  try {
    const response = await api.get("/danhmuc");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh muc:", error);
    throw error;
  }
};

export const getDanhMucByHang = async (hangId) => {
  try {
    const response = await api.get(`/hang/${hangId}/danhmuc`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo hãng:", error);
    throw error;
  }
};

export const getProductByCategories = async (danhmuc_id) => {
  try {
    const response = await api.get(`/danhmuc/sanpham/${danhmuc_id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy san pham chuyen muc:", error);
    throw error;
  }
};
export const createCategory = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/admin/themdanhmuc", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateCategory = async (id, formData) => {
  const token = localStorage.getItem("token");
  formData.append("_method", "PUT"); // 🔹 Laravel sẽ hiểu đây là PUT

  const res = await api.post(`/admin/updatedanhmuc/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteCategory = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/admin/xoadanhmuc/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
