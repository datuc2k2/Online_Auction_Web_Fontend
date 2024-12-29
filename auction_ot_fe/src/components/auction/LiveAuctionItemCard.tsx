import Link from "next/link";
import { useCountdownTimer } from "../../customHooks/useCountdownTimer";
import { useLinkMedia } from "../../customHooks/useLinkMedia";

const LiveAuctionItemCard = ({ swiperSlide = false, props }) => {
  const { mediaElement } = useLinkMedia(
    props.auctionImages.$values?.[0]?.imageUrl
  );
  // const [avatarUrl, setAvatarUrl] = useState<any>(null);
  // console.log("props : ", props.user.userProfile);
  // useEffect(() => {
  //   setAvatarUrl(props?.user?.userProfile.avatar);
  // }, [props]);
  // {avatarUrl + process.env.NEXT_PUBLIC_IMAGE_POSTFIX}
  const { days, hours, minutes, seconds } = useCountdownTimer(props.endTime);
  const content = (
    <div className="auction-card">
      <div className="auction-card-img-wrap">
        <Link
          href={`/auction-details?auctionId=${props.auctionId}`}
          className="card-img"
        >
          {mediaElement}
        </Link>
        <div className="batch">
          <span className="live">
            <svg
              width={11}
              height={11}
              viewBox="0 0 11 11"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.6777 11H4.83398C4.65599 11 4.51172 10.8557 4.51172 10.6777V10.334C4.51172 9.97798 4.80025 9.68944 5.15625 9.68944V9.30414C5.15625 8.79397 5.57133 8.37889 6.0815 8.37889H9.43022C9.94039 8.37889 10.3555 8.79397 10.3555 9.30414V9.68944C10.7115 9.68944 11 9.97798 11 10.334V10.6777C11 10.8556 10.8556 11 10.6777 11ZM6.96665 7.09722C6.75245 7.38146 6.34829 7.43829 6.06405 7.22402C5.77973 7.00985 5.72299 6.60568 5.93716 6.32134L7.8766 3.74766C8.09087 3.46333 8.49494 3.40659 8.7792 3.62077C9.06353 3.83503 9.12035 4.23911 8.90609 4.52346L6.96665 7.09722ZM2.334 3.60618C2.11973 3.89042 1.71563 3.94725 1.43131 3.73298C1.14707 3.51881 1.09025 3.11473 1.30451 2.83038L3.24397 0.256726C3.45815 -0.027598 3.86231 -0.0844241 4.14657 0.12984C4.43081 0.344103 4.48763 0.748181 4.27337 1.03253L2.334 3.60618ZM3.74767 5.4785C3.27134 5.11956 2.91373 4.67385 2.69008 4.20454L4.94678 1.20984C5.45955 1.29552 5.98651 1.51631 6.46293 1.87534C6.93928 2.23428 7.29689 2.67999 7.52054 3.14921L5.26382 6.14409C4.75108 6.05841 4.22411 5.83751 3.74767 5.4785ZM2.87749 5.56242C3.02753 5.71533 3.18557 5.86196 3.35979 5.99329C3.53409 6.12456 3.71864 6.23606 3.90689 6.33822L3.48668 6.89589L2.45719 6.12018L2.87749 5.56242ZM2.06929 6.63488L3.09878 7.41059L1.15932 9.98436C0.945055 10.2687 0.540977 10.3254 0.256717 10.1112C-0.027607 9.89698 -0.0843477 9.4929 0.12983 9.20856L2.06929 6.63488Z" />
            </svg>
            Đang diễn ra
          </span>
        </div>
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
        <div className="countdown-timer">
          <ul data-countdown="2024-08-25 12:00:00">
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
        </div>
      </div>
      <div className="auction-card-content">
        <h6 style={{ height: 50 }}>
          <Link href={`/auction-details?auctionId=${props.auctionId}`}>
            {props.productName.length > 55
              ? `${props.productName.substring(0, 52)}...`
              : props.productName}
          </Link>
        </h6>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#23291fbb" }}>Giá khởi điểm:</span>
          <span
            style={{
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            {props.startingPrice} {props.currency}
          </span>
        </div>
        <div
          className="author-and-btn-area"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Link href="/store-details" className="author-area">
            <div className="author-img">
              <img
                src={
                  props?.user?.userProfile?.avatar +
                  process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                }
                onError={(e) => {
                  const target = e.target as HTMLImageElement; // Type assertion cho TypeScript
                  target.onerror = null;
                  target.src =
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                }}
                alt="User Avatar"
              />
            </div>
            <div className="author-content">
              <h6>{props?.user?.username}</h6>
            </div>
          </Link>
          <Link
            href={`/auction-details?auctionId=${props.auctionId}`}
            className="bid-btn"
            style={{ width: "100%", textAlign: "center" }}
          >
            {" "}
            Đấu giá ngay
          </Link>
        </div>
      </div>
    </div>
  );
  if (swiperSlide) {
    return content;
  }
  return (
    <div
      className="wow animate fadeInDown"
      data-wow-delay="200ms"
      data-wow-duration="1500ms"
    >
      {content}
    </div>
  );
};

export default LiveAuctionItemCard;
