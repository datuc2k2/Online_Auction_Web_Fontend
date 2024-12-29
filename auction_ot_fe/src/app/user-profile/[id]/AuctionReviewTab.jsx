import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReviewCard from "./ReviewCard";
import ReviewCommentSection from "./ReviewCommentSection";
import { useSelector } from "react-redux";
import axios from "@/store/SetupAxios";
import { Form, Input, Rate, Button } from "antd";
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #1d586d;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const AuctionReviewTab = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const myInfo = useSelector((states) => states.auth.myInfo);
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`api/Users/${userId}/reviews`);

        setReviews(data.$values);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);
  return (
    <div>
      {isLoading ? (
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      ) : (
        <>
          {myInfo && (
            <div
              style={{
                marginBottom: "20px",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3>Đánh giá của bạn</h3>
              <Form
                form={form}
                initialValues={{
                  rating: 5,
                }}
                onFinish={async (values) => {
                  try {
                    setSubmitLoading(true);
                    const { data } = await axios.post(
                      `api/Users/${userId}/reviews`,
                      {
                        comment: values.content,
                        rating: values.rating,
                      }
                    );

                    form.resetFields();
                    setReviews((prev) => [data, ...prev]);
                  } catch (error) {
                    console.error("Error creating review:", error);
                  } finally {
                    setSubmitLoading(false);
                  }
                }}
              >
                <Form.Item name="rating" rules={[{ required: true }]}>
                  <Rate />
                </Form.Item>
                <Form.Item name="content" rules={[{ required: true }]}>
                  <Input.TextArea rows={4} placeholder="Đánh giá của bạn..." />
                </Form.Item>
                <Button
                  loading={submitLoading}
                  type="primary"
                  htmlType="submit"
                >
                  Đăng
                </Button>
              </Form>
            </div>
          )}
          {reviews.length === 0 ? (
            <p>Không có đánh giá nào.</p>
          ) : (
            reviews?.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onCommentClick={() => {
                  setSelectedReviewId(review.reviewId);
                  setShowCommentModal(true);
                }}
              />
            ))
          )}

          {showCommentModal && (
            <Overlay onClick={() => setShowCommentModal(false)}>
              <Modal onClick={(e) => e.stopPropagation()}>
                <ReviewCommentSection reviewId={selectedReviewId} />
              </Modal>
            </Overlay>
          )}
        </>
      )}
    </div>
  );
};

export default AuctionReviewTab;
