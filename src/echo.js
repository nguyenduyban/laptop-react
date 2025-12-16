import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "8a581a4c583a54f88099",
  cluster: "ap1",
  forceTLS: true,
  authEndpoint: "https://be-laravel.onrender.com/api/broadcasting/auth",

  // CHỈ GỬI TOKEN KHI CÓ → KHÁCH VÃNG LAI KHÔNG BỊ 403
  auth: {
    headers: {
      Accept: "application/json",
      ...(localStorage.getItem("token") && {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
    },
  },
});

window.Echo.connector.pusher.connection.bind("connected", () => {
  console.log("Realtime connected!");
});
window.Echo.connector.pusher.connection.bind("disconnected", () => {
  console.warn("Realtime disconnected – đang kết nối lại...");
});
window.Echo.connector.pusher.connection.bind("error", (err) => {
  console.error("Pusher lỗi:", err);
});

console.log("Echo đã khởi tạo thành công");
export default window.Echo;
