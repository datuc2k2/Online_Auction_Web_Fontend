import { useSelector } from "react-redux";
import styled from "styled-components";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
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
const CommentItemStyledComponent = styled.div`
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background: #fafafa;

  .sub-comments {
    margin-left: 40px;
    margin-top: 16px;
    border-left: 2px solid #e8e8e8;
    padding-left: 16px;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .user-name {
    font-weight: 500;
    color: #333;
  }

  .comment-time {
    color: #8c8c8c;
    font-size: 12px;
  }

  .comment-content {
    color: #262626;
    line-height: 1.5;
  }

  .comment-actions {
    margin-top: 8px;
    display: flex;
    gap: 16px;
  }
`;

//
const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const CommentTime = styled.span`
  color: #8c8c8c;
  font-size: 12px;
  margin-left: auto;
`;

const CommentContent = styled.div`
  color: #262626;
  font-size: 14px;
  line-height: 1.6;
  margin: 8px 0;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #489077;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: rgba(72, 144, 119, 0.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  align-items: center;
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
    width: 18px;
    height: 18px;
  }
`;
const ImagesContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0;
`;

const CommentImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  margin: 8px 0;
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;

  &:hover .image-controls {
    opacity: 1;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;
const CommentItem = ({
  comment,
  parentComment,
  onLike,
  onUpdate,
  onDelete,
  onReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [images, setImages] = useState(comment.images.$values);

  const myInfo = useSelector((states) => states.auth.myInfo);
  const getImageUrl = (imageUrl) => {
    if (imageUrl?.includes("https://auctionaot.blob.core.windows.net")) {
      return imageUrl + process.env.NEXT_PUBLIC_IMAGE_POSTFIX;
    }
    return imageUrl;
  };
  const handleImageRemove = (imageId) => {
    setImages((prev) => prev.filter((img) => img.imageId !== imageId));
  };
  const handleImageChange = (e) => {
    setImages([]);
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file: file,
            imageId: Math.random().toString(),
            preview: reader.result,
            imageUrl: URL.createObjectURL(file),
          });
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(imagePromises).then((images) => {
      setImages((prev) => [...prev, ...images]);
    });
  };
  const handleLikeClick = () => {
    onLike(comment.reviewId);
  };

  const handleSaveEdit = () => {
    onUpdate(comment.reviewId, {
      content: editedContent,
      images: images,
    });
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(comment.reviewId);
  };

  const handleReplyClick = () => {
    onReply(comment, parentComment);
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };
  return (
    <CommentItemStyledComponent key={comment.reviewId}>
      <CommentHeader>
        <UserAvatar
          src={
            comment?.owner?.avatar +
            "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-03-01T11:25:30Z&st=2024-11-27T03:25:30Z&spr=https,http&sig=TzFLXueNKkP0OTxYZK%2BqIMnImdsxb8e4NP2LRAW4WHY%3D"
          }
          alt={comment?.owner?.username}
        />
        <UserName>{comment?.owner?.username}</UserName>
        <CommentTime>{formatDateTime(comment.updatedAt)}</CommentTime>
      </CommentHeader>
      {isEditing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <ImageGrid>
            {images.map((image) => (
              <ImageWrapper key={image.imageId}>
                <StyledImage
                  src={getImageUrl(image.imageUrl)}
                  alt="Comment image"
                />
                <button
                  className="image-controls"
                  onClick={() => handleImageRemove(image.imageId)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#ff4d4f",
                    border: "1px solid #ff4d4f",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  ×
                </button>
              </ImageWrapper>
            ))}
          </ImageGrid>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{
              marginTop: "8px",
              padding: "8px",
              border: "1px dashed #ddd",
              borderRadius: "4px",
            }}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              width: "100%",
              minHeight: "60px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <ActionButton onClick={handleSaveEdit}>Save</ActionButton>
            <ActionButton onClick={handleCancelEdit}>Cancel</ActionButton>
          </div>
        </div>
      ) : (
        <>
          <ImageGrid>
            {images.map((image) => (
              <ImageWrapper key={image.imageId}>
                <StyledImage
                  src={getImageUrl(image.imageUrl)}
                  alt="Comment image"
                />
              </ImageWrapper>
            ))}
          </ImageGrid>
          <CommentContent>{comment.content}</CommentContent>
        </>
      )}
      <ActionButtons>
        <InteractionButton
          onClick={handleLikeClick}
          style={{ color: comment.isLiked ? "#f43f5e" : "#6c757d" }}
        >
          <FontAwesomeIcon
            icon={comment.isLiked ? faHeartSolid : faHeartRegular}
          />
          {comment.likesCount} Thích
        </InteractionButton>

        <InteractionButton onClick={handleReplyClick} style={{ color: "#666" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
          Phản hồi
        </InteractionButton>

        {myInfo?.userId == comment?.owner?.userId && !isEditing && (
          <>
            <ActionButton onClick={handleEditClick}>Edit</ActionButton>
            <ActionButton onClick={handleDeleteClick}>Delete</ActionButton>
          </>
        )}
      </ActionButtons>
      {comment.subComments.$values &&
        comment.subComments.$values.length > 0 && (
          <div className="sub-comments">
            {comment.subComments.$values.map((subComment) => (
              <div data-comment-id={comment.reviewId}>
                <CommentItem
                  key={subComment.reviewId}
                  comment={subComment}
                  parentComment={comment}
                  onLike={onLike}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onReply={onReply}
                />
              </div>
            ))}
          </div>
        )}
    </CommentItemStyledComponent>
  );
};

export default CommentItem;
