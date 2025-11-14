// frontend/src/App.tsx (최종본)
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import PrivateRoute from './components/PrivateRoute';

// 화면 컴포넌트들
import AuthScreen from './components/AuthScreen';
import MainScreen from './components/MainScreen';
import EncounterScreen from './components/EncounterScreen';
import PokedexScreen from './Pokedex';
import BadgeScreen from './BadgeScreen';
import DiaryListScreen from './DiaryListScreen'; // ⭐ 추가
import DiaryDetailScreen from './DiaryDetailScreen'; // ⭐ 추가
import { ScreenName } from './types'; // ⭐ 추가

// ⭐ MainScreen에서 Scaling을 처리하므로, App.tsx에서는 Ref를 사용하지 않습니다.

function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    // App.tsx는 .App wrapper를 직접 렌더링하지 않고,
    // MainScreen 등 각 화면이 .App 역할을 하도록 넘깁니다.
    <Routes>
      {/* 로그인/회원가입 화면 */}
      <Route path="/auth" element={<AuthScreen onLoginSuccess={() => navigate('/main')} />} />

      {/* MainScreen은 Scaling을 담당하는 .App 역할을 합니다. */}
      <Route path="/" element={<PrivateRoute><MainScreen onNavigate={handleNavigate} onLogout={logout} userEmail={user?.email || null} imageType={user?.image_type || null} /></PrivateRoute>} />
      <Route path="/main" element={<PrivateRoute><MainScreen onNavigate={handleNavigate} onLogout={logout} userEmail={user?.email || null} imageType={user?.image_type || null} /></PrivateRoute>} />

      {/* 나머지 화면들은 MainScreen과 구조를 맞추기 위해 별도의 컨테이너를 가집니다. */}
      <Route path="/encounter" element={<PrivateRoute><EncounterScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={user?.image_type || null} /></PrivateRoute>} />
      <Route path="/pokedex" element={<PrivateRoute><PokedexScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={user?.image_type || null} /></PrivateRoute>} />
      <Route path="/badges" element={<PrivateRoute><BadgeScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={user?.image_type || null} /></PrivateRoute>} />
      <Route path="/diary_list" element={<PrivateRoute><DiaryListScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={user?.image_type || null} /></PrivateRoute>} />
      <Route path="/diary_book/:logId" element={<PrivateRoute><DiaryDetailScreen onNavigate={handleNavigate} userEmail={user?.email || null} imageType={user?.image_type || null} /></PrivateRoute>} />
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