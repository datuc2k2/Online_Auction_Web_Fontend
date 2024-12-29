import { Spin } from 'antd';
import { AuthLayout } from '../app/container/authentication/Index';
import React, { FC, lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from '../components/header/Header';

const Login = lazy(() => import('../app/container/authentication/overview/SignIn'));

// interface IAuthRoot {}

// const AuthRoot: FC<IAuthRoot> = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     (!token || token === '') && navigate('/');
//   });

//   return <></>;
// };

console.log('VAOOOOOOO1312312');

interface Hi {

}

const FrontendRoutes = React.memo(() => {
  return (
    <Suspense
      fallback={
        <div className="spin">
          <Spin />
        </div>
      }
    >
      <Header />
    </Suspense>
  );
});

export default AuthLayout(FrontendRoutes);
