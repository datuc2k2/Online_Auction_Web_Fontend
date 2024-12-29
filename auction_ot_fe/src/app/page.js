"use client";
import HomeEndtAuction from "@/components/end-auctions/HomeEndAuction";
import Header1 from "@/components/header/Header1";
import Home1About from "../components/about-section/Home1About";
import Home1Banner from "../components/banner/Home1Banner";
import Home1Banner2 from "../components/banner/Home1Banner2";
import Home1Blog from "../components/blog/Home1Blog";
import Home1Category from "../components/category/Home1Category";
import Home1Faq from "../components/faq/Home1Faq";
import Footer from "../components/footer/Footer";
import Home1LatestAuction from "../components/latest-auction/Home1LatestAuction";
import Home1LiveAuction from "../components/live-auction/Home1LiveAuction";
import Home1LogoSection from "../components/logo-section/Home1LogoSection";
import Home1ProcessSection from "../components/process-section/Home1ProcessSection";
import Home1Testimonial from "../components/testimonial/Home1Testimonial";
import Home1UpcomingAuction from "../components/upcoming-auction/Home1UpcomingAuction";
import PostBox from "./posts/PostBox";
import PostPage from "./posts/PostPage";
import PostCreate from "./posts/PostCreate";
import PostApproval from "./posts/PostApproval";
import CreateNotification from "./posts/Notification";

import { useEffect } from "react";
// import React, { useEffect, useState, lazy } from "react";
// import config from "../config/Config";
// import { Provider, useDispatch, useSelector } from "react-redux";
// import store from "../store/Store";
// import { ConfigProvider } from "antd";
// import {
//   Routes,
//   Route,
//   Navigate,
//   BrowserRouter as Router,
// } from "react-router-dom";
// import Auth from "../routes/Auth";
// import { RootState } from "../store/RootReducer";
// import { ThemeProvider } from "styled-components";
// import Main from "../routes/main/Index";
// import "./static/css/Style.css";
// // import "antd/dist/antd.less";
// import { ProtectedRoute } from "../app/components/component_base/components/utilities/ProtectedRoute";
// import { loginSuccess } from "../store/auth/Actions";

// const NotFound = lazy(() => import("../container/pages/404"));

// const { themeColor } = config;

// const ProviderConfig = () => {
//   const mainContent = useSelector((state) => state.layout.mode);
//   console.log('mainContent__: ',mainContent);

//   const isLoggedIn = useSelector((state) => state.auth.access_token);
//   const dispatch = useDispatch();

//   const baseName = process.env.REACT_APP_URL_DEV
//     ? new URL(process.env.REACT_APP_URL_DEV).pathname
//     : "/";

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     const loginResString = localStorage.getItem("LoginResponse");
//     if (token && loginResString) {
//       const loginResponse = JSON.parse(loginResString);
//       dispatch(loginSuccess(loginResponse));
//     }
//   }, [dispatch]);

//   return (
//     <ConfigProvider>
//       <ThemeProvider theme={{ ...themeColor, mainContent }}>
//         <Router basename={baseName}>
//           <Routes>
//             <Route path="/*" element={<Main />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Router>
//       </ThemeProvider>
//     </ConfigProvider>
//   );
// };

export default function Home() {
  // useEffect(()=>{
    
  //   const handleInitConnection = async ()=>{
  //     const connection = await SignalRConnection.initConnection();
  //     connection.onclose(async ()=>{
  //       await connection.start();
  //       return;
  //     })
  //     await connection.start();
  //   }
  //   handleInitConnection();
  // },[])
  return (
    // <div>Content</div>
    // <Provider store={store}>
    //   <ProviderConfig />
    // </Provider>
    //   {/* <Header2 />
    //   <Header3 /> */}
    <>
      {/* <Header1 /> */}
      {/* <Home1Banner />
      <Home1LiveAuction />
      <Home1Category />
      <Home1LatestAuction /> */}
      {/* Post Box for displaying in home */}
    
      
      
      
      {/* <HomeEndtAuction />
      <Home1Banner2 />
      <Home1About />
      <Home1UpcomingAuction />
      <Home1ProcessSection />
      <Home1LogoSection />
      <Home1Faq />
      <Home1Testimonial />
      <Home1Blog /> */}

      <Header1 />
      <Home1Banner />
      <Home1LiveAuction />
      <Home1Category />
      <Home1LatestAuction />
      <HomeEndtAuction />
      <Home1Banner2 />
      <Home1About />
      <Home1UpcomingAuction />
      <Home1ProcessSection />
      <Home1LogoSection />
      <Home1Faq />
      <Home1Testimonial />
      <Home1Blog />
      <PostBox/>
      <Footer />

      {/* Post section for creating, displaying, and approving posts */}
      {/* <PostBox/>
      <PostCreate/>
      <PostPage />
      <PostApproval/>*/}
      {/* <CreateNotification/>  */}
      {/* <Footer /> */}
    </> 
  );
}
