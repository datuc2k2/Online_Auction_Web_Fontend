//ĐÂY LÀ MÀN SAU KHI LOGIN ROLE GUEST
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";
import { RootState } from "../../store/RootReducer";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchMyInfo, logout } from "@/store/auth/Actions";
import { openNotification } from "@/utility/Utility";
import IconContainer from "../icon/iconContainer";
import { LogoutOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faSignOutAlt,
  faUser,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import { Status } from "@/store/constants";
import SearchComponent from "@/components/SearchComponent";
const initialState = {
  activeMenu: "",
  activeSubMenu: "",
  isSidebarOpen: false,
};

function reducer(state: any, action: any) {
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

const Header1 = () => {
  const dispatchTsx = useDispatch<any>();
  const router = useRouter();
  const myInfo = useSelector((states: RootState) => states.auth.myInfo);
  const pathname = usePathname();

  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";")?.shift(); // Using optional chaining
    return undefined; // Explicitly return undefined if the cookie is not found
  };
  useEffect(() => {
    // Get the access token from cookies
    const access_token = getCookie("accessTokenAuction");

    if (myInfo == undefined && access_token) {
      console.log("vaoaoaoaooaoao");

      dispatch(fetchMyInfo());
    }
  }, [myInfo, pathname]);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const pathName = usePathname();
  const collapseMenu = (menu: any) => {
    dispatch({ type: "TOGGLE_MENU", menu });
  };
  const toggleSubMenu = (subMenu: any) => {
    dispatch({ type: "TOGGLE_SUB_MENU", subMenu });
  };
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const handleLanguageClick = (index: any) => {
    setMenuOpen(false); // Close the menu when an item is clicked
  };
  const handleNav = () => {
    router.push("/auction-details");
  };

  useEffect(() => {}, []);

  const handleLogout = () => {
    dispatchTsx(logout(() => router.push("/")));
    openNotification("success", "Thành công", "Đăng xuất thành công");
  };

  const avatarSrc = myInfo?.userProfile?.avatar
    ? `${myInfo.userProfile.avatar + process.env.NEXT_PUBLIC_IMAGE_POSTFIX}`
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  return (
    <div>
      <div
        style={{ height: "1px", width: "100%", backgroundColor: "black" }}
      ></div>
      <div className="header-topbar-area">
        {show && (
          <header className="header-area style-1 d-flex flex-nowrap align-items-center justify-content-between">
            <>
              <div className="nav-left">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="company-logo" style={{ flexGrow: 1 }}>
                    <Link href="/">
                      <img
                        alt="image"
                        className="img-fluid"
                        src="/assets/img/logo.png"
                        style={{ height: "121px", width: "121px" }}
                      />
                    </Link>
                  </div>
                </div>

                <div className={`main-menu ${isMenuOpen ? "show-menu" : ""}`}>
                  <div className="mobile-logo-area d-lg-none d-flex justify-content-center">
                    <div className="mobile-logo-wrap">
                      <Link href="/">
                        <img
                          alt="image"
                          src="/assets/img/logo.png"
                          style={{ height: "121px", width: "121px" }}
                        />
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
                      <Link href="/" className="drop-down">
                        Đấu giá
                      </Link>
                      <i
                        className={`dropdown-icon ${
                          state.activeMenu === "auction"
                            ? "bi bi-dash"
                            : "bi bi-plus"
                        }`}
                        onClick={() => collapseMenu("auction")}
                      />
                      <ul
                        className={`sub-menu ${
                          state.activeMenu === "auction" ? "d-block" : ""
                        }`}
                      >
                        <li
                          className={
                            pathName === "/auction-grid" ? "active" : ""
                          }
                        >
                          <Link href={`/auction-grid?status=${Status.OnGoing}`}>
                            Phiên đấu giá đang diễn ra
                          </Link>
                        </li>
                        <li
                          className={
                            pathName === "/auction-sidebar" ? "active" : ""
                          }
                        >
                          <Link href={`/auction-grid?status=${Status.Going}`}>
                            Phiên đấu giá sắp diễn ra
                          </Link>
                        </li>
                        <li
                          className={
                            pathName === "/auction-sidebar" ? "active" : ""
                          }
                        >
                          <Link href={`/auction-grid?status=${Status.Ended}`}>
                            Phiên đấu giá đã kết thúc
                          </Link>
                        </li>
                        {myInfo?.userRoleName === "Customer" && (
                          <>
                            <li
                              className={
                                pathName === "/auction-grid" ? "active" : ""
                              }
                            >
                              <Link href="/request-auction">
                                Tạo yêu cầu phiên đấu giá
                              </Link>
                            </li>
                            <li
                              className={
                                pathName === "/auction-grid" ? "active" : ""
                              }
                            >
                              <Link href="/auction-result-list">
                                Danh sách kết quả phiên đấu giá cần xác nhận
                              </Link>
                            </li>
                          </>
                        )}
                        {(myInfo?.userRoleName === "Admin" ||
                          myInfo?.userRoleName === "Employee") && (
                          <>
                            <li
                              className={
                                pathName === "/auction-grid" ? "active" : ""
                              }
                            >
                              <Link href="/auction-request-list">
                                Phê duyệt phiên đấu giá
                              </Link>
                            </li>
                          </>
                        )}
                      </ul>
                    </li>
                    {(myInfo?.userRoleName === "Admin" ||
                      myInfo?.userRoleName === "Employee") && (
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
                        <Link href="#" className="drop-down">
                          Quản lý
                        </Link>
                        <i
                          className={`dropdown-icon ${
                            state.activeMenu === "auction"
                              ? "bi bi-dash"
                              : "bi bi-plus"
                          }`}
                          onClick={() => collapseMenu("auction")}
                        />
                        <ul
                          className={`sub-menu ${
                            state.activeMenu === "auction" ? "d-block" : ""
                          }`}
                        >
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="/list-auction-manager">
                              Danh sách phiên đấu giá
                            </Link>
                          </li>
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="/auction-dispute-list">
                              Danh sách phiên đấu giá cần xác nhận
                            </Link>
                          </li>

                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="/account-list">
                              Danh sách tài khoản
                            </Link>
                          </li>
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="/payment-list">
                              Danh sách giao dịch
                            </Link>
                          </li>
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="/create-new-notification">
                              Tạo thông báo
                            </Link>
                          </li>
                        </ul>
                      </li>
                    )}
                    {/* {(myInfo?.userRoleName === "Admin" ||
                      myInfo?.userRoleName === "Employee") && (
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
                        <Link href="#" className="drop-down">
                          Bài đăng
                        </Link>
                        <i
                          className={`dropdown-icon ${
                            state.activeMenu === "auction"
                              ? "bi bi-dash"
                              : "bi bi-plus"
                          }`}
                          onClick={() => collapseMenu("auction")}
                        />
                        <ul
                          className={`sub-menu ${
                            state.activeMenu === "auction" ? "d-block" : ""
                          }`}
                        >
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="#">Tạo bài đăng</Link>
                          </li>
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="#">Danh sách bài đăng</Link>
                          </li>
                        </ul>
                      </li>
                    )} */}

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
                      <Link href="/post-list" className="drop-down">
                        Bài đăng
                      </Link>
                      <i
                        className={`dropdown-icon ${
                          state.activeMenu === "auction"
                            ? "bi bi-dash"
                            : "bi bi-plus"
                        }`}
                        onClick={() => collapseMenu("auction")}
                      />
                      {(myInfo?.userRoleName === "Admin" ||
                        myInfo?.userRoleName === "Employee") && (
                        <ul
                          className={`sub-menu ${
                            state.activeMenu === "auction" ? "d-block" : ""
                          }`}
                        >
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="/post-list">Trang chủ bài đăng</Link>
                          </li>
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="/post-approve">Phê duyệt bài đăng</Link>
                          </li>
                        </ul>
                      )}
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
                      <Link href="https://tiendatnguyen.gitbook.io/tiendatnguyen-docs">
                        Tìm hiểu thêm{" "}
                      </Link>
                    </li>
                  </ul>
                  {!myInfo && (
                    <>
                      <div className="btn-area d-lg-none d-flex">
                        <a href="/login" className="login-btn btn-hover">
                          Đăng nhập
                          <span style={{ top: "40.5px", left: "84.2344px" }} />
                        </a>
                      </div>
                      <div
                        style={{ marginTop: "10px" }}
                        className="btn-area d-lg-none d-flex"
                      >
                        <a href="/register" className="login-btn btn-hover">
                          Đăng kí
                          <span style={{ top: "40.5px", left: "84.2344px" }} />
                        </a>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ flexShrink: 1 }}>
                  <SearchComponent />
                </div>
              </div>
              <div
                style={{ display: "flex" }}
                className={`main-menu ${isMenuOpen ? "show-menu" : ""}`}
              >
                <style>{`
                .menu-item-has-children::after {
                  content: none;
                  display: none;
                }
              `}</style>

                {myInfo && (
                  <>
                    <div
                      style={{ marginRight: 20 }}
                      className="nav-right d-flex jsutify-content-end align-items-center"
                    >
                      <IconContainer />
                    </div>
                    <ul className="menu-list">
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
                        <div
                          onClick={() => router.push("/account-details")}
                          style={{
                            display: "flex",
                            gap: "15px",
                            color: "#FFF",
                            fontSize: 22,
                            fontWeight: 600,
                            userSelect: "none",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            onClick={() => router.push("/account-details")}
                            style={{
                              display: "flex",
                              gap: "15px",
                              color: "#FFF",
                              fontSize: 22,
                              fontWeight: 600,
                              userSelect: "none",
                              cursor: "pointer",
                            }}
                          >
                            <div className="nav-right d-flex jsutify-content-end align-items-center">
                              <div
                                style={{
                                  height: 53,
                                  backgroundColor: "#489077",
                                  borderRadius: 38,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  style={{
                                    width: 47,
                                    height: 47,
                                    borderRadius: "50%",
                                    marginLeft: 3,
                                  }}
                                  src={avatarSrc}
                                  alt="Girl in a jacket"
                                />
                                <div
                                  style={{ marginRight: 24, marginLeft: 20 }}
                                >
                                  {myInfo?.username}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ul
                          className={`sub-menu ${
                            state.activeMenu === "auction" ? "d-block" : ""
                          }`}
                        >
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href={`/user-profile/${myInfo.userId}`}>
                              <FontAwesomeIcon
                                icon={faUser}
                                style={{ marginRight: 8 }}
                              />
                              Trang cá nhân
                            </Link>
                          </li>
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="/account-details">
                              <FontAwesomeIcon
                                icon={faGear}
                                style={{ marginRight: 8 }}
                              />
                              Thông tin cá nhân
                            </Link>
                          </li>
                          <li
                            className={
                              pathName === "/auction-sidebar" ? "active" : ""
                            }
                          >
                            <Link href="#" onClick={handleLogout}>
                              <FontAwesomeIcon
                                icon={faSignOutAlt}
                                style={{ marginRight: 8 }}
                              />
                              Đăng xuất
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </>
                )}
                {!myInfo && (
                  <>
                    <div className="btn-area d-lg-none d-flex">
                      <a href="/login" className="login-btn btn-hover">
                        Đăng nhập
                        <span style={{ top: "40.5px", left: "84.2344px" }} />
                      </a>
                    </div>
                    <div
                      style={{ marginTop: "10px" }}
                      className="btn-area d-lg-none d-flex"
                    >
                      <a href="/register" className="login-btn btn-hover">
                        Đăng kí
                        <span style={{ top: "40.5px", left: "84.2344px" }} />
                      </a>
                    </div>
                  </>
                )}
              </div>
              {!myInfo && (
                <div style={{ display: "flex", gap: "15px" }}>
                  <div className="nav-right d-flex jsutify-content-end align-items-center">
                    <a
                      href="/login"
                      className="login-btn btn-hover d-lg-flex d-none"
                    >
                      Đăng nhập
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
                  <div className="nav-right d-flex jsutify-content-end align-items-center">
                    <a
                      href="/register"
                      className="login-btn btn-hover d-lg-flex d-none"
                    >
                      Đăng kí
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
                </div>
              )}
            </>
          </header>
        )}
      </div>

      <div
        style={{ height: "1px", width: "100%", backgroundColor: "black" }}
      ></div>
    </div>
  );
};

export default Header1;
