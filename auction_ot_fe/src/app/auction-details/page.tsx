"use client"
import React, { FC, useEffect } from "react";
import MultipurposeDetails1 from "@/components/auction-details/MultipurposeDetails1";
import Breadcrumb1 from "@/components/common/Breadcrumb1";
import Footer from "@/components/footer/Footer";
import InnerPageHeader1 from "@/components/header/InnerPageHeader1";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchAuctionBid, fetchAuctionDetail, fetchCategory } from "@/store/auction/Actions";
import { CommonLayout } from "@/layout/CommonLayout";

// export const metadata = {
//   title: "Probid- Multi Vendor Auction and Bidding Next js Template.",
//   icons: {
//     icon: "/assets/img/fav-icon.svg",
//   },
// };

function AuctionDetailsPage() {
  const dispatch = useDispatch<any>();
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("auctionId");

  useEffect(() => {
    if(auctionId) {
      fetchData();
    }
  }, [auctionId])

  const fetchData = () => {
    dispatch(fetchAuctionDetail(Number(auctionId)));
    dispatch(fetchAuctionBid(Number(auctionId)));
    dispatch(fetchCategory());
  }

  return (
    <div style={{ marginBottom: 50, marginTop: 40 }}>
      <MultipurposeDetails1 />
    </div>
  );
};

export default CommonLayout(React.memo(AuctionDetailsPage));
