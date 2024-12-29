import Link from 'next/link'
import React from 'react'
import style from "../footer/style.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="home1-footer-top-area">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="footer-top-banner">
                <div className="banner-content">
                  <span>Hướng dẫn</span>
                  <h2>
                    <Link href="/how-to-buy">Làm cách nào để đấu giá</Link>
                  </h2>
                </div>
                <Link href="/how-to-buy" className="arrow">
                  <svg
                    width={100}
                    height={100}
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path d="M0.495049 0H99.9999V18.6274L18.8119 99.9997L0 81.3723L55.4455 26.4705L0.495049 26.9607V0Z" />
                      <path d="M100 100.001V37.2559L73.2673 63.7264V100.001H100Z" />
                    </g>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="footer-top-banner two">
                <div className="banner-content">
                  <span>Hướng dẫn</span>
                  <h2>
                    <Link href="/how-to-buy">Nạp tiền vào tài khoản</Link>
                  </h2>
                </div>
                <Link href="/how-to-sell" className="arrow">
                  <svg
                    width={100}
                    height={100}
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path d="M0.495049 0H99.9999V18.6274L18.8119 99.9997L0 81.3723L55.4455 26.4705L0.495049 26.9607V0Z" />
                      <path d="M100 100.001V37.2559L73.2673 63.7264V100.001H100Z" />
                    </g>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-wrapper">
          <div className="container">
            <div className="footer-menu-wrap">
              <div className="row g-lg-4 gy-5">
                {/* Loại sản phẩm */}
                <div className="col-lg-4 col-sm-4">
                  <div className="footer-widget">
                    <div className="widget-title">
                      <h4>Loại sản phẩm</h4>
                    </div>
                    <div className="menu-container">
                      <ul className="widget-list">
                        <li>
                          <Link href="/">Điện tử</Link>
                        </li>
                        <li>
                          <Link href="/">Thời trang</Link>
                        </li>
                        <li>
                          <Link href="/">Nội thất</Link>
                        </li>
                        <li>
                          <Link href="//">Sách</Link>
                        </li>
                        <li>
                          <Link href="/">Trang sức</Link>
                        </li>
                        {/* <li>
                          <Link href="/auction-grid">Thiết bị gia dụng</Link>
                        </li>
                        <li>
                          <Link href="/auction-grid">Đồng hồ</Link>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Logo */}
                <div className="col-lg-4 col-sm-4 d-flex align-items-center justify-content-lg-center justify-content-start">
                  <div className="footer-logo-area">
                    <div className="footer-logo">
                      <img src="/assets/img/logo.png" alt="Footer Logo" />
                    </div>
                    <div className="social-area">
                      <h5>Hãy kết nối với chúng tôi!</h5>
                      <ul className="social-list">
                        <li>
                          <a href="/">
                            <i className="bi bi-linkedin" />
                            LinkedIn
                          </a>
                        </li>
                        <li>
                          <a href="/">
                            <i className="bi bi-facebook" />
                            Facebook
                          </a>
                        </li>
                        <li>
                          <a href="/">
                            <i className="bi bi-instagram" />
                            Instagram
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tìm hiểu thêm */}
                <div className="col-lg-4 col-sm-4" style={{ margin: 0 }}>
                  <div className="footer-widget">
                    <div className="widget-title">
                      <h4>Tìm hiểu thêm</h4>
                    </div>
                    <div className="menu-container">
                      <ul className="widget-list">
                        <li>
                          <Link href="https://tiendatnguyen.gitbook.io/tiendatnguyen-docs">
                            Chính sách bảo mật
                          </Link>
                        </li>
                        <li>
                          <Link href="https://tiendatnguyen.gitbook.io/tiendatnguyen-docs/readme-1">
                            Hướng dẫn đấu giá
                          </Link>
                        </li>
                        <li>
                          <Link href="https://tiendatnguyen.gitbook.io/tiendatnguyen-docs/readme-2">
                            Quy định đấu giá
                          </Link>
                        </li>
                        <li>
                          <Link href="https://tiendatnguyen.gitbook.io/tiendatnguyen-docs/readme-3">
                            Quy chế hoạt động
                          </Link>
                        </li>
                        <li>
                          <Link href="https://tiendatnguyen.gitbook.io/tiendatnguyen-docs/readme-4">
                            Về chúng tôi
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer
