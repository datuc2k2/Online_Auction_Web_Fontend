"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
import { useMemo } from "react";
SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

const Home1Testimonial = () => {
  const settings = useMemo(() => {
    return {
      slidesPerView: "auto",
      spaceBetween: 10,
      speed: 1500,
      effect: 'fade',             // Use the fade effect
      fadeEffect: {
        crossFade: true           // Enable cross-fade transition
      },
      autoplay: {
        delay: 2500, // Autoplay duration in milliseconds
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".testimonial-slider-next",
        prevEl: ".testimonial-slider-prev",
      },
    }
  }, [])
  return (
    <>
      {/* <div className="home1-tetimonial-section mb-110">
        <div className="testimonial-wrapper">
          <div className="container">
            <div className="row mb-50">
              <div className="col-lg-12">
                <div className="section-title text-center">
                  <h2>What Our <span>Client say?</span></h2>
                  <p>Feel free adapt this based on the specific managed services, features</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="testimonial-slider-wrap">
                  <Swiper {...settings} className="swiper home1-testimonial-slider">
                    <div className="swiper-wrapper">
                      <SwiperSlide className="swiper-slide">
                        <div className="testimonial-content-wrap">
                          <div className="quote">
                            <svg width={46} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.95 40.52">
                              <g className="cls-1">
                                <path className="cls-2" d="M30.66,42.72a7.18,7.18,0,0,0,.75-.31c.38-.17.83-.4,1.31-.64,1-.5,2-1.08,2.58-1.48m3.8-3.09a21.39,21.39,0,0,1-3.8,3.09M45.48,11c0,3.92,0,7.48-.07,8.74" transform="translate(-0.04 -2.74)" />
                                <path className="cls-2" d="M45.48,11l-.07,8.74a35.52,35.52,0,0,1-1.7,10.46,18.56,18.56,0,0,1-4.61,7l-3.8,3.09-4.64,2.43a2.09,2.09,0,0,1-1.14-.1,1.43,1.43,0,0,1-.31-.17,1.47,1.47,0,0,1-.29-.33A22,22,0,0,1,27.81,40c-.48-1-.74-1.56-.88-1.91a2,2,0,0,1-.18-.7,1.46,1.46,0,0,1,.4-1.24h0l0,0,.11-.08.34-.21c.28-.17.63-.36,1-.54s.95-.5,1.39-.77A13.62,13.62,0,0,0,33.17,32a12.1,12.1,0,0,0,2.57-4.48h0a17.94,17.94,0,0,0,.88-5.12V21.24H28.81l-.36-.18a2.1,2.1,0,0,1-.57-.42h0s0,0,0,0a.91.91,0,0,1-.22-.32,3.43,3.43,0,0,1-.13-.92c-.06-1-.05-3,0-7V12l0-7.55.14-.25a2.12,2.12,0,0,1,.44-.55,1.7,1.7,0,0,1,.53-.34l.36,0,1.27,0c1.2,0,3.15,0,6.33,0h7.64l.26.14a2.26,2.26,0,0,1,.88.88h0a3.64,3.64,0,0,1,.09,1.05C45.46,6.24,45.47,7.89,45.48,11Z" transform="translate(-0.04 -2.74)" />
                                <path className="cls-2" d="M19.22,12.22c0,4.09,0,6.4-.07,8a36,36,0,0,1-.34,4.1,27,27,0,0,1-1.37,6h0C15.46,35.46,11,39.86,5,42.46a1.82,1.82,0,0,1-2.25-.31l0,0a1.81,1.81,0,0,0-.1-.17c-.08-.14-.18-.33-.29-.55-.24-.44-.52-1-.8-1.59C1,38.72.77,38.21.65,37.89a1.23,1.23,0,0,1-.09-.32,2.5,2.5,0,0,1,0-.33,1.39,1.39,0,0,1,.28-1,4.53,4.53,0,0,1,1.46-.92,15.9,15.9,0,0,0,4-2.64,11.41,11.41,0,0,0,2.54-3.5,14.26,14.26,0,0,0,1.2-3.62c.09-.46.19-1.2.28-1.9s.14-1.4.14-1.76a.61.61,0,0,0-.08-.31.67.67,0,0,0-.32-.26,2.32,2.32,0,0,0-.58-.08c-.49,0-1.44,0-3.24,0H2.58l-.36-.18h0a2,2,0,0,1-.56-.42h0l0,0a1,1,0,0,1-.21-.32,3.43,3.43,0,0,1-.13-.92c-.06-1-.06-3,0-7V12c0-3.83,0-5.74,0-6.74,0-.5,0-.75.06-.88a.31.31,0,0,1,0-.17h0a2,2,0,0,1,.89-.85.81.81,0,0,1,.22-.07c.15,0,.41,0,.93-.05,1,0,3,0,6.86,0H18l.26.14a2,2,0,0,1,.86.86h0a4,4,0,0,1,.09,1.17C19.22,6.48,19.22,8.45,19.22,12.22Z" transform="translate(-0.04 -2.74)" />
                              </g>
                            </svg>
                          </div>
                          <span>Great Auction Product!</span>
                          <p>Feel free to customize the key features based on the services and strategies you offer in each plan. This breakdown helps potential clients understand the specific value they'll receive at each pricing tier.</p>
                          <div className="author-area">
                            <div className="author-img">
                              <img src="assets/img/home1/author-img1.png" alt="" />
                            </div>
                            <div className="author-content">
                              <h6>Penelope Gianna</h6>
                              <span>CEO at Softconic</span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide className="swiper-slide">
                        <div className="testimonial-content-wrap">
                          <div className="quote">
                            <svg width={46} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.95 40.52">
                              <g className="cls-1">
                                <path className="cls-2" d="M30.66,42.72a7.18,7.18,0,0,0,.75-.31c.38-.17.83-.4,1.31-.64,1-.5,2-1.08,2.58-1.48m3.8-3.09a21.39,21.39,0,0,1-3.8,3.09M45.48,11c0,3.92,0,7.48-.07,8.74" transform="translate(-0.04 -2.74)" />
                                <path className="cls-2" d="M45.48,11l-.07,8.74a35.52,35.52,0,0,1-1.7,10.46,18.56,18.56,0,0,1-4.61,7l-3.8,3.09-4.64,2.43a2.09,2.09,0,0,1-1.14-.1,1.43,1.43,0,0,1-.31-.17,1.47,1.47,0,0,1-.29-.33A22,22,0,0,1,27.81,40c-.48-1-.74-1.56-.88-1.91a2,2,0,0,1-.18-.7,1.46,1.46,0,0,1,.4-1.24h0l0,0,.11-.08.34-.21c.28-.17.63-.36,1-.54s.95-.5,1.39-.77A13.62,13.62,0,0,0,33.17,32a12.1,12.1,0,0,0,2.57-4.48h0a17.94,17.94,0,0,0,.88-5.12V21.24H28.81l-.36-.18a2.1,2.1,0,0,1-.57-.42h0s0,0,0,0a.91.91,0,0,1-.22-.32,3.43,3.43,0,0,1-.13-.92c-.06-1-.05-3,0-7V12l0-7.55.14-.25a2.12,2.12,0,0,1,.44-.55,1.7,1.7,0,0,1,.53-.34l.36,0,1.27,0c1.2,0,3.15,0,6.33,0h7.64l.26.14a2.26,2.26,0,0,1,.88.88h0a3.64,3.64,0,0,1,.09,1.05C45.46,6.24,45.47,7.89,45.48,11Z" transform="translate(-0.04 -2.74)" />
                                <path className="cls-2" d="M19.22,12.22c0,4.09,0,6.4-.07,8a36,36,0,0,1-.34,4.1,27,27,0,0,1-1.37,6h0C15.46,35.46,11,39.86,5,42.46a1.82,1.82,0,0,1-2.25-.31l0,0a1.81,1.81,0,0,0-.1-.17c-.08-.14-.18-.33-.29-.55-.24-.44-.52-1-.8-1.59C1,38.72.77,38.21.65,37.89a1.23,1.23,0,0,1-.09-.32,2.5,2.5,0,0,1,0-.33,1.39,1.39,0,0,1,.28-1,4.53,4.53,0,0,1,1.46-.92,15.9,15.9,0,0,0,4-2.64,11.41,11.41,0,0,0,2.54-3.5,14.26,14.26,0,0,0,1.2-3.62c.09-.46.19-1.2.28-1.9s.14-1.4.14-1.76a.61.61,0,0,0-.08-.31.67.67,0,0,0-.32-.26,2.32,2.32,0,0,0-.58-.08c-.49,0-1.44,0-3.24,0H2.58l-.36-.18h0a2,2,0,0,1-.56-.42h0l0,0a1,1,0,0,1-.21-.32,3.43,3.43,0,0,1-.13-.92c-.06-1-.06-3,0-7V12c0-3.83,0-5.74,0-6.74,0-.5,0-.75.06-.88a.31.31,0,0,1,0-.17h0a2,2,0,0,1,.89-.85.81.81,0,0,1,.22-.07c.15,0,.41,0,.93-.05,1,0,3,0,6.86,0H18l.26.14a2,2,0,0,1,.86.86h0a4,4,0,0,1,.09,1.17C19.22,6.48,19.22,8.45,19.22,12.22Z" transform="translate(-0.04 -2.74)" />
                              </g>
                            </svg>
                          </div>
                          <span>Fantastic Bidding Item!</span>
                          <p>You are welcome to alter the main elements according to the services and tactics you provide for every plan. This breakdown makes it easier for prospective customers to comprehend the precise value.</p>
                          <div className="author-area">
                            <div className="author-img">
                              <img src="assets/img/home1/author-img2.png" alt="" />
                            </div>
                            <div className="author-content">
                              <h6>Mr. Daniel Scoot</h6>
                              <span>CEO at Axleo</span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide className="swiper-slide">
                        <div className="testimonial-content-wrap">
                          <div className="quote">
                            <svg width={46} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.95 40.52">
                              <g className="cls-1">
                                <path className="cls-2" d="M30.66,42.72a7.18,7.18,0,0,0,.75-.31c.38-.17.83-.4,1.31-.64,1-.5,2-1.08,2.58-1.48m3.8-3.09a21.39,21.39,0,0,1-3.8,3.09M45.48,11c0,3.92,0,7.48-.07,8.74" transform="translate(-0.04 -2.74)" />
                                <path className="cls-2" d="M45.48,11l-.07,8.74a35.52,35.52,0,0,1-1.7,10.46,18.56,18.56,0,0,1-4.61,7l-3.8,3.09-4.64,2.43a2.09,2.09,0,0,1-1.14-.1,1.43,1.43,0,0,1-.31-.17,1.47,1.47,0,0,1-.29-.33A22,22,0,0,1,27.81,40c-.48-1-.74-1.56-.88-1.91a2,2,0,0,1-.18-.7,1.46,1.46,0,0,1,.4-1.24h0l0,0,.11-.08.34-.21c.28-.17.63-.36,1-.54s.95-.5,1.39-.77A13.62,13.62,0,0,0,33.17,32a12.1,12.1,0,0,0,2.57-4.48h0a17.94,17.94,0,0,0,.88-5.12V21.24H28.81l-.36-.18a2.1,2.1,0,0,1-.57-.42h0s0,0,0,0a.91.91,0,0,1-.22-.32,3.43,3.43,0,0,1-.13-.92c-.06-1-.05-3,0-7V12l0-7.55.14-.25a2.12,2.12,0,0,1,.44-.55,1.7,1.7,0,0,1,.53-.34l.36,0,1.27,0c1.2,0,3.15,0,6.33,0h7.64l.26.14a2.26,2.26,0,0,1,.88.88h0a3.64,3.64,0,0,1,.09,1.05C45.46,6.24,45.47,7.89,45.48,11Z" transform="translate(-0.04 -2.74)" />
                                <path className="cls-2" d="M19.22,12.22c0,4.09,0,6.4-.07,8a36,36,0,0,1-.34,4.1,27,27,0,0,1-1.37,6h0C15.46,35.46,11,39.86,5,42.46a1.82,1.82,0,0,1-2.25-.31l0,0a1.81,1.81,0,0,0-.1-.17c-.08-.14-.18-.33-.29-.55-.24-.44-.52-1-.8-1.59C1,38.72.77,38.21.65,37.89a1.23,1.23,0,0,1-.09-.32,2.5,2.5,0,0,1,0-.33,1.39,1.39,0,0,1,.28-1,4.53,4.53,0,0,1,1.46-.92,15.9,15.9,0,0,0,4-2.64,11.41,11.41,0,0,0,2.54-3.5,14.26,14.26,0,0,0,1.2-3.62c.09-.46.19-1.2.28-1.9s.14-1.4.14-1.76a.61.61,0,0,0-.08-.31.67.67,0,0,0-.32-.26,2.32,2.32,0,0,0-.58-.08c-.49,0-1.44,0-3.24,0H2.58l-.36-.18h0a2,2,0,0,1-.56-.42h0l0,0a1,1,0,0,1-.21-.32,3.43,3.43,0,0,1-.13-.92c-.06-1-.06-3,0-7V12c0-3.83,0-5.74,0-6.74,0-.5,0-.75.06-.88a.31.31,0,0,1,0-.17h0a2,2,0,0,1,.89-.85.81.81,0,0,1,.22-.07c.15,0,.41,0,.93-.05,1,0,3,0,6.86,0H18l.26.14a2,2,0,0,1,.86.86h0a4,4,0,0,1,.09,1.17C19.22,6.48,19.22,8.45,19.22,12.22Z" transform="translate(-0.04 -2.74)" />
                              </g>
                            </svg>
                          </div>
                          <span>Great Auction Product!</span>
                          <p>You can alter the main aspects of each plan according on the services and tactics you provide. The particular value that each pricing tier offers is made clearer to prospective customers by this breakdown.</p>
                          <div className="author-area">
                            <div className="author-img">
                              <img src="assets/img/home1/author-img3.png" alt="" />
                            </div>
                            <div className="author-content">
                              <h6>Mr. Daniel Scoot</h6>
                              <span>CEO at Zenfy</span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide className="swiper-slide">
                        <div className="testimonial-content-wrap">
                          <div className="quote">
                            <svg width={46} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.95 40.52">
                              <g className="cls-1">
                                <path className="cls-2" d="M30.66,42.72a7.18,7.18,0,0,0,.75-.31c.38-.17.83-.4,1.31-.64,1-.5,2-1.08,2.58-1.48m3.8-3.09a21.39,21.39,0,0,1-3.8,3.09M45.48,11c0,3.92,0,7.48-.07,8.74" transform="translate(-0.04 -2.74)" />
                                <path className="cls-2" d="M45.48,11l-.07,8.74a35.52,35.52,0,0,1-1.7,10.46,18.56,18.56,0,0,1-4.61,7l-3.8,3.09-4.64,2.43a2.09,2.09,0,0,1-1.14-.1,1.43,1.43,0,0,1-.31-.17,1.47,1.47,0,0,1-.29-.33A22,22,0,0,1,27.81,40c-.48-1-.74-1.56-.88-1.91a2,2,0,0,1-.18-.7,1.46,1.46,0,0,1,.4-1.24h0l0,0,.11-.08.34-.21c.28-.17.63-.36,1-.54s.95-.5,1.39-.77A13.62,13.62,0,0,0,33.17,32a12.1,12.1,0,0,0,2.57-4.48h0a17.94,17.94,0,0,0,.88-5.12V21.24H28.81l-.36-.18a2.1,2.1,0,0,1-.57-.42h0s0,0,0,0a.91.91,0,0,1-.22-.32,3.43,3.43,0,0,1-.13-.92c-.06-1-.05-3,0-7V12l0-7.55.14-.25a2.12,2.12,0,0,1,.44-.55,1.7,1.7,0,0,1,.53-.34l.36,0,1.27,0c1.2,0,3.15,0,6.33,0h7.64l.26.14a2.26,2.26,0,0,1,.88.88h0a3.64,3.64,0,0,1,.09,1.05C45.46,6.24,45.47,7.89,45.48,11Z" transform="translate(-0.04 -2.74)" />
                                <path className="cls-2" d="M19.22,12.22c0,4.09,0,6.4-.07,8a36,36,0,0,1-.34,4.1,27,27,0,0,1-1.37,6h0C15.46,35.46,11,39.86,5,42.46a1.82,1.82,0,0,1-2.25-.31l0,0a1.81,1.81,0,0,0-.1-.17c-.08-.14-.18-.33-.29-.55-.24-.44-.52-1-.8-1.59C1,38.72.77,38.21.65,37.89a1.23,1.23,0,0,1-.09-.32,2.5,2.5,0,0,1,0-.33,1.39,1.39,0,0,1,.28-1,4.53,4.53,0,0,1,1.46-.92,15.9,15.9,0,0,0,4-2.64,11.41,11.41,0,0,0,2.54-3.5,14.26,14.26,0,0,0,1.2-3.62c.09-.46.19-1.2.28-1.9s.14-1.4.14-1.76a.61.61,0,0,0-.08-.31.67.67,0,0,0-.32-.26,2.32,2.32,0,0,0-.58-.08c-.49,0-1.44,0-3.24,0H2.58l-.36-.18h0a2,2,0,0,1-.56-.42h0l0,0a1,1,0,0,1-.21-.32,3.43,3.43,0,0,1-.13-.92c-.06-1-.06-3,0-7V12c0-3.83,0-5.74,0-6.74,0-.5,0-.75.06-.88a.31.31,0,0,1,0-.17h0a2,2,0,0,1,.89-.85.81.81,0,0,1,.22-.07c.15,0,.41,0,.93-.05,1,0,3,0,6.86,0H18l.26.14a2,2,0,0,1,.86.86h0a4,4,0,0,1,.09,1.17C19.22,6.48,19.22,8.45,19.22,12.22Z" transform="translate(-0.04 -2.74)" />
                              </g>
                            </svg>
                          </div>
                          <span>Fantastic Bidding Item!</span>
                          <p>Experience able to alter the main characteristics of each plan in accordance with what services and tactics you provide. Prospective customers can better grasp the particular value at each price point with the aid of this analysis.</p>
                          <div className="author-area">
                            <div className="author-img">
                              <img src="assets/img/home1/author-img4.png" alt="" />
                            </div>
                            <div className="author-content">
                              <h6>Weston Bennett</h6>
                              <span>CEO at Triprex</span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    </div>
                  </Swiper>
                  <div className="slider-btn-grp">
                    <div className="slider-btn testimonial-slider-prev">
                      <svg width={9} height={15} viewBox="0 0 9 15" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 7.50009L9 0L3.27273 7.50009L9 15L0 7.50009Z" />
                      </svg>
                    </div>
                    <div className="slider-btn testimonial-slider-next">
                      <svg width={9} height={15} viewBox="0 0 9 15" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 7.50009L0 0L5.72727 7.50009L0 15L9 7.50009Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default Home1Testimonial
