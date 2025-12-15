import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Aboutpage = () => {
  return (
    <div className="bg-white py-5">
      <div className="container">
        {/* SECTION INTRO */}
        <div className="row align-items-center p-4 rounded-4 shadow-sm bg-light">
          {/* Left Content */}
          <div className="col-lg-6">
            <h1 className="fw-bold mb-3" style={{ fontSize: "42px" }}>
              Giới thiệu về <span className="text-primary">BTLaptop</span>
            </h1>

            <div
              style={{
                width: "60px",
                height: "6px",
                background: "#0d6efd",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            ></div>

            <p className="text-secondary fs-5">
              BTLaptop ra đời từ giấc mơ mang công nghệ chất lượng cao đến mọi
              người dùng Việt Nam. Chúng tôi xây dựng hệ sinh thái mua sắm
              laptop uy tín, minh bạch và tận tâm.
            </p>

            <p className="text-secondary fs-5">
              Đội ngũ của chúng tôi không chỉ là nhân viên kinh doanh — chúng
              tôi là những người yêu công nghệ với mong muốn mang lại trải
              nghiệm tuyệt vời nhất cho khách hàng.
            </p>

            <p className="text-secondary fs-5 mb-0">
              Sự hài lòng của khách hàng chính là động lực giúp BTLaptop
              không ngừng phát triển và tạo giá trị tích cực cho cộng đồng.
            </p>
          </div>

                      <div className="col-lg-6 text-center position-relative">
              {/* Decorative Frame */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "360px",
                  height: "420px",
                  border: "4px solid #0d6efd",
                  borderRadius: "25px",
                  transform: "translate(-50%, -50%) rotate(8deg)",
                  zIndex: 1,
                  opacity: 0.9,
                }}
              ></div>

              {/* Main Image */}
              <img
                src="https://be-laravel.onrender.com/storage/img/gus.jpg"
                alt="Founder"
                className="img-fluid shadow-lg"
                style={{
                  zIndex: 2,
                  position: "relative",
                  borderRadius: "25px",
                  maxHeight: "420px",
                  objectFit: "cover",
                }}
              />
            </div>
        </div>

        {/* QUOTE SECTION */}
        <div className="mt-5 p-4 position-relative">
          <div
            className="rounded-4 p-4 text-white"
            style={{ background: "#0d6efd" }}
          >
            <h4 className="fw-bold">
              “Khách hàng hôm nay là đồng đội tương lai! Chúng ta cùng nhau lan
              tỏa giá trị tích cực đến cộng đồng yêu công nghệ tại Việt Nam.”
            </h4>
          </div>

          {/* Quote Icon */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "20px",
              fontSize: "60px",
              color: "#0d6efd",
              fontWeight: "bold",
            }}
          >
            ❝
          </div>
        </div>

        {/* GOOGLE MAP */}
        <div className="mt-5">
          <h3 className="fw-bold text-primary mb-3 text-center">
            📍 Địa chỉ showroom
          </h3>
          <iframe
            className="w-100 rounded-4 shadow-sm"
            height="350"
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4783056514787!2d106.70042377480592!3d10.77688985918009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f0f188699%3A0xeef3f65c1dcaf54a!2zQ2FvIFRoxrDGoW5nIER14bqtbiBN4buZ!5e0!3m2!1svi!2s!4v1704279670000!5m2!1svi!2s"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Aboutpage;
