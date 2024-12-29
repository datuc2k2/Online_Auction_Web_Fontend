'use client'
import React, { useEffect, useState } from 'react';
import { Post } from './models/post';
import {
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  Typography,
  Box,
  SelectChangeEvent,
  Chip,
  Avatar,
} from '@mui/material';
import { getPostStatusText, PostStatus } from './utils/enum';
import { PostService } from './services/post_services';
import { styled } from '@mui/material/styles';
import Breadcrumb from "@/components/Breadcrumb/page";

const StyledSelect = styled(Select)({
  "& .MuiSelect-select": {
    paddingTop: "6px",
    paddingBottom: "6px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    fontSize: "0.875rem",
    textAlign: "center",
  },
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#bdbdbd",
    },
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: "0.875rem",
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  justifyContent: "center",
});

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
    borderBottom: "2px solid #eee",
    paddingBottom: "16px",
  },
  card: {
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  postInfo: {
    width: "100%",
  },
  statusSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    alignSelf: "flex-end",
  },
  authorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  authorDetails: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  avatar: {
    width: 40,
    height: 40,
    border: "2px solid #fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  date: {
    color: "#666",
    fontSize: "0.875rem",
  },
  content: {
    marginTop: "8px",
    wordWrap: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
    overflowWrap: "break-word",
    maxHeight: "150px",
    overflow: "auto",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    fontSize: "0.875rem",
    lineHeight: "1.5",
    color: "#424242",
  },
  statusChip: {
    minWidth: "100px",
    "& .MuiChip-label": {
      display: "flex",
      justifyContent: "center",
      width: "100%",
    },
  },
  select: {
    minWidth: "130px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "4px",
  },
};

const PostApproval: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await PostService.getPosts(true);
        setPosts(response);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleStatusChange = async (postId: string, newStatus: PostStatus) => {
    try {
      await PostService.updateStatusPost(postId, newStatus);
      setPosts(
        posts.map((post) =>
          post.post_id === postId ? { ...post, status: newStatus } : post
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái bài viết:", error);
    }
  };

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case PostStatus.APPROVED:
        return "#4caf50";
      case PostStatus.REJECTED:
        return "#f44336";
      case PostStatus.PENDING:
        return "#ff9800";
      default:
        return "#999";
    }
  };
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Phê duyệt bài đăng" },
  ];
  return (
    <div>
      <div style={{ marginTop: 50 }}>
        <Breadcrumb items={breadcrumbItems} />
        <h3
          style={{
            fontSize: "1.5em",
            fontWeight: "bold",
            color: "#333",
            margin: "20px 0",
            textAlign: "left",
            borderBottom: "2px solid #007bff",
            paddingBottom: "10px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Phê duyệt bài đăng
        </h3>
      </div>
      <Box sx={styles.container}>
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} key={post.post_id}>
              <Card sx={styles.card}>
                <CardContent sx={styles.cardContent}>
                  <Box sx={styles.postInfo}>
                    <Box sx={styles.authorInfo}>
                      <Avatar
                        alt={post.owner.name}
                        sx={styles.avatar}
                        src={
                          post.owner.avatar +
                          "" +
                          process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                        }
                      >
                        {post.owner.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={styles.authorDetails}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {post.owner.name}
                        </Typography>
                        <Typography sx={styles.date}>
                          {new Date(post.create_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <div style={{ marginBottom: "8px" }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          color: "#2d3748",
                        }}
                      >
                        {post.title}
                      </h3>
                    </div>

                    {/* Category Section */}
                    <div style={{ marginBottom: "16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          background: "#f0f4f8",
                          color: "#2d3748",
                          padding: "4px 12px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {post.category.name}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div style={{ marginBottom: "16px" }}>
                      <p
                        style={{
                          fontSize: "16px",
                          color: "#4a5568",
                          lineHeight: "1.5",
                        }}
                      >
                        {post.content}
                      </p>
                    </div>

                    {/* Image Section */}
                    {post.images && post.images[0] && (
                      <div
                        style={{ marginBottom: "16px", textAlign: "center" }}
                      >
                        <img
                          src={
                            post.images[0] +
                            process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                          }
                          alt="Post visual"
                          style={{
                            width: "100%",
                            maxWidth: "400px",
                            height: "auto",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    )}
                  </Box>

                  <Box sx={styles.statusSection}>
                    <Chip
                      label={getPostStatusText(post.status)}
                      sx={{
                        ...styles.statusChip,
                        bgcolor: getStatusColor(post.status),
                        color: "white",
                      }}
                    />
                    <StyledSelect
                      value={post.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as PostStatus;
                        handleStatusChange(post.post_id, newStatus);
                      }}
                      size="small"
                      sx={styles.select}
                    >
                      <StyledMenuItem value={PostStatus.PENDING}>
                        <Box sx={styles.menuItem}>
                          <Box
                            sx={{
                              ...styles.statusDot,
                              backgroundColor: getStatusColor(
                                PostStatus.PENDING
                              ),
                            }}
                          />
                          Đang chờ
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value={PostStatus.APPROVED}>
                        <Box sx={styles.menuItem}>
                          <Box
                            sx={{
                              ...styles.statusDot,
                              backgroundColor: getStatusColor(
                                PostStatus.APPROVED
                              ),
                            }}
                          />
                          Đã duyệt
                        </Box>
                      </StyledMenuItem>
                      <StyledMenuItem value={PostStatus.REJECTED}>
                        <Box sx={styles.menuItem}>
                          <Box
                            sx={{
                              ...styles.statusDot,
                              backgroundColor: getStatusColor(
                                PostStatus.REJECTED
                              ),
                            }}
                          />
                          Từ chối
                        </Box>
                      </StyledMenuItem>
                    </StyledSelect>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default PostApproval;
