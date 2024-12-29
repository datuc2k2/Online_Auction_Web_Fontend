"use client"
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_AVATAR } from '../utils/constant';
import { Post } from '../models/post';
import { convertTime } from '../utils/convert_time';
import { Tooltip } from 'antd';

const PostItem = ({ post }: { post: Post }) => {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      // Kiểm tra xem chiều cao nội dung có vượt quá chiều cao line-clamp (line-height * 6)
      const isContentOverflow = element.scrollHeight > element.clientHeight;
      setIsOverflow(isContentOverflow);
    }
  }, [post.content]);

  return (
    <div className="post-card" style={{ backgroundColor: 'white', height: '300px', padding: '20px 10px', marginTop: '20px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div className="post-header d-flex align-items-center gap-3 mb-3">
        <div className="avatar">
          <img 
            src={post.owner.avatar+''+process.env.NEXT_PUBLIC_IMAGE_POSTFIX || DEFAULT_AVATAR}
            alt="Ảnh đại diện người dùng"
            style={{
              width: "40px",
              height: "40px", 
              objectFit: "cover",
              borderRadius: "50%"
            }}
          />
        </div>
        <div className="post-meta">
          <h6 className="mb-0">{post.owner.name}</h6>
          <small className="text-muted">{convertTime(post.create_at)}</small>
        </div>
      </div>

      <div className="post-content mb-3" style={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
        {/* TODO:: */}
        <Tooltip >
          <p ref={contentRef} style={{ 
            margin: 0, 
            fontSize: '16px',
            display: '-webkit-box',
            WebkitLineClamp: '6',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            position: 'relative'
          }}>
            {post.content}
            {isOverflow && (
              <span style={{
                display: 'inline-block',
                position: 'absolute',
                right: 0,
                bottom: 0,
                padding: '0 4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                paddingRight: 10
              }}>
                ...
              </span>
            )}
          </p>

        </Tooltip>
      </div>

      <div className="post-footer d-flex align-items-center gap-4" style={{ marginTop: 'auto' }}>
        <div className="d-flex align-items-center gap-1">
          <i className="bi bi-heart"></i>
          <span>{post.total_likes} lượt thích</span>
        </div>
        <div className="d-flex align-items-center gap-1">
          <i className="bi bi-chat"></i>
          <span>{post.comment_count} bình luận</span>
        </div>
      </div>
    </div>
  )
}

export default PostItem
