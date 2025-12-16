import React, { useState, useEffect, useRef } from "react";
import { sendMessage, getMessages, getChatUsers } from "../API/Chat";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../components/css/ChatAdmin.css";

const MessageItem = ({ msg, isAdmin }) => {
  const time = msg.created_at
    ? new Date(msg.created_at).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      })
    : "";

  return (
    <div
      className={`d-flex mb-2 ${
        isAdmin ? "justify-content-end" : "justify-content-start"
      }`}
    >
      {!isAdmin && (
        <div className="d-flex flex-column align-items-center me-2">
          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center border"
            style={{ width: 32, height: 32 }}
          >
            <i
              className="bi bi-person-fill text-primary"
              style={{ fontSize: "0.9rem" }}
            ></i>
          </div>
          <small className="text-muted mt-1" style={{ fontSize: "0.65rem" }}>
            {msg.user_name || `Khách #${msg.user_id}`}
          </small>
        </div>
      )}

      <div style={{ maxWidth: "75%" }}>
        {isAdmin && (
          <small
            className="text-primary d-block mb-1"
            style={{ fontSize: "0.75rem" }}
          >
            Hỗ trợ
          </small>
        )}
        <div
          className={`d-inline-block p-2 px-3 rounded-3 ${
            isAdmin ? "bg-primary text-white" : "bg-light border"
          }`}
          style={{
            opacity: msg.temp ? 0.6 : 1,
            wordBreak: "break-word",
            borderRadius: "18px",
            fontSize: "0.95rem",
            boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
          }}
        >
          {msg.message}
          {time && (
            <div
              className={`small mt-1 ${
                isAdmin ? "text-white-50" : "text-muted"
              }`}
              style={{
                fontSize: "0.65rem",
                textAlign: isAdmin ? "right" : "left",
              }}
            >
              {time}
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
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

const ChatAdmin = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // LẤY DANH SÁCH KHÁCH
  useEffect(() => {
    getChatUsers()
      .then((res) => setUsers(res.data || []))
      .catch(console.error);
  }, []);

  // LẤY TIN NHẮN KHI CHỌN KHÁCH
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }
    setLoading(true);
    getMessages(selectedUser.id)
      .then((res) => setMessages(res.data || []))
      .finally(() => setLoading(false));
  }, [selectedUser]);

  // SCROLL TỰ ĐỘNG
  useEffect(() => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserScrolling]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setIsUserScrolling(!nearBottom);
  };

  useEffect(() => {
    if (!selectedUser || !window.Echo) return;

    const channel = window.Echo.private(`chat.user.${selectedUser.id}`).listen(
      ".NewMessage",
      (e) => {
        console.log("Admin nhận tin realtime:", e);

        const newMsg = {
          ...e,
          user_name: e.is_admin
            ? "Hỗ trợ"
            : e.user_name || `Khách #${e.user_id}`,
        };

        setMessages((prev) => {
          if (prev.some((m) => m.id === e.id)) return prev;
          return [...prev, newMsg];
        });

        // Cập nhật danh sách khách nếu là tin từ khách
        if (!e.is_admin) {
          const timeStr = new Date(e.created_at).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });
          setUsers((prev) => {
            const updated = prev.map((u) =>
              u.id === e.user_id
                ? { ...u, last_message: e.message, last_time: timeStr }
                : u
            );
            if (!prev.some((u) => u.id === e.user_id)) {
              updated.unshift({
                id: e.user_id,
                name: e.user_name || `Khách #${e.user_id}`,
                last_message: e.message,
                last_time: timeStr,
              });
            }
            return updated;
          });
        }
      }
    );

    return () => {
      channel?.stopListening(".NewMessage");
      window.Echo.leave(`chat.user.${selectedUser.id}`);
    };
  }, [selectedUser]);

  // GỬI TIN NHẮN
  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;

    const tempId = "temp_" + Date.now();
    const tempMsg = {
      id: tempId,
      user_id: selectedUser.id,
      message: input.trim(),
      temp: true,
      created_at: new Date().toISOString(),
      is_admin: true,
      user_name: "Hỗ trợ",
    };

    setMessages((prev) => [...prev, tempMsg]);
    const text = input.trim();
    setInput("");

    try {
      await sendMessage({
        message: text,
        target_user_id: selectedUser.id,
      });

      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } catch (error) {
      console.error("Gửi lỗi:", error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };
  return (
    <div
      className="container-fluid d-flex flex-column"
      style={{ height: "100vh", paddingTop: 20, overflow: "hidden" }}
    >
      <div className="row flex-grow-1" style={{ minHeight: 0 }}>
        {/* SIDEBAR */}
        <div
          className="col-3 border-end d-flex flex-column"
          style={{ minHeight: 0, overflow: "hidden" }}
        >
          <div className="p-3 border-bottom bg-white flex-shrink-0">
            <h5 className="mb-0">Khách hàng</h5>
          </div>
          <div className="flex-grow-1 overflow-auto custom-scroll">
            <ul className="list-group list-group-flush">
              {users.length === 0 ? (
                <li className="list-group-item text-muted">Không có khách</li>
              ) : (
                users.map((u) => (
                  <li
                    key={u.id}
                    className={`list-group-item list-group-item-action ${
                      selectedUser?.id === u.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedUser(u)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{u.name}</div>
                        <small
                          className="text-muted text-truncate d-block"
                          style={{ maxWidth: "180px" }}
                        >
                          {u.last_message || "Chưa có tin"}
                        </small>
                      </div>
                      <small className="text-muted">{u.last_time}</small>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* CHAT AREA */}
        <div
          className="col-9 d-flex flex-column"
          style={{ height: "100vh", overflow: "hidden" }}
        >
          {selectedUser ? (
            <>
              <div className="p-3 border-bottom bg-white d-flex align-items-center flex-shrink-0">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: 40, height: 40 }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>
                <h6 className="mb-0">{selectedUser.name}</h6>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-grow-1 p-3 chat-scroll custom-scroll"
                onScroll={handleScroll}
                style={{ overflowY: "auto", flexGrow: 1, minHeight: 0 }}
              >
                {loading ? (
                  <div className="text-center text-muted">Đang tải...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted mt-5">
                    Chưa có tin nhắn
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageItem
                      key={msg.id}
                      msg={msg}
                      isAdmin={msg.is_admin}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-top bg-white flex-shrink-0">
                <div className="input-group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSend()
                    }
                    className="form-control rounded-pill border-0 shadow-sm"
                    placeholder="Nhập tin nhắn..."
                  />
                  <button
                    onClick={handleSend}
                    className="btn btn-primary rounded-circle ms-2 shadow-sm"
                    style={{ width: 44, height: 44 }}
                    disabled={!input.trim()}
                  >
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              <p>Chọn khách hàng để chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;
