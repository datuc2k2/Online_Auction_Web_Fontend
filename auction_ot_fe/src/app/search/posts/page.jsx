"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "../_styles";
import PostList from "../_PostList";

const PostsSearchPage = () => {
  const [posts, setPosts] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchUsers = async (searchKeyword) => {
    try {
      const response = await fetch(
        `http://localhost:5208/api/Search/posts?keyword=${searchKeyword}`
      );
      const data = await response.json();
      setPosts(data.$values);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (searchParams.get("keyword")) {
      searchUsers(searchParams.get("keyword"));
    }
  }, [searchParams]);

  return (
    <Container>
      {posts.length === 0 ? <p>No posts found.</p> : <PostList posts={posts} />}
    </Container>
  );
};

export default PostsSearchPage;
