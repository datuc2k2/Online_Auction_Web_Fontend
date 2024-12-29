"use client";
import auctionCardData from "../../data/auction-card.json";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
import Link from "next/link";
SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);
import AuctionCard from "../auction/auction-card";
import { useEffect, useMemo, useState } from "react";
import { useCountdownTimer } from "../../customHooks/useCountdownTimer";
import AxiosInstance from "@/store/SetupAxios";
import { API_ENDPOINT_FETCH_AUCTION_FILTER } from "@/services/Endpoints";
import { Status } from "@/store/constants";
import LiveAuctionItemCard from "../auction/LiveAuctionItemCard";
const Home1LiveAuction = () => {
  const [dataList, setDataList] = useState([]);
  const settings = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 25,
      autoplay: {
        delay: 2500, // Autoplay duration in milliseconds
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".auction-slider-next",
        prevEl: ".auction-slider-prev",
      },

      breakpoints: {
        280: {
          slidesPerView: 1,
        },
        386: {
          slidesPerView: 1,
        },
        576: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        },
        1400: {
          slidesPerView: 4,
        },
      },
    };
  }, []);
  const getData = async () => {
    try {
      const res = await AxiosInstance.post(API_ENDPOINT_FETCH_AUCTION_FILTER, {
        status: Status.OnGoing,
        pageIndex: 1,
        pageSize: 10,
      });
      if (res.status === 200) {
        setDataList(res.data.auctions.$values);
        // console.log(res.data.auctions.$values);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="live-aution-section mt-50 mb-110">
        <div
          className="container"
          style={{
            padding: "30px",
            backgroundColor: "rgba(167, 199, 188, 0.21)",
          }}
        >
          <div
            className="row mb-60 wow animate fadeInDown"
            data-wow-delay="200ms"
            data-wow-duration="1500ms"
          >
            <div className="col-lg-12 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="section-title">
                <h2>
                  <span>Đấu giá</span>{" "}
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    đang diễn ra
                  </span>
                </h2>
                <p>
                  Cập nhật ngay các phiên đấu giá đang diễn ra, nơi bạn có thể
                  cạnh tranh và giành lấy những món đồ yêu thích.
                </p>
              </div>
              <div className="slider-btn-grp">
                <div className="slider-btn auction-slider-prev">
                  <svg
                    width={9}
                    height={15}
                    viewBox="0 0 9 15"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 7.50009L9 0L3.27273 7.50009L9 15L0 7.50009Z" />
                  </svg>
                </div>
                <div className="slider-btn auction-slider-next">
                  <svg
                    width={9}
                    height={15}
                    viewBox="0 0 9 15"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 7.50009L0 0L5.72727 7.50009L0 15L9 7.50009Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div
            className="auction-slider-area mb-70 wow animate fadeInUp"
            data-wow-delay="200ms"
            data-wow-duration="1500ms"
          >
            <div className="row">
              <div className="col-lg-12">
                <Swiper {...settings} className="swiper auction-slider">
                  <div className="swiper-wrapper">
                    {dataList.map((item) => {
                      return (
                        <SwiperSlide key={item?.$id} className="swiper-slide">
                          <LiveAuctionItemCard
                            swiperSlide={true}
                            props={item}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </div>
                </Swiper>
              </div>
            </div>
          </div>
          <div
            className="row wow animate fadeInUp"
            data-wow-delay="200ms"
            data-wow-duration="1500ms"
          >
            <div className="col-lg-12 d-flex justify-content-center">
              <Link
                className="view-button"
                href={`/auction-grid?status=${Status.OnGoing}`}
                style={{ fontSize: "20px" }}
              >
                Xem thêm phiên đấu giá đang diễn ra
                <svg viewBox="0 0 13 20">
                  <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home1LiveAuction;
