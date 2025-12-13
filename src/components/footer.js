import React from "react";

const Footer = () => {
    return (
        <>
        <footer class="bg-dark text-light pt-5 pb-4 mt-5">
  <div class="container text-center text-md-start">
    <div class="row gy-4">
      <div class="col-md-4">
        <h5 class="text-uppercase fw-bold mb-3">Laptop BT</h5>
        <p class="small text-white-50">
          Chuyên cung cấp các sản phẩm laptop chính hãng, đảm bảo chất lượng và giá cả cạnh tranh.
        </p>
      </div>

      <div class="col-md-4">
        <h6 class="text-uppercase fw-bold mb-3">Liên hệ</h6>
        <ul class="list-unstyled small text-white-50">
          <li><i class="bi bi-geo-alt-fill me-2 text-danger"></i>180 Cao Lỗ, Phường Chánh Hưng, TP.HCM</li>
          <li><i class="bi bi-envelope-fill me-2 text-danger"></i> LaptopBT@gmail.com</li>
          <li><i class="bi bi-telephone-fill me-2 text-danger"></i> +084 0999 99</li>
        </ul>
      </div>

      <div class="col-md-4">
        <h6 class="text-uppercase fw-bold mb-3">Kết nối mạng xã hội</h6>
        <div class="d-flex justify-content-md-start justify-content-center gap-3">
          <a href="#" class="btn btn-outline-light btn-sm rounded-circle">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="#" class="btn btn-outline-light btn-sm rounded-circle">
            <i class="bi bi-youtube"></i>
          </a>
          <a href="#" class="btn btn-outline-light btn-sm rounded-circle">
            <i class="bi bi-instagram"></i>
          </a>
        </div>
      </div>
    </div>

    <hr class="border-secondary mt-4" />

    <div class="text-center small text-white-50 mt-3">
      © 2025 <span class="fw-bold text-light">Laptop BT</span>. All Rights Reserved.
    </div>
  </div>
</footer>

<link
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
  rel="stylesheet"
/>

        </>
    )
}
export default Footer;