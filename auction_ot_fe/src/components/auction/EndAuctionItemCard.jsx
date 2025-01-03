import Link from "next/link";
import { useCountdownTimer } from "../../customHooks/useCountdownTimer";
import { useLinkMedia } from "@/customHooks/useLinkMedia";

const EndAuctionItemCard = ({ props }) => {
  const { mediaElement } = useLinkMedia(
    props.auctionImages.$values?.[0]?.imageUrl
  );
  // const { days, hours, minutes, seconds } = useCountdownTimer(props.endTime);
  return (
    <div
      className="wow animate fadeInDown"
      data-wow-delay="200ms"
      data-wow-duration="1500ms"
    >
      <div className="auction-card">
        <div className="auction-card-img-wrap">
          <Link
            href={`/auction-details?auctionId=${props.auctionId}`}
            className="card-img"
          >
            {mediaElement}
          </Link>
          {/* <div className="batch">
            <span className="upcoming">
              <svg
                width={9}
                height={9}
                viewBox="0 0 9 9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0.731707 3.29268H0V7.46341C0 8.30488 0.695122 9 1.53659 9H7.46341C8.30488 9 9 8.30488 9 7.46341V3.29268H8.26829H0.731707ZM5.67073 4.84756C5.79878 4.70122 6.05488 4.71951 6.18293 4.84756C6.58537 5.21341 6.96951 5.57927 7.37195 5.96342C7.51829 6.10976 7.5 6.34756 7.37195 6.47561C7.0061 6.87805 6.64024 7.2622 6.2561 7.66463C6.10976 7.81098 5.87195 7.79268 5.7439 7.66463C5.59756 7.53659 5.61585 7.28049 5.7439 7.15244C6.01829 6.84146 6.31098 6.54878 6.58537 6.23781C6.27439 5.94512 5.96341 5.65244 5.65244 5.37805C5.5061 5.21342 5.52439 4.97561 5.67073 4.84756ZM4.20732 4.84756C4.33537 4.70122 4.59146 4.71951 4.71951 4.84756C5.12195 5.21341 5.5061 5.57927 5.90854 5.96342C6.05488 6.10976 6.03658 6.34756 5.90854 6.47561C5.54268 6.87805 5.17683 7.2622 4.79268 7.66463C4.64634 7.81098 4.40854 7.79268 4.28049 7.66463C4.13415 7.53659 4.15244 7.28049 4.28049 7.15244C4.55488 6.84146 4.84756 6.54878 5.12195 6.23781C4.81098 5.94512 4.5 5.65244 4.18902 5.37805C4.04268 5.21342 4.06098 4.97561 4.20732 4.84756ZM8.26829 2.56098H9V1.53659C9 0.713415 8.34146 0.0365854 7.51829 0V0.841463C7.51829 1.04268 7.35366 1.20732 7.15244 1.20732C6.95122 1.20732 6.78658 1.02439 6.78658 0.841463V0H2.26829V0.804878C2.26829 1.0061 2.10366 1.17073 1.90244 1.17073C1.70122 1.17073 1.53659 0.987805 1.53659 0.804878V0C0.695122 0 0 0.695122 0 1.53659V2.56098H0.731707H8.26829Z" />
              </svg>
              Kết thúc
            </span>
          </div> */}
          <ul className="view-and-favorite-area">
            <li>
              <a href="#">
                <svg
                  width={17}
                  height={11}
                  viewBox="0 0 17 11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.4028 5.44118C14.0143 7.8425 11.3811 9.33421 8.53217 9.33421C5.68139 9.33421 3.04821 7.8425 1.65968 5.44118C1.55274 5.25472 1.55274 5.05762 1.65968 4.87132C3.04821 2.47003 5.68139 0.978484 8.53217 0.978484C11.3811 0.978484 14.0143 2.47003 15.4028 4.87132C15.5116 5.05762 15.5116 5.25472 15.4028 5.44118ZM16.2898 4.39522C14.7224 1.68403 11.7499 0 8.53217 0C5.31258 0 2.3401 1.68403 0.772715 4.39522C0.492428 4.87896 0.492428 5.43355 0.772715 5.91693C2.3401 8.62812 5.31258 10.3125 8.53217 10.3125C11.7499 10.3125 14.7224 8.62812 16.2898 5.91693C16.5701 5.43358 16.5701 4.87896 16.2898 4.39522ZM8.53217 7.1634C9.68098 7.1634 10.6159 6.26305 10.6159 5.15617C10.6159 4.04929 9.68098 3.14894 8.53217 3.14894C7.38152 3.14894 6.44663 4.04929 6.44663 5.15617C6.44663 6.26305 7.38156 7.1634 8.53217 7.1634ZM8.53217 2.17045C6.82095 2.17045 5.43061 3.50998 5.43061 5.1562C5.43061 6.80278 6.82098 8.14176 8.53217 8.14176C10.2416 8.14176 11.6319 6.80275 11.6319 5.1562C11.6319 3.50998 10.2416 2.17045 8.53217 2.17045Z"
                  />
                </svg>
              </a>
            </li>
          </ul>
          {/* <div className="countdown-timer">
            <ul data-countdown="2024-10-05 12:00:00">
              <li className="times" data-days={0}>
                {days}
                <span>Ngày</span>
              </li>
              <li className="colon">:</li>
              <li className="times" data-hours={0}>
                {hours}
                <span>Giờ</span>
              </li>
              <li className="colon">:</li>
              <li className="times" data-minutes={0}>
                {minutes}
                <span>Phút</span>
              </li>
              <li className="colon">:</li>
              <li className="times" data-seconds={0}>
                {seconds}
                <span>Giây</span>
              </li>
            </ul>
          </div> */}
        </div>
        <div className="auction-card-content">
          <h6 style={{ height: 50 }}>
            <Link href={`/auction-details?auctionId=${props.auctionId}`}>
              {props.productName.length > 55
                ? `${props.productName.substring(0, 52)}...`
                : props.productName}
            </Link>
          </h6>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#23291fbb" }}>Giá trúng đấu giá:</span>
            <span
              style={{
                fontWeight: "bold",
                marginRight: "10px",
                color: "red",
              }}
            >
              {props.depositAmount} {props.currency}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#23291fbb" }}>Giá khởi điểm:</span>
            <span style={{ fontWeight: "bold", marginRight: "10px" }}>
              {props.startingPrice} {props.currency}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#23291fbb" }}>Bước giá:</span>
            <span style={{ fontWeight: "bold", marginRight: "10px" }}>
              {props.stepPrice} {props.currency}
            </span>
          </div>
          <div className="author-and-btn-area">
            <Link href="/store-details" className="author-area">
              <div className="author-img">
                <img
                  src={
                    props?.user?.userProfile?.avatar +
                    process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                  }
                  onError={(e) => {
                    const target = e.target;
                    target.onerror = null; // Ngăn vòng lặp nếu ảnh fallback cũng bị lỗi
                    target.src =
                      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                  }}
                  alt="User Avatar"
                />
              </div>
              <div className="author-content">
                <h6>{props?.user.username}</h6>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EndAuctionItemCard;
