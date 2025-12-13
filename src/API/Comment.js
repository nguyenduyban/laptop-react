import axios from "axios";
const API_URL = "https://be-laravel.onrender.com/api";

// Lấy tất cả bình luận cho Admin
export const getAllCommentsAdmin = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/admin/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi lấy danh sách bình luận:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getComments = async (productId) => {
  const res = await axios.get(`${API_URL}/comments/${productId}`);
  return res.data;
};

export const postComment = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    console.log("📦 Gửi bình luận:", formData); // 👉 kiểm tra dữ liệu

    const response = await axios.post(
      "https://be-laravel.onrender.com/api/comments",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi gửi bình luận:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateCommentStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/admin/comments/${id}/status`,
      { trangthai: status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi cập nhật trạng thái:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteComment = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${API_URL}/admin/comments/xoa/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi xóa bình luận:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getCommentsByUserAdmin = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/admin/comments/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(
      "❌ Lỗi lấy bình luận theo user (admin):",
      error.response?.data || error.message
    );
    throw error;
  }
};
