import { Spin } from 'antd';
import { FC, Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../app/container/home/Home';

const NotFound = lazy(() => import('../../app/container/pages/404'));

interface IHomeRoute {}

const HomeRoute: FC<IHomeRoute> = () => {
  return (
    <Suspense
      fallback={
        <div className="spin">
          <Spin />
        </div>
      }
    >
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default HomeRoute;
