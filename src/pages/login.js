import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import { login, loginWithGoogle } from "../API/Auth"; // ✅ thêm loginWithGoogle
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(username, password);
      loginUser(data.user);

      alert("Đăng nhập thành công!");

      if (data.user.loaiTK === 1) navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xử lý login Google
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const data = await loginWithGoogle(idToken);

      loginUser(data.user); // đưa user vào Context

      alert("Đăng nhập Google thành công!");

      if (data.user.loaiTK === 1) navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError("Google Login thất bại!");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: "linear-gradient(135deg, #007bff, #004085)" }}
    >
      <div className="text-center w-100" style={{ maxWidth: "400px" }}>
        <div className="mb-4 text-white">
          <i className="bi bi-cart3 display-1"></i>
        </div>

        <div className="card shadow border-0 rounded-4 p-4">
          <div className="card-body">
            <h5 className="fw-bold mb-4">ĐĂNG NHẬP</h5>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-primary fw-bold"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "LOGIN"}
                </button>
              </div>

              {/* ✅ Nút login Google */}
              <div className="d-flex justify-content-center mb-3">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError("Không thể đăng nhập bằng Google")}
                />
              </div>
              <div>
                <a
                  href="/signin"
                  className="text-decoration-none small"
                  style={{ color: "#0d6efd" }}
                >
                  chưa có tài khoản? đăng ký ngay
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-decoration-none small"
                  style={{ color: "#0d6efd" }}
                >
                  quên mật khẩu
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
