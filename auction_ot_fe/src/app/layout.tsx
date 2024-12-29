"use client";

import { useEffect, ReactNode, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "styled-components";
import "../../public/assets/css/bootstrap-icons.css";
import "../../public/assets/css/boxicons.min.css";
import "../../public/assets/css/swiper-bundle.min.css";
import "react-modal-video/css/modal-video.css";
import "../../public/assets/css/slick-theme.css";
import "../../public/assets/css/animate.min.css";
import "../../public/assets/css/nice-select.css";
import "../../public/assets/css/slick.css";
import "../../public/assets/css/bootstrap.min.css";
import "../../public/assets/css/style.css";
import "antd/dist/antd.css";

import ScrollTopBtn from "../components/common/ScrollTopBtn";
import useWow from "../customHooks/useWow";
import { dmsans, playfair_display } from "../fonts/font";
import { Providers } from "@/store/Provider";
import {
  routes_need_admin_employee_role,
  routes_need_login,
} from "./auth_route_name";
import { themeColor } from "@/config/theme/ThemeVariables";
import store from "@/store/Store";
import { openNotification } from "@/utility/Utility";
import { SignalRProvider } from "./posts/utils/SignalRContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathName = usePathname();
  const router = useRouter();
  const notificationShown = useRef(false);
  useWow();

  // Bootstrap JS Initialization
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // Redux state for layout mode
  const state = store.getState();
  const mainContent = state.layout.mode;

  return (
    <html
      lang="en"
      className={`${playfair_display.variable} ${dmsans.className}`}
    >
      <head>
        <link
          rel="icon"
          href="/assets/img/fav-icon.svg"
          type="image/x-icon"
          sizes="16x16"
        />

        <meta name="description" content="Your description here" />
        <meta name="keywords" content="next.js, SEO, meta tags" />
        <title>AuctionOT</title>
      </head>
      <body>
        <SignalRProvider>
          <Providers>
            <ThemeProvider theme={{ ...themeColor, mainContent }}>
              {children}
              <ScrollTopBtn />
            </ThemeProvider>
          </Providers>
        </SignalRProvider>
      </body>
    </html>
  );
}
