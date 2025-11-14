// frontend/src/components/PrivateRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // 로딩 중 (토큰 확인 중)
    return <div className="auth-container">
        <div className="loading-spinner" style={{ borderTopColor: '#fff' }} />
    </div>;
  }

  if (!isLoggedIn) {
    // 로그인되지 않았다면 로그인 화면으로 리디렉션
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;