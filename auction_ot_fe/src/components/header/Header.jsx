//ĐÂY LÀ MÀN SAU KHI LOGIN ROLE CUSTOMER
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";
import { RootState } from "../../store/RootReducer";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import IconContainer from "../icon/iconContainer.js";

const initialState = {
  activeMenu: "",
  activeSubMenu: "",
  isSidebarOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_MENU":
      return {
        ...state,

        activeMenu: state.activeMenu === action.menu ? "" : action.menu,
        activeSubMenu:
          state.activeMenu === action.menu ? state.activeSubMenu : "",
      };
    case "TOGGLE_SUB_MENU":
      return {
        ...state,
        activeSubMenu:
          state.activeSubMenu === action.subMenu ? "" : action.subMenu,
      };
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    case "setScrollY":
      return { ...state, scrollY: action.payload };
    default:
      return state;
  }
}

const Header = () => {
  const router = useRouter();
  const myInfo = useSelector((states) => states.auth);
  console.log("myInfo___: ", myInfo);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const pathName = usePathname();
  const collapseMenu = (menu) => {
    dispatch({ type: "TOGGLE_MENU", menu });
  };
  const toggleSubMenu = (subMenu) => {
    dispatch({ type: "TOGGLE_SUB_MENU", subMenu });
  };
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const handleLanguageClick = (index) => {
    setMenuOpen(false); // Close the menu when an item is clicked
  };
  const handleNav = () => {
    router.push("/auction-details");
  };

  useEffect(() => {
    console.log("VAO EFFECT");
  }, []);

  return (
    <div className="header-topbar-area">
      <header className="header-area style-1 d-flex flex-nowrap align-items-center justify-content-between">
        <div className="nav-left">
          <div className="company-logo">
            <Link href="/">
              <img
                alt="image"
                className="img-fluid"
                src="/assets/img/logo.svg"
              />
            </Link>
          </div>
          <div className={`main-menu ${isMenuOpen ? "show-menu" : ""}`}>
            <div className="mobile-logo-area d-lg-none d-flex justify-content-center">
              <div className="mobile-logo-wrap">
                <Link href="/">
                  <img alt="image" src="/assets/img/logo.svg" />
                </Link>
              </div>
            </div>
            <ul className="menu-list">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li
                className={`menu-item-has-children ${
                  pathName === "/auction-grid" &&
                  "/auction-sidebar" &&
                  "/auction-details" &&
                  "/auction-details2"
                    ? "active"
                    : ""
                }`}
              >
                <Link href="/auction-grid" className="drop-down">
                  Đấu giá
                </Link>
                <i
                  className={`dropdown-icon ${
                    state.activeMenu === "auction" ? "bi bi-dash" : "bi bi-plus"
                  }`}
                  onClick={() => collapseMenu("auction")}
                />
                <ul
                  className={`sub-menu ${
                    state.activeMenu === "auction" ? "d-block" : ""
                  }`}
                >
                  <li className={pathName === "/auction-grid" ? "active" : ""}>
                    <Link href="/auction-grid">Phiên đấu giá đang diễn ra</Link>
                  </li>
                  <li
                    className={pathName === "/auction-sidebar" ? "active" : ""}
                  >
                    <Link href="/auction-sidebar">
                      Phiên đấu giá sắp diễn ra
                    </Link>
                  </li>
                  <li
                    className={pathName === "/auction-sidebar" ? "active" : ""}
                  >
                    <Link href="/auction-sidebar">
                      Phiên đấu giá đã kết thúc
                    </Link>
                  </li>
                  <li className={pathName === "/seller" ? "active" : ""}>
                    <Link href="store-list">Phiên đấu giá của tôi</Link>
                    <i
                      className="d-lg-flex d-none bi bi-chevron-right dropdown-icon"
                      onClick={() => toggleSubMenu("seller")}
                    />
                    <i
                      className={`d-lg-none d-flex bi bi-${
                        state.activeSubMenu === "seller" ? "dash" : "plus"
                      } dropdown-icon`}
                      onClick={() => toggleSubMenu("seller")}
                    />
                    <ul
                      className={`sub-menu ${
                        state.activeSubMenu === "seller" ? "d-block" : ""
                      }`}
                    >
                      <li
                        className={pathName === "/store-list" ? "active" : ""}
                      >
                        <Link href="store-list">Danh sách phiên đấu giá</Link>
                      </li>
                      <li
                        className={
                          pathName === "/store-details" ? "active" : ""
                        }
                      >
                        <Link href="store-details">
                          Phiên đấu giá chiến thắng
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li
                className={`menu-item-has-children ${
                  pathName === "/blog-grid" &&
                  "/blog-standard" &&
                  "/blog-details"
                    ? "active"
                    : ""
                }`}
              >
                <Link href="/blog-grid" className="drop-down">
                  Bài đăng
                </Link>
                <i
                  className={`dropdown-icon ${
                    state.activeMenu === "blog" ? "bi bi-dash" : "bi bi-plus"
                  }`}
                  onClick={() => collapseMenu("blog")}
                />
                <ul
                  className={`sub-menu ${
                    state.activeMenu === "blog" ? "d-block" : ""
                  }`}
                >
                  <li className={pathName === "/blog-grid" ? "active" : ""}>
                    <Link href="/blog-grid">Trang chủ</Link>
                  </li>
                  <li className={pathName === "/blog-standard" ? "active" : ""}>
                    <Link href="/blog-standard">Bài đăng của tôi</Link>
                  </li>
                </ul>
              </li>

              <li className={pathName === "/contact" ? "active" : ""}>
                <Link href="/contact">Tìm hiểu thêm</Link>
              </li>
            </ul>
            <div className="btn-area d-lg-none d-flex">
              <a href="#" className="login-btn btn-hover">
                <svg
                  width={15}
                  height={19}
                  viewBox="0 0 15 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.8751 4.17663C11.875 5.00255 11.6183 5.8099 11.1375 6.49658C10.6567 7.18326 9.97335 7.71843 9.17389 8.03442C8.37443 8.35041 7.49475 8.43303 6.6461 8.27184C5.79744 8.11064 5.01792 7.71286 4.40611 7.12881C3.79429 6.54475 3.37766 5.80064 3.20889 4.99058C3.04012 4.18052 3.1268 3.34088 3.45796 2.57783C3.78912 1.81479 4.34989 1.16261 5.06937 0.703757C5.78884 0.244909 6.6347 7.28125e-09 7.5 0C8.07459 3.64089e-05 8.64354 0.108097 9.17438 0.318012C9.70521 0.527927 10.1875 0.835585 10.5938 1.22342C11.0001 1.61126 11.3223 2.07167 11.5422 2.57839C11.762 3.0851 11.8752 3.62818 11.8751 4.17663ZM7.5 9.58844C6.26105 9.58705 5.0354 9.83216 3.90124 10.3082C2.76708 10.7842 1.74932 11.4806 0.912902 12.353C-0.563582 13.8885 -0.20194 16.3311 1.6571 17.4243C3.41487 18.4546 5.43728 19 7.5 19C9.56272 19 11.5851 18.4546 13.3429 17.4243C15.2019 16.3311 15.5636 13.8885 14.0871 12.353C13.2507 11.4806 12.2329 10.7842 11.0988 10.3082C9.9646 9.83216 8.73895 9.58705 7.5 9.58844Z" />
                </svg>
                Customer
                <span style={{ top: "40.5px", left: "84.2344px" }} />
              </a>
            </div>
          </div>
        </div>
        <div className="nav-right d-flex jsutify-content-end align-items-center">
          <IconContainer />

          <a href="#" className="login-btn btn-hover d-lg-flex d-none">
            <svg
              width={15}
              height={19}
              viewBox="0 0 15 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.8751 4.17663C11.875 5.00255 11.6183 5.8099 11.1375 6.49658C10.6567 7.18326 9.97335 7.71843 9.17389 8.03442C8.37443 8.35041 7.49475 8.43303 6.6461 8.27184C5.79744 8.11064 5.01792 7.71286 4.40611 7.12881C3.79429 6.54475 3.37766 5.80064 3.20889 4.99058C3.04012 4.18052 3.1268 3.34088 3.45796 2.57783C3.78912 1.81479 4.34989 1.16261 5.06937 0.703757C5.78884 0.244909 6.6347 7.28125e-09 7.5 0C8.07459 3.64089e-05 8.64354 0.108097 9.17438 0.318012C9.70521 0.527927 10.1875 0.835585 10.5938 1.22342C11.0001 1.61126 11.3223 2.07167 11.5422 2.57839C11.762 3.0851 11.8752 3.62818 11.8751 4.17663ZM7.5 9.58844C6.26105 9.58705 5.0354 9.83216 3.90124 10.3082C2.76708 10.7842 1.74932 11.4806 0.912902 12.353C-0.563582 13.8885 -0.20194 16.3311 1.6571 17.4243C3.41487 18.4546 5.43728 19 7.5 19C9.56272 19 11.5851 18.4546 13.3429 17.4243C15.2019 16.3311 15.5636 13.8885 14.0871 12.353C13.2507 11.4806 12.2329 10.7842 11.0988 10.3082C9.9646 9.83216 8.73895 9.58705 7.5 9.58844Z" />
            </svg>
            Customer
            <span style={{ top: "40.5px", left: "84.2344px" }} />
          </a>
          <div
            className={`sidebar-button mobile-menu-btn ${
              isMenuOpen ? "active" : ""
            } `}
            onClick={toggleMenu}
          >
            <span />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
