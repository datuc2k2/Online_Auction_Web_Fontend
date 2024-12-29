import { AuctionGrid as StyledAuctionGrid } from "./_styles";
import PostItem from "./_PostItem";
const PostList = ({ posts }) => (
  <StyledAuctionGrid>
    {posts.map((post) => (
      <PostItem key={post.postId} post={post} />
    ))}
  </StyledAuctionGrid>
);
export default PostList;
