import { Route } from "@ant-design/pro-layout/es/typing"; 
import './Home.css' 
import { useNavigate } from "react-router-dom"; 
import { CommonLayout } from "../../../layout/CommonLayout";
import React from "react";
import Home1Banner from "../../../components/banner/Home1Banner";
import Home1LiveAuction from "../../../components/live-auction/Home1LiveAuction";
import Home1Category from "../../../components/category/Home1Category";
import Home1LatestAuction from "../../../components/latest-auction/Home1LatestAuction";
import HomeEndtAuction from "../../../components/end-auctions/HomeEndAuction";
import Home1Banner2 from "../../../components/banner/Home1Banner2";
import Home1About from "../../../components/about-section/Home1About";
import Home1UpcomingAuction from "../../../components/upcoming-auction/Home1UpcomingAuction";
import Home1ProcessSection from "../../../components/process-section/Home1ProcessSection";
import Home1LogoSection from "../../../components/logo-section/Home1LogoSection";
import Home1Faq from "../../../components/faq/Home1Faq";
import Home1Testimonial from "../../../components/testimonial/Home1Testimonial";
import Home1Blog from "../../../components/blog/Home1Blog";

const Home = React.memo(() => {
	return (
		<>
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
		</>
	);
}); 
 
export default CommonLayout(Home);