import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "8a581a4c583a54f88099", // từ .env
  cluster: "ap1",
  forceTLS: true,

  // // 👇 Thêm các dòng này nếu dùng private/presence channel
  // authEndpoint: "http://localhost:8000/broadcasting/auth",
  // auth: {
  //   headers: {
  //     // Nếu bạn dùng Sanctum
  //     "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
  //       ?.content,
  //     "X-Requested-With": "XMLHttpRequest",

  //     // Nếu bạn dùng JWT (API token)
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   },
  // },
});

export default echo;
