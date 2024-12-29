import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ReviewCommentSection from "./ReviewCommentSection";
import axios from "@/store/SetupAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartSolid,
  faStar as faStarSolid,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
  faStar as faStarRegular,
  faComment,
} from "@fortawesome/free-regular-svg-icons";
const formatDateTime = (time) => {
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

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const Rating = styled.div`
  color: #ffd700;
`;

const Comment = styled.p`
  margin: 8px 0;
  color: #333;
  line-height: 1.5;
`;

const TimeStamp = styled.span`
  color: #666;
  font-size: 12px;
`;

const InteractionBar = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #eee;
`;

const InteractionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;
const renderStars = (rating) => {
  return [...Array(5)].map((_, index) => {
    const number = index + 1;
    const isHalfStar = rating % 1 !== 0 && Math.ceil(rating) === number;

    return (
      <FontAwesomeIcon
        key={index}
        icon={
          rating >= number
            ? faStarSolid
            : isHalfStar
            ? faStarHalfAlt
            : faStarRegular
        }
        style={{
          color: rating >= index + 1 || isHalfStar ? "#ffd700" : "#gray",
        }}
      />
    );
  });
};
const ReviewCard = ({ review, onCommentClick }) => {
  const [liked, setLiked] = useState(review.isLiked);
  const [likeCount, setLikeCount] = useState(review.likesCount);
  const [showComments, setShowComments] = useState();
  const myInfo = useSelector((states) => states.auth.myInfo);

  const handleLikeClick = async () => {
    if (!myInfo) {
      router.push("/login");
      return;
    }
    setLiked(!liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    try {
      await axios.get(`api/Users/toggle/${review.reviewId}`);
    } catch (error) {
      console.error("Failed to update comment:", error);
      // Nếu có lỗi xảy ra, bạn có thể phục hồi lại state hoặc thông báo cho người dùng
    }
  };
  return (
    <Card>
      <Header>
        <Avatar
          src={
            review?.owner?.avatar +
            "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-03-01T11:25:30Z&st=2024-11-27T03:25:30Z&spr=https,http&sig=TzFLXueNKkP0OTxYZK%2BqIMnImdsxb8e4NP2LRAW4WHY%3D"
          }
          alt={review?.owner?.username}
        />
        <UserInfo>
          <UserName>{review?.owner?.username}</UserName>
          <Rating>{renderStars(review.rating)}</Rating>
        </UserInfo>
      </Header>
      <Comment>{review.content}</Comment>
      <TimeStamp>{formatDateTime(review.updatedAt)}</TimeStamp>
      <InteractionBar>
        <InteractionButton
          onClick={handleLikeClick}
          style={{ color: liked ? "#f43f5e" : "#6c757d" }}
        >
          <FontAwesomeIcon icon={liked ? faHeartSolid : faHeartRegular} />
          {likeCount} Thích
        </InteractionButton>

        <InteractionButton onClick={onCommentClick}>
          <FontAwesomeIcon icon={faComment} />
          {review.subCommentsCount} Bình luận
        </InteractionButton>
      </InteractionBar>
      {/* {showComments && (
        <div
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #eee",
          }}
        >
          <ReviewCommentSection reviewId={review.reviewId} />
        </div>
      )} */}
    </Card>
  );
};

export default ReviewCard;
