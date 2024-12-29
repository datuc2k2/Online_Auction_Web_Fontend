import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CommentItem from "./CommentItem";
import axios from "@/store/SetupAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const CommentContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const CommentInput = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 12px;
  border: 2px solid #d9d9d9;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;

  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #489077;
    box-shadow: 0 0 0 2px rgba(72, 144, 119, 0.1);
  }

  &:hover {
    border-color: #489077;
  }
`;
const SubmitButton = styled.button`
  padding: 8px 16px;
  background: #489077;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: fit-content;

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #40a9ff;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 600px;
  overflow-y: auto;
  padding-right: 8px;

  .nested-comments {
    margin-left: 24px;
    border-left: 2px solid #e8e8e8;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ReplyingToBar = styled.div`
  background: #f0f2f5;
  padding: 4px 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #d9d9d9;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageUploadButton = styled.button`
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #489077;
  padding: 8px;

  &:hover {
    color: #40a9ff;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
  overflow-x: auto;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;

  .image-container {
    position: relative;
    flex-shrink: 0;

    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }

    button {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #ff4d4f;
      color: white;
      border: 2px solid #fff;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;

      &:hover {
        background: #ff7875;
        transform: scale(1.1);
      }
    }
  }

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #489077;
    border-radius: 3px;
  }
`;
const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #489077;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;
const ReviewCommentSection = ({ reviewId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const commentsListRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState({
    parentComment: null,
    currentComment: null,
  });
  const [comments, setComments] = useState([]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [newComment, setNewComment] = useState("");
  const myInfo = useSelector((states) => states.auth.myInfo);
  const router = useRouter();
  const [pendingComments, setPendingComments] = useState([]);

  const scrollToLatestComment = () => {
    if (commentsListRef.current) {
      const lastComment = commentsListRef.current.lastElementChild;
      if (lastComment) {
        lastComment.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  const scrollToComment = (commentId) => {
    if (commentsListRef.current) {
      const commentElement = commentsListRef.current.querySelector(
        `[data-comment-id="${commentId}"]`
      );
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`api/Users/comments/${reviewId}`);

      setComments(data.$values);
      scrollToLatestComment();
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const updateUIOptimistically = (newComment) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
      reviewId: tempId,
      content: newComment,
      owner: {
        user_id: myInfo.userId.toString(),
        fullName: myInfo.fullName,
        avatar: myInfo.avatar,
      },
      liked: false,
      likesCount: 0,
      created_at: new Date().toISOString(),
      parentId: replyingTo.currentComment?.reviewId || null,
      subComments: { $values: [] },
      images: { $values: [] },
    };

    if (replyingTo.currentComment) {
      const topLevelParentId =
        replyingTo.parentComment?.reviewId ||
        replyingTo.currentComment.reviewId;
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.reviewId === topLevelParentId) {
            return {
              ...comment,
              subComments: {
                $values: [...comment.subComments.$values, optimisticComment],
              },
            };
          }
          return comment;
        })
      );
      scrollToComment(topLevelParentId);
    } else {
      setComments((prev) => [...prev, optimisticComment]);
      scrollToLatestComment();
    }

    setPendingComments((prev) => [...prev, { tempId, comment: newComment }]);
  };

  const handleImageUpload = (e) => {
    setSelectedImages([]);
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
      setSelectedImages((prev) => [...prev, ...images]);
    });
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmitComment = () => {
    if (!myInfo) {
      router.push("/login");
      return;
    }
    updateUIOptimistically(newComment);
    setNewComment("");
    setReplyingTo({ parentComment: null, currentComment: null });
  };

  const handleReplyComment = (comment, parentComment = null) => {
    if (!myInfo) {
      router.push("/login");
      return;
    }
    setReplyingTo({
      parentComment: parentComment,
      currentComment: comment,
    });
    document.querySelector("textarea").focus();
  };
  const handleLikeComment = async (commentId) => {
    if (!myInfo) {
      router.push("/login");
      return;
    }
    const updateLikeStatus = (commentsList) => {
      return commentsList.map((comment) => {
        if (comment.reviewId === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likesCount: !comment.likesCount
              ? comment.likesCount + 1
              : comment.likesCount - 1,
          };
        }
        if (comment.subComments.$values?.length > 0) {
          return {
            ...comment,
            subComments: {
              $values: updateLikeStatus(comment.subComments.$values),
            },
          };
        }
        return comment;
      });
    };

    setComments(updateLikeStatus(comments));

    try {
      await axios.get(`api/Users/toggle/${commentId}`);
    } catch (error) {
      console.error("Failed to update comment:", error);
      // Nếu có lỗi xảy ra, bạn có thể phục hồi lại state hoặc thông báo cho người dùng
    }
  };
  const handleUpdateComment = async (commentId, data) => {
    if (!myInfo) {
      router.push("/login");
      return;
    }
    const previousComments = [...comments];

    const updateContent = (commentsList) => {
      return commentsList.map((comment) => {
        if (comment.reviewId === commentId) {
          return {
            ...comment,
            content: data.content,
            images: { $values: data.images },
          };
        }
        if (comment.subComments.$values?.length > 0) {
          return {
            ...comment,
            subComments: {
              $values: updateContent(comment.subComments.$values),
            },
          };
        }
        return comment;
      });
    };

    setComments(updateContent(comments));

    try {
      const formData = new FormData();
      formData.append("content", data.content);

      data.images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });

      await axios.put(`api/Users/comments/${commentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      setComments(previousComments);
      console.error("Failed to update comment:", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!myInfo) {
      router.push("/login");
      return;
    }
    const deleteFromComments = (commentsList) => {
      return commentsList.filter((comment) => {
        if (comment.reviewId === commentId) {
          return false;
        }
        if (comment.subComments.$values?.length > 0) {
          comment.subComments.$values = deleteFromComments(
            comment.subComments.$values
          );
        }
        return true;
      });
    };

    setComments(deleteFromComments(comments));

    try {
      await axios.delete(`api/Users/comments/${commentId}`);
      console.log("Comment deleted from server successfully.");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // Nếu có lỗi xảy ra, bạn có thể phục hồi lại state hoặc thông báo cho người dùng
    }
  };
  useEffect(() => {
    const submitToBackend = async () => {
      if (pendingComments.length > 0) {
        const { tempId, comment } = pendingComments[0];
        try {
          const formData = new FormData();
          formData.append("userId", myInfo.userId);
          formData.append("comment", comment);
          formData.append(
            "parentId",
            replyingTo.currentComment?.reviewId || reviewId
          );

          // Add images to formData
          selectedImages.forEach((image) => {
            formData.append("images", image.file);
          });

          const { data } = await axios.post("api/Users/comments", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Update comments with real data from backend
          setComments((prevComments) =>
            prevComments.map((comment) => {
              if (comment.reviewId === tempId) {
                return { ...data };
              }
              if (comment.subComments.$values?.length > 0) {
                return {
                  ...comment,
                  subComments: {
                    $values: comment.subComments.$values.map((subComment) =>
                      subComment.reviewId === tempId ? { ...data } : subComment
                    ),
                  },
                };
              }
              return comment;
            })
          );

          // Remove from pending after successful update
          setSelectedImages([]);
          setPendingComments((prev) =>
            prev.filter((item) => item.tempId !== tempId)
          );
        } catch (error) {
          console.error("Error submitting comment:", error);
          setComments((prevComments) =>
            prevComments.filter((comment) => {
              if (comment.reviewId === tempId) {
                return false;
              }
              if (comment.subComments.$values?.length > 0) {
                comment.subComments.$values =
                  comment.subComments.$values.filter(
                    (subComment) => subComment.reviewId !== tempId
                  );
              }
              return true;
            })
          );
          setSelectedImages([]);
          setPendingComments((prev) =>
            prev.filter((item) => item.tempId !== tempId)
          );
        }
      }
    };

    submitToBackend();
  }, [pendingComments]);

  useEffect(() => {
    if (reviewId) fetchComments();
  }, [reviewId]);

  return (
    <CommentContainer>
      <CommentsList ref={commentsListRef}>
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : (
          comments?.map((comment) => (
            <div data-comment-id={comment.reviewId}>
              <CommentItem
                key={comment.reviewId}
                comment={comment}
                onLike={handleLikeComment}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
                onReply={handleReplyComment}
              />
            </div>
          ))
        )}
      </CommentsList>
      <CommentInput>
        <InputWrapper>
          {replyingTo.currentComment && (
            <ReplyingToBar>
              <span>
                Replying to {replyingTo.currentComment?.owner?.username}
              </span>
              <ActionButton
                onClick={() =>
                  setReplyingTo({ parentComment: null, currentComment: null })
                }
              >
                Cancel
              </ActionButton>
            </ReplyingToBar>
          )}
          <TextAreaWrapper>
            {selectedImages.length > 0 && (
              <ImagePreview>
                {selectedImages.map((image, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={image.preview}
                      alt={`Upload preview ${index + 1}`}
                    />
                    <button onClick={() => removeImage(index)}>×</button>
                  </div>
                ))}
              </ImagePreview>
            )}
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyingTo ? `Write a reply...` : "Write a comment..."
              }
            />
            <input
              type="file"
              id="imageUpload"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <ImageUploadButton
              onClick={() => document.getElementById("imageUpload").click()}
            >
              <FontAwesomeIcon icon={faImage} />
            </ImageUploadButton>
          </TextAreaWrapper>
        </InputWrapper>

        <SubmitButton
          onClick={handleSubmitComment}
          disabled={!newComment.trim()}
        >
          Comment
        </SubmitButton>
      </CommentInput>
    </CommentContainer>
  );
};

export default ReviewCommentSection;
