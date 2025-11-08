// frontend/src/App.tsx (로그인/회원가입 폼 및 상태 관리 추가)

import React, { useState, useEffect } from 'react';
import './App.css';

// API 응답 데이터 구조 정의 (TypeScript)
interface PokemonEncounter {
  message: string;
  analysis: {
    location: string;
    environment: string;
    time: string;
  };
  pokemon: {
    id: number;
    name: string;
    type_1: string;
    sprite_url: string;
  };
  log_id: number;
}

// --- 1. 인증 상태 관리 ---
const AUTH_TOKEN_KEY = 'pokemon_auth_token';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register' | 'encounter'>('login');

  // 토큰 존재 여부 확인 (페이지 로드 시)
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      // 실제 앱에서는 토큰 유효성 검사 API를 호출해야 하지만, 여기서는 단순화
      setIsLoggedIn(true);
      setMode('encounter');
    }
  }, []);

  // --- 2. 인증 관련 핸들러 ---

  const handleAuthSuccess = (token: string, email: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setIsLoggedIn(true);
    setUserEmail(email);
    setMode('encounter');
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsLoggedIn(false);
    setUserEmail(null);
    setMode('login');
    // 새로고침하여 상태 확실히 초기화
    window.location.reload();
  };

  // --- 3. 렌더링 모드 선택 ---
  const renderContent = () => {
    if (!isLoggedIn && mode === 'login') {
      return <LoginForm onSuccess={handleAuthSuccess} onSwitch={() => setMode('register')} />;
    }
    if (!isLoggedIn && mode === 'register') {
      return <RegisterForm onSuccess={handleAuthSuccess} onSwitch={() => setMode('login')} />;
    }
    if (isLoggedIn) {
      return (
        <EncounterForm
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      );
    }
    return <p>로딩 중...</p>;
  };

  return (
    <div className="App">
      <h1>Pokémon Daily Log</h1>
      {renderContent()}
    </div>
  );
}

// ====================================================
// --- 컴포넌트: 로그인 폼 ---
// ====================================================
interface LoginFormProps {
  onSuccess: (token: string, email: string) => void;
  onSwitch: () => void;
}

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
    formData.append('grant_type', 'password'); // OAuth2 필수 필드

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // OAuth2 표준 헤더
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

// ====================================================
// --- 컴포넌트: 회원가입 폼 ---
// ====================================================
function RegisterForm({ onSuccess, onSwitch }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        body: JSON.stringify({ email, password }),
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
        <button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '회원가입 및 로그인'}
        </button>
        <p className="error-message">{error}</p>
        <button type="button" onClick={onSwitch}>로그인 화면으로 돌아가기</button>
      </form>
    </div>
  );
}

// ====================================================
// --- 컴포넌트: Encounter 폼 (기존 로직 포함) ---
// ====================================================
interface EncounterFormProps {
    userEmail: string | null;
    onLogout: () => void;
}

function EncounterForm({ userEmail, onLogout }: EncounterFormProps) {
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
                    'Authorization': `Bearer ${token}` // ⭐️ JWT 토큰 포함 ⭐️
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
        <div className="content-container">
            <header className="app-header">
                <p>환영합니다, **{userEmail || '트레이너'}**님!</p>
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
                        <p><strong>지역:</strong> {result.analysis.location} / <strong>환경:</strong> {result.analysis.environment} / <strong>시간:</strong> {result.analysis.time}</p>
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

export default App;