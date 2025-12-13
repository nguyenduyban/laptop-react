import axios from "axios";

const api = axios.create({
  baseURL: "https://be-laravel.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    const data = response.data;

    // Lưu token & user vào localStorage
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw error.response?.data || { message: "Đăng nhập thất bại" };
  }
};
export const loginWithGoogle = async (googleToken) => {
  try {
    const response = await api.post("/auth/google", {
      token: googleToken,
    });

    const data = response.data;

    // Lưu token và user khi login thành công
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);
    throw error.response?.data || { message: "Đăng nhập Google thất bại" };
  }
};

// 🟠 Đăng ký
export const register = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    throw error.response?.data || { message: "Đăng ký thất bại" };
  }
};

// 🔴 Đăng xuất
export const logout = async () => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      await api.post("/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (err) {
    console.error("Lỗi khi gọi API logout:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

// 🟣 Lấy thông tin user đang đăng nhập
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// 🟡 Kiểm tra đăng nhập
export const isLoggedIn = () => !!localStorage.getItem("token");

// 🟢 Cập nhật hồ sơ
export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw { message: "Chưa đăng nhập" };

  try {
    const response = await api.put("/profile/update", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = response.data;

    // Nếu API trả về user => cập nhật localStorage
    if (result.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    throw error.response?.data || { message: "Không thể cập nhật tài khoản" };
  }
};

// 🟣 Lấy thông tin hồ sơ
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw { message: "Chưa đăng nhập" };

  try {
    const response = await api.get("/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  } catch (error) {
    console.error("Lỗi lấy profile:", error);
    throw error.response?.data || { message: "Không thể lấy thông tin tài khoản" };
  }
};

export default api;
