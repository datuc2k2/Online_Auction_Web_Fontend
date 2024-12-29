
import React from 'react'
import PostPage from '../posts/PostPage'
import { CommonLayout } from '@/layout/CommonLayout';

function PostList() {
  return (
    <>
        <PostPage/>
    </>
  )
}

export default CommonLayout(React.memo(PostList));
