import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faComment,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { Post } from "../models/post";
import { DEFAULT_AVATAR } from "../utils/constant";
import CommentSection from "./CommentSection";
import { convertTime } from "../utils/convert_time";
import { PostService } from "../services/post_services";
import { CachingPostLike } from "../utils/caching_post_like";
import { RootState } from "@/store/RootReducer";
import { useSelector } from "react-redux";
import { useSignalR } from "../utils/SignalRContext";
import { useRouter } from "next/navigation";

interface PostBoxItemProps {
  post: any;
}

const PostBoxItem: React.FC<PostBoxItemProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.total_like || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.total_comment || 0);
  const router = useRouter();
  const { liveMessage } = useSignalR();

  useEffect(() => {
    if (liveMessage) {
      setCommentCount((prev) => prev + 1);
    }
  }, [liveMessage]);

  const handleCommentCountChange = (change: number) => {
    setCommentCount((prev) => prev + change);
  };
  const myInfo = useSelector((states: RootState) => states.auth.myInfo);
  const handleLikeClick = async () => {
    if (!myInfo) {
      router.push("/login");
      return;
    }
    //TODO: CALL myInfor and update user_id
    const user_id = myInfo?.userId ?? "";
    await PostService.likePost(post.post_id, "", user_id.toString());
    handleCacheLike();
    setLiked(!liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
  };

  const handleCommentClick = () => {
    if (!myInfo) {
      router.push("/login");
      return;
    }
    setShowComments(!showComments);
  };

  const handleCacheLike = () => {
    const isLiked = CachingPostLike.isPostLiked(post.post_id);
    if (isLiked) {
      CachingPostLike.removePostLike(post.post_id);
    } else {
      CachingPostLike.addPostLike(post.post_id);
    }
  };

  useEffect(() => {
    const isLiked = CachingPostLike.isPostLiked(post.post_id);
    setLiked(isLiked);
  }, [post.post_id]);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        marginBottom: "16px",
        overflow: "hidden",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
      >
        <div>
          <Avatar
            src={
              post.owner.avatar + "" + process.env.NEXT_PUBLIC_IMAGE_POSTFIX ||
              DEFAULT_AVATAR
            }
            alt={post.owner.name}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>
        <div style={{ marginLeft: "12px" }}>
          <h6 style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>
            {post.owner.name}
          </h6>
          <small style={{ color: "#6c757d", fontSize: "12px" }}>
            {convertTime(post.create_at)}
          </small>
        </div>
      </div>

      {/* Title Section */}
      <div style={{ marginBottom: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "20px", color: "#2d3748" }}>
          {post.title}
        </h3>
      </div>

      {/* Category Section */}
      <div style={{ marginBottom: "16px" }}>
        <span
          style={{
            display: "inline-block",
            background: "#f0f4f8",
            color: "#2d3748",
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          {post?.category?.name}
        </span>
      </div>

      {/* Content Section */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "16px", color: "#4a5568", lineHeight: "1.5" }}>
          {post.content}
        </p>
      </div>

      {/* Image Section */}
      {post.images && post.images[0] && (
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <img
            src={post.images[0] + process.env.NEXT_PUBLIC_IMAGE_POSTFIX}
            alt="Post visual"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "24px",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleLikeClick}
          role="button"
          tabIndex={0}
        >
          <FontAwesomeIcon
            icon={(liked ? faHeartSolid : faHeartRegular) as IconProp}
            style={{
              fontSize: "24px",
              marginRight: "8px",
              color: liked ? "#f43f5e" : "#6c757d",
              transition: "all 0.3s ease",
            }}
          />
          <span style={{ color: liked ? "#f43f5e" : "#6c757d" }}>
            {likeCount} lượt thích
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleCommentClick}
          role="button"
          tabIndex={0}
        >
          <FontAwesomeIcon
            icon={faComment as IconProp}
            style={{
              fontSize: "24px",
              marginRight: "8px",
              color: showComments ? "#f43f5e" : "#6c757d",
            }}
          />
          <span style={{ color: showComments ? "#f43f5e" : "#6c757d" }}>
            {commentCount} bình luận
          </span>
        </div>
      </div>

      {/* Comment Section */}
      <div
        style={{
          maxHeight: showComments ? "1000px" : "0",
          overflow: "hidden",
          opacity: showComments ? 1 : 0,
          transform: `translateY(${showComments ? "0" : "-10px"})`,
          transition: "all 0.3s ease-in-out",
          marginTop: "16px",
        }}
      >
        <CommentSection
          postId={post.post_id}
          onCommentCountChange={handleCommentCountChange}
        />
      </div>
    </div>
  );
};

export default PostBoxItem;
