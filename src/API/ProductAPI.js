import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});

// Hàm lấy danh sách sản phẩm
export const getAllProducts = async () => {
  try {
    const response = await api.get("/sanpham");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    throw error;
  }
};

export const getProductById = async (masp) => {
  try {
    const response = await api.get(`/sanpham/${masp}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post("/admin/sanpham", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Lỗi thêm sản phẩm:", err);
    console.log(err.response?.data);

    throw err;
  }
};

export const updateProduct = async (masp, formData) => {
  try {
    const token = localStorage.getItem("token"); // 🟢 Lấy token đã lưu khi đăng nhập

    const res = await api.post(
      `/admin/updatesanpham/${masp}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // 🟢 Thêm header xác thực
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("❌ Lỗi sửa sản phẩm:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteProduct = async (masp) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.delete(`/admin/xoasanpham/${masp}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi xóa sản phẩm:", err);
    throw err;
  }
};
