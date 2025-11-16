// frontend/src/App.tsx (최종본)
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// 화면 컴포넌트들
import AuthScreen from './components/AuthScreen';
import MainScreen from './components/MainScreen';
import EncounterScreen from './components/EncounterScreen';
import PokedexScreen from './Pokedex';
import BadgeScreen from './BadgeScreen';
import DiaryListScreen from './DiaryListScreen'; // ⭐ 추가
import DiaryDetailScreen from './DiaryDetailScreen'; // ⭐ 추가
import type { ScreenName } from './types';

// Scaling 기준 해상도 (App.css와 일치)
const BASE_APP_WIDTH = 1000;
const BASE_APP_HEIGHT = 800;

// ⭐ App.tsx에서 모든 화면을 .App 컨테이너로 감싸고 스케일링을 처리합니다.
function AppWrapper({ children }: { children: React.ReactNode }) {
  const appContainerRef = useRef<HTMLDivElement>(null);

  // ⭐ Scaling 로직: 창 크기에 맞춰 컨테이너를 확대/축소
  useEffect(() => {
    const handleResize = () => {
      if (!appContainerRef.current) return;

      const root = document.getElementById('root');
      if (!root) return;

      const windowWidth = root.clientWidth;
      const windowHeight = root.clientHeight;

      const scaleX = windowWidth / BASE_APP_WIDTH;
      const scaleY = windowHeight / BASE_APP_HEIGHT;
      const scaleFactor = Math.min(scaleX, scaleY);

      // App.css에서 transform-origin: center center;가 적용되어야 합니다.
      appContainerRef.current.style.transform = `scale(${scaleFactor})`;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={appContainerRef}
      className="App"
      style={{
        width: `${BASE_APP_WIDTH}px`,
        height: `${BASE_APP_HEIGHT}px`,
      }}
    >
      {children}
    </div>
  );
}

function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 배경/테마용 코드: 우선 auth_code, 없으면 image_type 사용
  const themeCode: string | null = (user?.auth_code as string | null) || user?.image_type || null;

  // 각 화면 이동 함수
  const handleNavigate = (screen: ScreenName, id?: number) => {
    switch (screen) {
      case 'main': navigate('/main'); break;
      case 'encounter': navigate('/encounter'); break;
      case 'pokedex': navigate('/pokedex'); break;
      case 'badges': navigate('/badges'); break;
      case 'diary_list': navigate('/diary_list'); break;
      case 'diary_book': navigate(`/diary_book/${id || ''}`); break;
      default: navigate('/main'); break;
    }
  };

  return (
    <Routes>
      {/* 로그인/회원가입 화면 */}
      <Route path="/auth" element={<AppWrapper><AuthScreen onLoginSuccess={() => navigate('/main')} /></AppWrapper>} />

      {/* 모든 화면을 .App 컨테이너로 감싸서 빨간색+파란색 테두리 영역에서 실행되도록 합니다. */}
      <Route path="/" element={<PrivateRoute><AppWrapper><MainScreen onNavigate={handleNavigate} onLogout={logout} userEmail={user?.email || null} imageType={themeCode} /></AppWrapper></PrivateRoute>} />
      <Route path="/main" element={<PrivateRoute><AppWrapper><MainScreen onNavigate={handleNavigate} onLogout={logout} userEmail={user?.email || null} imageType={themeCode} /></AppWrapper></PrivateRoute>} />
      <Route path="/encounter" element={<PrivateRoute><AppWrapper><EncounterScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={themeCode} /></AppWrapper></PrivateRoute>} />
      <Route path="/pokedex" element={<PrivateRoute><AppWrapper><PokedexScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={themeCode} /></AppWrapper></PrivateRoute>} />
      <Route path="/badges" element={<PrivateRoute><AppWrapper><BadgeScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={themeCode} /></AppWrapper></PrivateRoute>} />
      <Route path="/diary_list" element={<PrivateRoute><AppWrapper><DiaryListScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={themeCode} /></AppWrapper></PrivateRoute>} />
      <Route path="/diary_book/:logId" element={<PrivateRoute><AppWrapper><DiaryDetailScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={themeCode} /></AppWrapper></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;