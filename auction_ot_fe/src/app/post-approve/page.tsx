
import React from 'react'
import { CommonLayout } from '@/layout/CommonLayout';
import PostApproval from '../posts/PostApproval';

function PostApprove() {
  return (
    <>
        <PostApproval />
    </>
  )
}

export default CommonLayout(React.memo(PostApprove));
