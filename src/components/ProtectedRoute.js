// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedLoaiTK }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-4">Đang kiểm tra...</div>;
  }

  // Kiểm tra nếu allowedLoaiTK không được truyền hoặc không phải mảng
  if (!Array.isArray(allowedLoaiTK)) {
    console.error("allowedLoaiTK phải là mảng, nhận được:", allowedLoaiTK);
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.warn("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!allowedLoaiTK.includes(user.loaiTK)) {
    console.warn("Unauthorized access, redirecting to login", user.loaiTK);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;