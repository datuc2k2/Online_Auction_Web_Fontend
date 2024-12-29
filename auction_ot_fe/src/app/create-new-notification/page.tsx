
import React from 'react'
import { CommonLayout } from '@/layout/CommonLayout';
import CreateNotification from '../posts/Notification';

function CreateNewNotification() {
  return (
    <>
        <CreateNotification />
    </>
  )
}

export default CommonLayout(React.memo(CreateNewNotification));
