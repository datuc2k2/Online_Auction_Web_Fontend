import { CommonLayout } from "@/layout/CommonLayout";
import React from "react";
import PostBoxItem from "../posts/components/PostBoxItem";

function BlogDetail() {
  return (
    <>
      {/* <div style={{ marginTop: "30px" }}>
        <h1>Bài viết liên quan</h1>
        <PostBoxItem key={post.post_id} post={post} />
      </div> */}
    </>
  );
}
export default CommonLayout(React.memo(BlogDetail));
