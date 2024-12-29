"use client";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";

const DEFAULT_AVATAR =
  "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2021/07/lol-t1-1.jpg";

const convertTime = (time) => {
  const date = new Date(time);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} ${years === 1 ? "năm" : "năm"} trước`;
  } else if (months > 0) {
    return `${months} ${months === 1 ? "tháng" : "tháng"} trước`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? "ngày" : "ngày"} trước`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? "giờ" : "giờ"} trước`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "phút" : "phút"} trước`;
  } else if (seconds > 0) {
    return `${seconds} ${seconds === 1 ? "giây" : "giây"} trước`;
  } else {
    return "Vừa xong";
  }
};
const PostItem = ({ post }) => {
  const contentRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      // Kiểm tra xem chiều cao nội dung có vượt quá chiều cao line-clamp (line-height * 6)
      const isContentOverflow = element.scrollHeight > element.clientHeight;
      setIsOverflow(isContentOverflow);
    }
  }, [post.content]);
  console.log(post.total_like);
  return (
    <div
      className="post-card"
      style={{
        backgroundColor: "white",
        height: "300px",
        padding: "20px 10px",
        marginTop: "20px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="post-header d-flex align-items-center gap-3 mb-3">
        <div className="avatar">
          <img
            src={
              post.owner.avatar + "" + process.env.NEXT_PUBLIC_IMAGE_POSTFIX ||
              DEFAULT_AVATAR
            }
            alt="Ảnh đại diện người dùng"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>
        <div className="post-meta">
          <h6 className="mb-0">{post.owner.name}</h6>
          <small className="text-muted">{convertTime(post.create_at)}</small>
        </div>
      </div>

      <div
        className="post-content mb-3"
        style={{ flexGrow: 1, overflow: "hidden", position: "relative" }}
      >
        {/* TODO:: */}
        <Tooltip>
          <p
            ref={contentRef}
            style={{
              margin: 0,
              fontSize: "16px",
              display: "-webkit-box",
              WebkitLineClamp: "6",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              position: "relative",
            }}
          >
            {post.content}
            {isOverflow && (
              <span
                style={{
                  display: "inline-block",
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  padding: "0 4px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 10,
                }}
              >
                ...
              </span>
            )}
          </p>
        </Tooltip>
      </div>

      <div
        className="post-footer d-flex align-items-center gap-4"
        style={{ marginTop: "auto" }}
      >
        <div className="d-flex align-items-center gap-1">
          <i className="bi bi-heart"></i>
          <span>{post.total_like || 0} lượt thích</span>
        </div>
        <div className="d-flex align-items-center gap-1">
          <i className="bi bi-chat"></i>
          <span>{post.comment_count || 0} bình luận</span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
