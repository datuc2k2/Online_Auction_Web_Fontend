'use client';

import { useEffect, useState } from 'react';
import { Input, Button, Avatar, message, Checkbox, Select, Modal } from 'antd';
import { Post } from './models/post';
import { PostStatus } from './utils/enum';
import { PostService } from './services/post_services';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/RootReducer';
import { DEFAULT_AVATAR } from './utils/constant';
import { openNotification } from '@/utility/Utility';
import { fetchCategory } from '@/store/auction/Actions';

const { TextArea } = Input;
const { Option } = Select;

const PostCreate = ({ onCancel }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [categoryId, setCategoryId] = useState(0);
  const [postCategory, setPostCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const myInfo = useSelector((states: RootState) => states.auth.myInfo) ;

  const categoryData = useSelector(
    (state: RootState) => state.auction.categoryData
  );

  useEffect(() => {
    fetchPostCategory();
  }, [])

  const fetchPostCategory = async () => {
    const data = await PostService.getPostCategory();
    setPostCategory(data);
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      message.error('Vui lòng nhập nội dung cho bài viết của bạn');
      return;
    }
    

    // if (!myInfo) {
    //   message.error('Không tìm thấy thông tin người dùng');
    //   return;
    // }

    setLoading(true);
    try {
      ///TODO: update owner using myInfo
      const owner = {
        user_id: myInfo?.userId+'',
        name: myInfo?.username+'',
        avatar: myInfo?.userProfile?.avatar + '' +process.env.NEXT_PUBLIC_IMAGE_POSTFIX,
      };

      const newPost = {
        title: title,
        content: content,
        file: file,
        category: categoryId,
      }

      await PostService.createPost(newPost);
      onCancel();
      openNotification("success", "Thành công", "Bài viết đã được tạo thành công, vui lòng chờ phê duyệt.");
      setContent('');
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      openNotification("error", "", "Không thể tạo bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
      <Modal
        visible={true}
        footer={null}
        onCancel={onCancel}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <Avatar 
            src={myInfo?.userProfile?.avatar+''+process.env.NEXT_PUBLIC_IMAGE_POSTFIX || DEFAULT_AVATAR}
            alt="Người dùng hiện tại"
            size={46}
            style={{ border: '2px solid #f0f0f0' }}
          />
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0
          }}>Tạo bài viết mới</h2>
        </div>

        <TextArea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề"
          autoSize={{ minRows: 1, maxRows: 2 }}
          style={{
            marginBottom: '20px',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '15px',
            border: '1px solid #e6e6e6',
            resize: 'none'
          }}
        />

        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nội dung"
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{
            marginBottom: '20px',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '15px',
            border: '1px solid #e6e6e6',
            resize: 'none'
          }}
        />

        

          <div style={{ textAlign: 'center', }}>
            {/* Image Preview */}
            {file && (
              <div style={{ marginBottom: '20px', userSelect: 'none' }}>
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Preview" 
                  style={{
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '12px', 
                    border: '2px solid #ddd',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }} 
                />
              </div>
            )}

            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
              <Select
                style={{ height: 45, fontSize: "15px", width: '50%', borderRadius: 12}}
                placeholder='Thể loại'
                onChange={(v) => setCategoryId(v)}
              >
                {postCategory?.map((m) => {
                  return <Option value={m?.id}>{m?.name}</Option>;
                })}
              </Select>


              {/* Custom File Input */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <label 
                  htmlFor="file-upload" 
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    border: '2px solid #4CAF50',
                    borderRadius: '12px',
                    backgroundColor: '#f0fdf4',
                    color: '#4CAF50',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e8f5e9')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                >
                  Chọn hình ảnh
                </label>
                <input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept="image/*" // Only accept image files
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
        </div>


        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Button 
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!content.trim() || !title.trim() || !file || !categoryId}
            style={{
              backgroundColor: '#0095f6',
              borderColor: '#0095f6',
              borderRadius: '12px',
              height: '40px',
              padding: '0 24px',
              fontSize: '15px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 149, 246, 0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            Đăng
          </Button>
        </div>
        </Modal>
  );
};

export default PostCreate;
