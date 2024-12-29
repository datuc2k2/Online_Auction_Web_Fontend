"use client";
import { usePathname, useRouter } from "next/navigation";
import Header1 from "@/components/header/Header1";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faGavel,
  faUser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const SearchPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  padding: 24px;
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
`;
const Sidebar = styled.div`
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding-top: 16px;
`;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${(props) => (props.isActive ? "#489077" : "transparent")};
  color: ${(props) => (props.isActive ? "white" : "inherit")};

  &:hover {
    background-color: ${(props) => (props.isActive ? "#489077" : "#f5f5f5")};
  }
`;

const ResultsContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export default function SearchPage({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const keyword = searchParams.get("keyword");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    {
      path: "/search/top",
      icon: <FontAwesomeIcon icon={faSearch} className="result-icon" />,
      label: "Tất cả",
    },
    {
      path: "/search/posts",
      icon: <FontAwesomeIcon icon={faFileLines} className="result-icon" />,
      label: "Bài đăng",
    },
    {
      path: "/search/people",
      icon: <FontAwesomeIcon icon={faUser} className="result-icon" />,
      label: "Mọi người",
    },
    {
      path: "/search/auctions",
      icon: <FontAwesomeIcon icon={faGavel} className="result-icon" />,
      label: "Đấu giá",
    },
  ];
  console.log(pathname);
  return (
    <SearchPageContainer>
      <Header1 />
      <MainContent>
        <Sidebar>
          <h2
            style={{
              padding: "0 16px",
              marginBottom: "16px",
              fontSize: "1.5rem",
            }}
          >
            Kết quả tìm kiếm cho
            <br />
            <span style={{ fontSize: "1rem", fontWeight: 400 }}>{keyword}</span>
          </h2>
          {filters.map((filter) => (
            <FilterItem
              key={filter.path}
              isActive={pathname === filter.path}
              onClick={() => router.push(`${filter.path}?keyword=${keyword}`)}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </FilterItem>
          ))}
        </Sidebar>
        <ResultsContainer>{children}</ResultsContainer>
      </MainContent>
    </SearchPageContainer>
  );
}
