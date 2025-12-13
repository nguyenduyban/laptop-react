import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Hàm lấy danh sách carosel
export const getAllCarousel = async () => {
  try {
    const response = await api.get("/slideshow");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách slideshow:", error);
    throw error;
  }
};
export const getCarouselById = async (STT) => {
  try {
    const response = await api.get(`/slideshow/${STT}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    throw error;
  }
};
// Thêm slideshow
export const createCarousel = async (formData) => {
  const res = await api.post("/admin/slides", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Cập nhật slideshow
export const updateCarousel = async (STT, formData) => {
  const res = await api.post(`/admin/slides/${STT}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Xóa slideshow
export const deleteCarousel = async (STT) => {
  const res = await api.delete(`/admin/slides/${STT}`);
  return res.data;
};
