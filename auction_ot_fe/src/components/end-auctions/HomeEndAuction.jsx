"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCountdownTimer } from "../../customHooks/useCountdownTimer";
import AxiosInstance from "@/store/SetupAxios";
import { API_ENDPOINT_FETCH_AUCTION_FILTER } from "@/services/Endpoints";
import { Status } from "@/store/constants";
import EndAuctionItemCard from "@/components/auction/EndAuctionItemCard";

const HomeEndtAuction = () => {
  const [dataList, setDataList] = useState([]);
  const getData = async () => {
    try {
      const res = await AxiosInstance.post(API_ENDPOINT_FETCH_AUCTION_FILTER, {
        status: Status.Ended,
        pageIndex: 1,
        pageSize: 8,
      });
      if (res.status === 200) {
        setDataList(res.data.auctions.$values);
        console.log(res.data.auctions.$values);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="latest-auction-section mb-110">
      <div
        className="container"
        style={{
          padding: "30px",
          backgroundColor: "rgba(167, 199, 188, 0.21)",
        }}
      >
        <div className="row mb-60">
          <div className="col-lg-12 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div
              className="section-title wow animate fadeInLeft"
              data-wow-delay="200ms"
              data-wow-duration="1500ms"
            >
              <h2>
                <span>Đấu giá</span>{" "}
                <span style={{ fontWeight: "bold", color: "black" }}>
                  đã kết thúc
                </span>
              </h2>
              <p>
                Các phiên đấu giá đã khép lại, mang đến nhiều kết quả thú vị.
                Hãy đón chờ những phiên tiếp theo!
              </p>
            </div>
            <Link
              className="view-button wow animate fadeInRight"
              data-wow-delay="200ms"
              data-wow-duration="1500ms"
              href={`/auction-grid?status=${Status.Ended}`}
            >
              Xem thêm
              <svg viewBox="0 0 13 20">
                <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="row g-4">
          {dataList.map((item) => (
            <div className="col-xl-3 col-lg-4 col-md-4">
              <EndAuctionItemCard key={item?.$id} props={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default HomeEndtAuction;
