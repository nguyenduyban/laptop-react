import axios from "axios";

const API_URL = "https://be-laravel.onrender.com/api";

export const checkout = async (formData) => {
  try {
    const token = localStorage.getItem("token"); // ✅ Lấy token từ localStorage

    const response = await axios.post(`${API_URL}/checkout`, formData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // ✅ Gửi token để Sanctum xác thực
      },
    });

    return response.data;
  } catch (error) {
    console.error("Checkout error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Lỗi không xác định" };
  }
};
export const getOrdersByUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/checkout/user/${userId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get Orders error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Không thể tải đơn hàng" };
  }
};

// 🧾 Lấy chi tiết 1 đơn hàng
export const getOrderDetails = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/checkout/detail/${orderId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Get Order Details error:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { message: "Không thể tải chi tiết đơn hàng" }
    );
  }
};
export const createVNPayPayment = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/payment/vnpay/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
  });

  return response.data;
};
