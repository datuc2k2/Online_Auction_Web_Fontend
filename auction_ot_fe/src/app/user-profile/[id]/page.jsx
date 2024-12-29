"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PostTab from "./PostTab";
import AuctionTab from "./AuctionTab";
import AuctionReviewTab from "./AuctionReviewTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookMessenger,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { CommonLayout } from "@/layout/CommonLayout";
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
const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;
const SocialIconButton = styled.button`
  min-width: 40px;
  height: 40px;
  border-radius: 6px;
  border: none;
  background: #0a7cff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  transition: all 0.3s;

  &:hover {
    background: #0067db;
    transform: translateY(-2px);
  }

  span {
    font-weight: 500;
  }
`;
const UserProfilePage = ({ params }) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("posts");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5208/api/Account/OtherUserInfor/${id}`
        );
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [id]);
  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return <PostTab userId={id} />;
      case "auctions":
        return <AuctionTab userId={id} />;
      case "ratings":
        return <AuctionReviewTab userId={id} />;
      default:
        return <div>Nội dung bài đăng</div>;
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarSection>
          <Avatar>
            <img
              src={
                userProfile?.avatar +
                  "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-03-01T11:25:30Z&st=2024-11-27T03:25:30Z&spr=https,http&sig=TzFLXueNKkP0OTxYZK%2BqIMnImdsxb8e4NP2LRAW4WHY%3D" ||
                "default-avatar-url"
              }
              alt="User avatar"
            />
          </Avatar>
          <div style={{position: 'relative'}}>
            <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#01AA85', marginRight: 8 }} />
            </div>
          </div>
          <UserInfo>
            <Username>{userProfile?.username || "Loading..."}</Username>
            <JoinDate>
              Tham gia từ:{" "}
              {userProfile?.createdAt
                ? new Date(userProfile.createdAt).toLocaleDateString()
                : ""}
            </JoinDate>
            <UserStats>
              <Stat>
                <Label>Trạng thái:</Label>
                <Value>
                  {userProfile?.isActive ? "Đang hoạt động" : "Không hoạt động"}
                </Value>
              </Stat>
              <Stat>
                <Label>Đăng nhập lần cuối:</Label>
                <Value>{formatDateTime(userProfile?.lastLogin)}</Value>
              </Stat>
            </UserStats>
            <SocialIcons>
              <SocialIconButton
                onClick={() =>
                  window.open("https://m.me/" + userProfile?.facebookId)
                }
              >
                <FontAwesomeIcon icon={faFacebookMessenger} />
                <span>Nhắn tin</span>
              </SocialIconButton>
            </SocialIcons>
          </UserInfo>
        </AvatarSection>
      </ProfileHeader>
      <TabsContainer>
        <TabList>
          <TabButton
            active={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
          >
            Bài đăng
          </TabButton>
          <TabButton
            active={activeTab === "auctions"}
            onClick={() => setActiveTab("auctions")}
          >
            Phiên đấu giá
          </TabButton>
          <TabButton
            active={activeTab === "ratings"}
            onClick={() => setActiveTab("ratings")}
          >
            Đánh giá
          </TabButton>
        </TabList>
        <TabContent>{renderTabContent()}</TabContent>
      </TabsContainer>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileHeader = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const AvatarSection = styled.div`
  display: flex;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: 24px;
  margin-bottom: 8px;
`;

const JoinDate = styled.div`
  color: #666;
  margin-bottom: 16px;
`;

const UserStats = styled.div`
  display: flex;
  gap: 24px;
`;

const Stat = styled.div`
  display: flex;
  gap: 8px;
`;

const Label = styled.span`
  color: #666;
`;

const Value = styled.span`
  font-weight: 500;
`;

const TabsContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: ${(props) => (props.active ? "#489077" : "inherit")};
  border-bottom: 2px solid
    ${(props) => (props.active ? "#489077" : "transparent")};
  transition: all 0.3s;

  &:hover {
    color: #489077;
  }
`;

const TabContent = styled.div`
  padding: 0px;
`;

export default CommonLayout(React.memo(UserProfilePage));
