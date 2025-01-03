import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RootState } from '../../store/RootReducer';

interface IProtectedRoute {
  Component: FC;
  path: string;
}

export const ProtectedRoute: FC<IProtectedRoute> = ({ Component, path }) => {
  const myInfo = useSelector((state: RootState) => state.auth.myInfo);

  return myInfo ? (
    <Routes>
      <Route element={<Component />} path={path} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/main" element={<Navigate to="/" />} />
    </Routes>
  );
};
