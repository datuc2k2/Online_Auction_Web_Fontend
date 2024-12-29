"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, SectionTitle } from "../_styles";
import UserList from "../_UserList";
import AuctionGrid from "../_AuctionGrid";
import PostList from "../_PostList";
import { Spin } from "antd";

const SearchTopPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState({
    auctions: false,
    users: false,
    posts: false,
  });
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    if (keyword) {
      // Auctions loading and fetch
      setLoading((prev) => ({ ...prev, auctions: true }));
      fetch(`http://localhost:5208/api/Search/auctions?keyword=${keyword}`)
        .then((res) => res.json())
        .then((data) => setAuctions(data.$values?.slice(0, 4) || []))
        .catch((error) => console.error("Error fetching auctions:", error))
        .finally(() => setLoading((prev) => ({ ...prev, auctions: false })));

      // Users loading and fetch
      setLoading((prev) => ({ ...prev, users: true }));
      fetch(`http://localhost:5208/api/Search/users?keyword=${keyword}`)
        .then((res) => res.json())
        .then((data) => setUsers(data.$values?.slice(0, 4) || []))
        .catch((error) => console.error("Error fetching users:", error))
        .finally(() => setLoading((prev) => ({ ...prev, users: false })));

      // Posts loading and fetch
      setLoading((prev) => ({ ...prev, posts: true }));
      fetch(`http://localhost:5208/api/Search/posts?keyword=${keyword}`)
        .then((res) => res.json())
        .then((data) => setPosts(data.$values?.slice(0, 4) || []))
        .catch((error) => console.error("Error fetching posts:", error))
        .finally(() => setLoading((prev) => ({ ...prev, posts: false })));
    }
  }, [keyword]);

  return (
    <Container>
      {(loading.auctions || auctions.length > 0) && (
        <>
          {loading.auctions ? (
            <Spin />
          ) : (
            <>
              <SectionTitle>Phiên đấu giá</SectionTitle>
              <AuctionGrid auctions={auctions} />
            </>
          )}
        </>
      )}

      {(loading.users || users.length > 0) && (
        <>
          {loading.users ? (
            <Spin />
          ) : (
            <>
              <SectionTitle>Người dùng</SectionTitle>
              <UserList users={users} />
            </>
          )}
        </>
      )}

      {(loading.posts || posts.length > 0) && (
        <>
          {loading.posts ? (
            <Spin />
          ) : (
            <>
              <SectionTitle>Bài đăng liên quan</SectionTitle>
              <PostList posts={posts} />
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchTopPage;
