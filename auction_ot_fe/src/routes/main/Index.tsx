import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import HomeRoute from './Home';
import { Spin } from 'antd';

const NotFound = lazy(() => import('../../app/container/pages/404'));

interface IMain {}

const Main = React.memo<IMain>(() => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Suspense
      fallback={
        <div className="spin">
          <Spin />
        </div>
      }
    >
      <Routes>
        <Route path="/*" element={<Navigate to="home" replace />} />
        <Route index path="home/*" element={<HomeRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
});

export default Main;
