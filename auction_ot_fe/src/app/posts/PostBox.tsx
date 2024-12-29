"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import PostItem from './components/PostItem'
import { Post } from './models/post'
import { PostService } from './services/post_services'
import { useNavigate } from "react-router-dom";

SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

const PostBox = () => {
  // const navigate = useNavigate();

  // const handleDivClick = (postId) => {
  //   navigate(`/blog-detail?blogId=${postId}`);
  // };
  // Example posts data - replace with your actual data

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await PostService.getPosts(false);
    setPosts(response);
  };

  const settings = useMemo(
    () => ({
      slidesPerView: 1,
      speed: 1500,
      spaceBetween: 25,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".post-slider-next",
        prevEl: ".post-slider-prev",
      },
      breakpoints: {
        280: {
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
      },
    }),
    []
  );

  return (
    <div className="post-slider-section mb-110">
      <div
        className="container"
        style={{
          padding: "30px",
          backgroundColor: "#ecf3f1",
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
                <span>Các bài </span>
                <span style={{ fontWeight: "bold", color: "black" }}>đăng</span>
              </h2>
              <p>
                Những bài đăng nổi bật vừa được cập nhật. Xem ngay để không bỏ
                lỡ thông tin hữu ích!
              </p>
            </div>
            <Link
              className="view-button wow animate fadeInRight"
              data-wow-delay="200ms"
              data-wow-duration="1500ms"
              href="/post-list"
            >
              Xem thêm
              <svg viewBox="0 0 13 20">
                <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="row">
          <Link href={`/blog-detail?blogId=${posts[0]?.post_id || ""}`}>
            <div className="col-12">
              <Swiper {...settings} className="post-slider">
                {posts.map((post) => (
                  <SwiperSlide key={post.post_id}>
                    <PostItem post={post} key={post.post_id} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostBox
