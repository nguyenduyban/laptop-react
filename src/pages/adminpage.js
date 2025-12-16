import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../components/css/dashboard.css";
import { getAdminStats, getAdminStatsByMonth } from "../API/Stats";

import AdminProducts from "./adminproduct";
import ChuyenMucManager from "./admintopic";
import AdminDanhMuc from "./admincategories";
import AdminHang from "./adminhang";
import AdminDonHang from "./admindonhang";
import ChatAdmin from "./adminchat";
import AdminKho from "./adminkho";
import AdminAccount from "./adminAccount";
import AdminComment from "./admincomments";
import AdminCarousel from "./admincarousel";
import AdminNhaCungCap from "./adminnhacungcap";

const Adminpage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // CHART refs
  const barChartRef = useRef(null);
  const bestChartRef = useRef(null);

  const barChartInstance = useRef(null);
  const bestChartInstance = useRef(null);

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
  });

  const [revenueChart, setRevenueChart] = useState({
    labels: [],
    data: [],
  });

  const [bestProducts, setBestProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();

        setStats({
          revenue: res.doanh_thu || 0,
          products: res.san_pham_ban_chay?.length || 0,
          orders: res.tong_don_hang || 0,
          users: res.nguoi_dung_moi || 0,
        });

        setBestProducts(res.san_pham_ban_chay || []);
      } catch (err) {
        console.error("Lỗi load stats", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab !== "dashboard") return;

    const fetchRevenue = async () => {
      try {
        const data = await getAdminStatsByMonth();

        setRevenueChart({
          labels: data.map((i) => `Th ${i.month}`),
          data: data.map((i) => i.total),
        });
      } catch (err) {
        console.error("Lỗi load doanh thu tháng:", err);
      }
    };

    fetchRevenue();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "dashboard") return;

    const ctxBar = barChartRef.current?.getContext("2d");
    const ctxBest = bestChartRef.current?.getContext("2d");

    if (!ctxBar || !ctxBest) return;

    barChartInstance.current?.destroy();
    bestChartInstance.current?.destroy();

    const gradientBar = ctxBar.createLinearGradient(0, 0, 0, 300);
    gradientBar.addColorStop(0, "rgba(0, 123, 255, 0.9)");
    gradientBar.addColorStop(1, "rgba(0, 123, 255, 0.3)");

    barChartInstance.current = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: revenueChart.labels,
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: revenueChart.data,
            backgroundColor: gradientBar,
            borderColor: "rgba(0, 123, 255, 1)",
            borderWidth: 1,
            borderRadius: 12,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
            padding: 10,
            callbacks: {
              label: (context) =>
                Number(context.raw).toLocaleString("vi-VN", {
                  maximumFractionDigits: 0,
                }) + " đ",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { font: { size: 12 } },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 } },
          },
        },
      },
    });

    bestChartInstance.current = new Chart(ctxBest, {
      type: "bar",
      data: {
        labels: bestProducts.map((p) => p.sanpham?.tensp || "Không có"),
        datasets: [
          {
            label: "Đã bán",
            data: bestProducts.map((p) => p.tong_ban),
            backgroundColor: "rgba(255, 159, 64, 0.8)",
            borderColor: "rgb(255, 159, 64)",
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true },
        },
      },
    });

    return () => {
      barChartInstance.current?.destroy();
      bestChartInstance.current?.destroy();
    };
  }, [activeTab, revenueChart, bestProducts]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-primary mb-0">
                <i className="fa-solid fa-chart-line me-2"></i>
                Dashboard Tổng Quan
              </h4>
              <span className="text-muted small">
                Cập nhật: {new Date().toLocaleString("vi-VN")}
              </span>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-5">
              {[
                {
                  icon: "fa-sack-dollar",
                  label: "Doanh thu",
                  value: Number(stats.revenue).toLocaleString("vi-VN"),
                  color: "success",
                },
                {
                  icon: "fa-shopping-cart",
                  label: "Đơn hàng",
                  value: stats.orders,
                  color: "warning",
                },
                {
                  icon: "fa-users",
                  label: "Khách hàng",
                  value: stats.users,
                  color: "info",
                },
              ].map((item, i) => (
                <div className="col-lg-3 col-md-6 " key={i}>
                  <div
                    className={`card border-0 shadow-sm h-100 bg-gradient text-white bg-${item.color}`}
                  >
                    <div className="card-body d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{item.value}</h5>
                        <p className="mb-0 small opacity-75">{item.label}</p>
                      </div>
                      <i
                        className={`fa-solid ${item.icon} fa-2x opacity-50`}
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="row g-4">
              {/* DOANH THU */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fa-solid fa-chart-column me-2"></i>
                      Doanh thu theo tháng
                    </h6>
                    <div style={{ height: "300px" }}>
                      <canvas ref={barChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>

              {/* SẢN PHẨM BÁN CHẠY */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fa-solid fa-fire me-2"></i>
                      Top sản phẩm bán chạy
                    </h6>
                    <div style={{ height: "300px" }}>
                      <canvas ref={bestChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "taikhoan":
        return <AdminAccount />;
      case "binhluan":
        return <AdminComment />;
      case "hang":
        return <AdminHang />;
      case "chuyenmuc":
        return <ChuyenMucManager />;
      case "danhmuc":
        return <AdminDanhMuc />;
      case "sanpham":
        return <AdminProducts />;
      case "donhang":
        return <AdminDonHang />;
      case "chat":
        return <ChatAdmin />;
      case "kho":
        return <AdminKho />;
      case "carousel":
        return <AdminCarousel />;
      case "nhacungcap":
        return <AdminNhaCungCap />;

      default:
        return <p className="text-muted">Chọn chức năng ở thanh bên trái.</p>;
    }
  };

  // ===============================
  // GIAO DIỆN TỔNG
  // ===============================
  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className={`d-flex flex-column p-3 shadow-lg bg-white border-end position-sticky top-0 transition-all ${
          sidebarOpen ? "w-270" : "w-70"
        }`}
        style={{
          minHeight: "100vh",
          zIndex: 10,
          transition: "width 0.3s ease",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4
            className={`fw-bold text-primary mb-0 ${!sidebarOpen && "d-none"}`}
          >
            <i className="fa-solid fa-gear me-2"></i> Admin
          </h4>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i
              className={`fa-solid ${
                sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"
              }`}
            ></i>
          </button>
        </div>

        {/* SIDEBAR MENU */}
        <nav className="nav flex-column flex-grow-1">
          {[
            { id: "dashboard", icon: "fa-house", label: "Dashboard" },
            { id: "taikhoan", icon: "fa-user", label: "Quản lý Tài khoản" },
            { id: "binhluan", icon: "fa-comments", label: "Quản lý bình luận" },
            { id: "hang", icon: "fa-building", label: "Quản lý Hãng" },
            { id: "chuyenmuc", icon: "fa-icons", label: "Quản lý Chuyên mục" },
            { id: "danhmuc", icon: "fa-folder", label: "Quản lý Danh mục" },
            { id: "sanpham", icon: "fa-box", label: "Quản lý Sản phẩm" },
            {
              id: "donhang",
              icon: "fa-cart-shopping",
              label: "Quản lý Đơn hàng",
            },
            { id: "chat", icon: "fa-message", label: "Quản lý chat" },
            { id: "kho", icon: "fa-warehouse", label: "Quản lý kho" },
            { id: "carousel", icon: "fa-image", label: "Quản lý Banner" },
            {
              id: "nhacungcap",
              icon: "fa-image",
              label: "Quản lý Nhà Cung Cấp",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nav-item btn text-start mb-2 py-2 px-3 rounded-3 fw-semibold w-100 d-flex align-items-center ${
                activeTab === tab.id
                  ? "btn-primary text-white shadow-sm"
                  : "btn-outline-primary bg-white text-primary border-0"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i
                className={`fa-solid ${tab.icon} me-2 ${
                  !sidebarOpen && "me-0"
                }`}
              ></i>
              <span className={sidebarOpen ? "" : "d-none"}>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-3 text-center text-muted small">
          <i className="fa-solid fa-circle-info me-1"></i>
          <span className={sidebarOpen ? "" : "d-none"}>v1.0.0</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="flex-grow-1 p-4 position-relative overflow-auto"
        style={{
          background: "linear-gradient(135deg, #f5f7ff 0%, #e3eeff 100%)",
          transition: "all 0.4s ease-in-out",
        }}
      >
        <div className="fade-in">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Adminpage;
