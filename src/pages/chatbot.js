// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("bot");
  const messagesEndRef = useRef(null);

  const generateStableId = () => {
    let id = localStorage.getItem("stable_chat_id");
    if (!id) {
      id = "guest_" + Date.now();
      localStorage.setItem("stable_chat_id", id);
    }
    return id;
  };

  const userId =
    user?.id || localStorage.getItem("stable_chat_id") || generateStableId();
  const userName = user?.fullname || `Khách #${userId.slice(-6)}`;

  // LẤY LỊCH SỬ TIN NHẮN
  useEffect(() => {
    axios
      .get(`https://be-laravel.onrender.com/api/messages/${userId}`)
      .then((res) => {
        const msgs = (res.data || []).map((msg) => ({
          ...msg,
          user_name: msg.is_admin
            ? mode === "bot"
              ? "Trợ lý"
              : "Hỗ trợ"
            : userName,
          products: msg.products || [],
        }));
        setMessages(msgs);
      })
      .catch(() => setMessages([]));
  }, [userId, mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!window.Echo || !userId) return;

    const channel = window.Echo.private(`chat.user.${userId}`).listen(
      ".NewMessage",
      (e) => {
        console.log("Khách nhận tin realtime:", e);
        const msg = {
          ...e,
          user_name: e.is_admin
            ? mode === "bot"
              ? "Trợ lý"
              : "Hỗ trợ"
            : userName,
          products: e.products || [],
        };
        setMessages((prev) => [...prev, msg]);
      }
    );

    return () => {
      channel.stopListening(".NewMessage");
      window.Echo.leave(`chat.user.${userId}`);
    };
  }, [userId, mode]);

  // GỬI TIN NHẮN
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const tempMsg = {
      user_id: userId,
      message: trimmed,
      is_admin: false,
      user_name: userName,
      temp: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInput("");

    try {
      if (mode === "bot") {
        const res = await axios.post("https://be-laravel.onrender.com/api/chatbot", {
          message: trimmed,
          user_id: userId,
        });

        const botReply = res.data.reply || "Đang xử lý...";
        const products = res.data.products || [];

        const botMsg = {
          user_id: 0,
          is_admin: true,
          message: botReply,
          user_name: "Trợ lý",
          created_at: new Date().toISOString(),
          products: products,
        };

        setMessages((prev) => [...prev.filter((m) => !m.temp), botMsg]);
      } else {
        // CHỈ GỬI API – KHÔNG THÊM TIN NHẮN VÀO STATE!
        // ĐỂ PUSHER REALTIME LÀM VIỆC!
        await axios.post("https://be-laravel.onrender.com/api/send", {
          message: trimmed,
          user_id: userId,
        });

        // XÓA TIN TẠM → ĐỢI REALTIME THÊM TIN THẬT
        setMessages((prev) => prev.filter((m) => !m.temp));
      }
    } catch (error) {
      console.error("Lỗi gửi:", error);
      setMessages((prev) => [
        ...prev.filter((m) => !m.temp),
        {
          user_id: 0,
          is_admin: true,
          message: "Gửi thất bại! Vui lòng thử lại.",
          user_name: "Hệ thống",
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };
  // HIỂN THỊ TIN NHẮN + SẢN PHẨM
  const MessageItem = ({ msg }) => {
    const isFromUser = !msg.is_admin;
    const time = msg.created_at
      ? new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <div
        className={`d-flex mb-3 ${
          isFromUser ? "justify-content-end" : "justify-content-start"
        }`}
      >
        {/* Avatar */}
        {!isFromUser && (
          <div className="d-flex flex-column align-items-center me-2">
            <div
              className="bg-white rounded-circle d-flex align-items-center justify-content-center border"
              style={{ width: 32, height: 32 }}
            >
              <i
                className={`bi ${
                  mode === "bot" ? "bi-headset" : "bi-person-fill"
                } text-primary`}
                style={{ fontSize: "0.9rem" }}
              ></i>
            </div>
          </div>
        )}

        <div style={{ maxWidth: "80%" }}>
          {/* Tên */}
          {!isFromUser && (
            <div className="small text-primary mb-1 fw-bold">
              {msg.user_name}
            </div>
          )}

          {/* Tin nhắn */}
          <div
            className={`d-inline-block p-3 rounded-3 mb-2 ${
              isFromUser ? "bg-primary text-white" : "bg-white border"
            }`}
            style={{
              opacity: msg.temp ? 0.6 : 1,
              wordBreak: "break-word",
              borderRadius: "18px",
              fontSize: "0.95rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {msg.message}
            {time && (
              <div
                className={`small mt-2 ${
                  isFromUser ? "text-white-50" : "text-muted"
                }`}
                style={{
                  fontSize: "0.7rem",
                  textAlign: isFromUser ? "right" : "left",
                }}
              >
                {time}
              </div>
            )}
          </div>

          {/* HIỂN THỊ SẢN PHẨM */}
          {msg.products && msg.products.length > 0 && (
            <div className="mt-2">
              {msg.products.map((product, idx) => (
                <div
                  key={idx}
                  className="border rounded p-3 mb-2 bg-white d-flex align-items-center shadow-sm hover-shadow"
                  style={{ cursor: "pointer", transition: "0.2s" }}
                  onClick={() =>
                    window.open(`/product/${product.masp}`, "_blank")
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0,0,0,0.1)")
                  }
                >
                  {product.anhdaidien ? (
                    <img
                      src={product.anhdaidien}
                      alt={product.tensp}
                      className="rounded me-3"
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-light rounded me-3 d-flex align-items-center justify-content-center"
                      style={{ width: 80, height: 80 }}
                    >
                      <i className="bi bi-laptop fs-1 text-muted"></i>
                    </div>
                  )}
                  <div className="flex-grow-1">
                    <h6 className="mb-1 text-dark">{product.tensp}</h6>
                    <p className="mb-1 text-danger fw-bold">
                      {Number(product.gia).toLocaleString("vi-VN")}đ
                      {product.giacu && (
                        <del className="text-muted ms-2 small">
                          {Number(product.giacu).toLocaleString("vi-VN")}đ
                        </del>
                      )}
                    </p>
                    <small className="text-primary">
                      <i className="bi bi-box-arrow-in-up-right"></i> Xem chi
                      tiết
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar người dùng */}
        {isFromUser && (
          <div className="d-flex flex-column align-items-center ms-2">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{ width: 32, height: 32 }}
            >
              <i className="bi bi-person-fill"></i>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* NÚT MỞ CHAT */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4 shadow-lg"
        style={{ width: 60, height: 60, fontSize: 28, zIndex: 1050 }}
      >
        <i className={isOpen ? "bi bi-x" : "bi bi-chat-dots-fill"}></i>
      </button>

      {/* CỬA SỔ CHAT */}
      {isOpen && (
        <div
          className="card position-fixed bottom-0 end-0 m-4 shadow-lg border-0"
          style={{ width: 380, height: 600, zIndex: 1050 }}
        >
          {/* HEADER */}
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3 px-4">
            <div>
              <strong>Trợ lý / Nhân viên</strong>
              <div className="small opacity-75">Chào {userName}</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-close btn-close-white"
            ></button>
          </div>

          {/* CHUYỂN CHẾ ĐỘ */}
          <div className="p-3 border-bottom bg-white">
            <div className="d-flex justify-content-center gap-2">
              <button
                className={`btn rounded-pill px-4 ${
                  mode === "bot" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setMode("bot")}
              >
                Chatbot
              </button>
              <button
                className={`btn rounded-pill px-4 ${
                  mode === "admin" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setMode("admin")}
              >
                Nhân viên
              </button>
            </div>
          </div>

          {/* NỘI DUNG CHAT */}
          <div
            className="card-body p-3 overflow-auto bg-light"
            style={{ height: 380 }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted small mt-5">
                <i className="bi bi-chat-square-text display-4 d-block mb-3 opacity-25"></i>
                {mode === "bot" ? "Hỏi trợ lý..." : "Chưa có tin nhắn"}
              </div>
            ) : (
              messages.map((msg, i) => <MessageItem key={i} msg={msg} />)
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* NHẬP TIN NHẮN */}
          <div className="card-footer bg-white p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-pill border-0 shadow-sm"
                placeholder={
                  mode === "bot" ? "Hỏi trợ lý..." : "Nhắn nhân viên..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                style={{ fontSize: "0.95rem" }}
              />
              <button
                onClick={sendMessage}
                className="btn btn-primary rounded-circle ms-2 shadow-sm"
                style={{ width: 44, height: 44 }}
                disabled={!input.trim()}
              >
                <i
                  className="bi bi-send-fill"
                  style={{ fontSize: "1.1rem" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
