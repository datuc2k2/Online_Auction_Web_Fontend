import { useEffect, useState } from "react";
import axios from "axios";
import PostBoxItem from "@/app/posts/components/PostBoxItem";

const PostTab = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5208/api/Posts/getPostByUserId/${userId}`
        );
        setPosts(response.data.data.$values);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => <PostBoxItem key={post.post_id} post={post} />)
      )}
    </div>
  );
};

export default PostTab;
