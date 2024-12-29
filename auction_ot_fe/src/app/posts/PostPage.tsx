'use client';

import { useEffect, useState } from 'react';
import PostBoxItem from './components/PostBoxItem';
import { Post } from './models/post';
import { PostService } from './services/post_services';
import { Button, Modal, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import PostCreate from './PostCreate';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/RootReducer';

const PostPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const postsPerPage = 6;
  const [state, setState] = useState({
    IsOpenModalCreateNewPost: false,
  })
  const myInfo = useSelector((states: RootState) => states.auth.myInfo);
  useEffect(() => {
    const fetchPosts = async () => {
      try {        
        const posts = await PostService.getPosts(false);
        console.log("post in post page", posts);
        posts.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
        setPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className="text-2xl font-bold mb-6">Bài viết mới nhất</h1>
        <Button
          onClick={() => {
            if(myInfo) {
              setState({
                ...state, 
                IsOpenModalCreateNewPost: true
              })
            } else {
              router.push('/login')
            }
          }}
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          style={{
            backgroundColor: '#1890ff',
            border: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#40a9ff';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1890ff';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow =
              '0 0 0 2px rgba(24, 144, 255, 0.6)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <PostBoxItem
            key={post.post_id}
            post={post}
          />
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Pagination
          current={currentPage}
          total={posts.length}
          pageSize={postsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
      {
        state.IsOpenModalCreateNewPost &&
        <PostCreate onCancel={() => setState({ ...state, IsOpenModalCreateNewPost: false })} />
      }
    </div>
  );
};

export default PostPage;
