// frontend/src/App.tsx

import React, { useState, useEffect } from 'react';
import './App.css';
// ⭐️ 모든 컴포넌트 임포트 ⭐️
import MainScreen from './MainScreen';
import Pokedex from './Pokedex';
import BadgeScreen from './BadgeScreen';
import DiaryList from './DiaryList'; // 과거 기록 목록
import DiaryLog from './DiaryLog';
import DiaryBook from './DiaryBook';
// DiaryLog, LoginForm, RegisterForm, EncounterForm은 이 파일 하단에 정의됨

// --- 1. 인터페이스 정의 ---
interface PokemonEncounter {
    message: string;
    analysis: {
        location: string;
        environment: string;
        time: string;
        season: string;
    };
    pokemon: {
        id: number;
        name: string;
        type_1: string;
        sprite_url: string;
    };
    log_id: number;
}

interface LoginFormProps {
    onSuccess: (token: string, email: string) => void;
    onSwitch: () => void;
}

interface EncounterFormProps {
    userEmail: string | null;
    onLogout: () => void;
    // 모든 네비게이션 모드를 받을 수 있도록 타입 확장
    onNavigate: (screen: 'encounter' | 'pokedex' | 'badges' | 'main' | 'diary_list') => void;
    imageType: string | null;
}

interface DiaryLogProps {
    logId: number | null;
    onNavigate: (screen: 'main' | 'diary_list') => void;
}

// --- 2. 상수 및 상태 관리 키 ---
const AUTH_TOKEN_KEY = 'pokemon_auth_token';

// ====================================================
// --- App 메인 컴포넌트 (라우팅 관리) ---
// ====================================================

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userImageType, setUserImageType] = useState<string | null>(null);

  // ⭐️ mode 상태 확장 (구조적 오류 수정) ⭐️
  const [mode, setMode] = useState<'login' | 'register' | 'main' | 'encounter' | 'pokedex' | 'badges' | 'diary_list' | 'diary_detail' | 'diary_book'>('login');
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  // --- 네비게이션 및 인증 핸들러 ---

  const handleNavigation = (newMode: 'encounter' | 'pokedex' | 'badges' | 'main' | 'diary_list' | 'diary_book') => {
      setMode(newMode);
  };

  const handleViewLog = (logId: number) => {
      setSelectedLogId(logId);
      setMode('diary_detail');
  };

  const handleAuthSuccess = async (token: string, email: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setIsLoggedIn(true);
    setUserEmail(email);
    
    // 사용자 정보 가져오기 (image_type 포함)
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUserImageType(userData.image_type);
      }
    } catch (err) {
      console.error('사용자 정보 가져오기 실패:', err);
    }
    
    setMode('main'); // 로그인 성공 시 MainScreen으로 이동
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserImageType(null);
    setMode('login');
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      setIsLoggedIn(true);
      setMode('main');
      setUserEmail('트레이너');
      
      // 사용자 정보 가져오기
      fetch('http://localhost:8000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(userData => {
          setUserEmail(userData.email || '트레이너');
          setUserImageType(userData.image_type);
        })
        .catch(err => {
          console.error('사용자 정보 가져오기 실패:', err);
        });
    }
  }, []);

  // --- 3. 렌더링 모드 선택 ---
  const renderContent = () => {
    // 1. 비로그인 상태
    if (!isLoggedIn) {
      if (mode === 'register') return <RegisterForm onSuccess={handleAuthSuccess} onSwitch={() => setMode('login')} />;
      return <LoginForm onSuccess={handleAuthSuccess} onSwitch={() => setMode('register')} />;
    }

    // 2. 로그인 상태
    switch (mode) {
        case 'main':
            return <MainScreen onNavigate={handleNavigation} onLogout={handleLogout} userEmail={userEmail} imageType={userImageType} />;

        case 'diary_list':
            return <DiaryList onNavigate={handleNavigation} onViewLog={handleViewLog} imageType={userImageType} />;

        case 'diary_detail':
            // DiaryLog 컴포넌트는 다음 단계에서 상세 구현 예정
            return <DiaryLog logId={selectedLogId} onNavigate={handleNavigation} imageType={userImageType} />;
        case 'diary_book':
            return <DiaryBook onNavigate={handleNavigation} imageType={userImageType} />;

        case 'encounter':
            return <EncounterForm userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigation} imageType={userImageType} />;
        case 'pokedex':
            return <Pokedex onNavigate={handleNavigation} imageType={userImageType} />;
        case 'badges':
            return <BadgeScreen onNavigate={handleNavigation} imageType={userImageType} />;
        default:
            return <MainScreen onNavigate={handleNavigation} onLogout={handleLogout} userEmail={userEmail} imageType={userImageType} />;
    }
  };

  return (
    <div className="App">
        {renderContent()}
    </div>
  );
}

// ====================================================
// --- 4. 독립적인 컴포넌트 정의 (ReferenceError 해결) ---
// ====================================================

// --- 4.1. 로그인 폼 ---
function LoginForm({ onSuccess, onSwitch }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI OAuth2는 이메일을 'username'으로 받음
    formData.append('password', password);
    formData.append('grant_type', 'password');

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '로그인 정보가 올바르지 않습니다.');
      }

      const data = await response.json();
      onSuccess(data.access_token, email);

    } catch (err) {
      setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required />
        <button type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
        <p className="error-message">{error}</p>
        <button type="button" onClick={onSwitch}>회원가입</button>
      </form>
    </div>
  );
}

// --- 4.2. 회원가입 폼 ---
function RegisterForm({ onSuccess, onSwitch }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, auth_code: authCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '회원가입에 실패했습니다. (이메일 중복 등)');
      }

      // 회원가입 성공 후 자동으로 로그인 시도
      const loginFormData = new URLSearchParams();
      loginFormData.append('username', email);
      loginFormData.append('password', password);
      loginFormData.append('grant_type', 'password');

      const loginResponse = await fetch('http://localhost:8000/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: loginFormData,
      });

      if (!loginResponse.ok) {
          throw new Error('회원가입 후 자동 로그인에 실패했습니다.');
      }
      const data = await loginResponse.json();
      onSuccess(data.access_token, email);

    } catch (err) {
      setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 (ID)" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 (72자 이하)" required />
        <input type="text" value={authCode} onChange={(e) => setAuthCode(e.target.value)} placeholder="인증코드 (Gardevoir, Lucario, 또는 Pretty 포함)" required />
        <button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '회원가입 및 로그인'}
        </button>
        <p className="error-message">{error}</p>
        <button type="button" onClick={onSwitch}>로그인 화면으로 돌아가기</button>
      </form>
    </div>
  );
}

// --- 4.3. 일지 작성 폼 (EncounterForm) ---
function EncounterForm({ userEmail, onLogout, onNavigate, imageType }: EncounterFormProps) {
    const { getBackgroundStyle } = require('./utils/backgroundUtils');
    const backgroundStyle = getBackgroundStyle(imageType);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [reflection, setReflection] = useState('');
    const [result, setResult] = useState<PokemonEncounter | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || !reflection) {
            setError('사진 파일과 오늘의 소감을 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) {
            setError("인증 토큰이 없습니다. 다시 로그인해 주세요.");
            onLogout();
            return;
        }

        const formData = new FormData();
        formData.append('image_file', imageFile);
        formData.append('user_reflection', reflection);

        try {
            const response = await fetch('http://localhost:8000/api/v1/encounter', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("세션이 만료되었습니다. 다시 로그인해 주세요.");
                }
                const errorData = await response.json();
                throw new Error(errorData.detail || 'API 호출에 실패했습니다.');
            }

            const data: PokemonEncounter = await response.json();
            setResult(data);
        } catch (err) {
            setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-container" style={backgroundStyle}>
            <header className="app-header">
                <button onClick={() => onNavigate('main')} className="back-button">← 메인으로</button>
                <p>환영합니다, **{userEmail || '트레이너'}**님! (일지 작성)</p>
                <button onClick={onLogout} style={{ marginLeft: '10px' }}>로그아웃</button>
            </header>

            <form onSubmit={handleSubmit} className="form-container">
                <div style={{ margin: '15px 0' }}>
                    <label>
                        오늘의 사진:
                        <input type="file" accept="image/*" onChange={handleFileChange} required />
                    </label>
                    {imageFile && <p>선택된 파일: **{imageFile.name}**</p>}
                </div>

                <div style={{ margin: '15px 0' }}>
                    <label>
                        오늘의 소감:
                        <textarea
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            placeholder="간단한 하루 소감을 작성해주세요."
                            rows={3}
                            required
                        />
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? '분석 중...' : '포켓몬 조우하기'}
                </button>
            </form>

            {/* --- 결과 섹션 --- */}
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

            {result && (
                <div className="result-container">
                    <h2>{result.message} (Log #{result.log_id})</h2>

                    <div className="analysis-box">
                        <h3>🗺️ 환경 분석 (GPT)</h3>
                        <p>
                            <strong>지역:</strong> {result.analysis.location} /
                            <strong>환경:</strong> {result.analysis.environment} /
                            <strong>시간:</strong> {result.analysis.time} /
                            <strong>계절:</strong> {result.analysis.season}
                        </p>
                    </div>

                    <div className="pokemon-box">
                        <h3>{result.pokemon.name} ({result.pokemon.type_1} 타입) 조우!</h3>
                        <img
                            src={result.pokemon.sprite_url}
                            alt={result.pokemon.name}
                            style={{ width: '150px', height: '150px' }}
                        />
                        <p>전국도감 번호: {result.pokemon.id}</p>
                    </div>
                </div>
            )}
        </div>
    );
}


// 5. 익스포트
export default App;