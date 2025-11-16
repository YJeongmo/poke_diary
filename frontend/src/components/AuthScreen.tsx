// frontend/src/components/AuthScreen.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 클라이언트 측 간단 검증: 비밀번호 길이 체크
    if (password.length < 6) {
      setLoading(false);
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      if (isRegister) {
        // 회원가입
        await api.publicPost('/auth/register', { email, password, auth_code: authCode });
        alert('회원가입 성공! 로그인 해주세요.');
        setIsRegister(false);
      } else {
        // 로그인
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        formData.append('grant_type', 'password');

        const response = await api.publicPost('/auth/login', formData.toString(), true);
        authLogin(response.data.access_token);
        onLoginSuccess();
      }
    } catch (err: any) {
      const detail = err?.response?.data?.detail;

      // FastAPI/Pydantic의 에러 포맷(detail 배열 또는 객체)을 사람이 읽을 수 있는 문자열로 변환
      let message = '알 수 없는 오류가 발생했습니다.';

      if (Array.isArray(detail) && detail.length > 0) {
        // 예: [{ msg: "...", loc: [...], type: "string_too_short", ... }]
        message = detail[0]?.msg || message;
      } else if (typeof detail === 'string') {
        message = detail;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-wrapper" onSubmit={handleSubmit}>
        <h1>Pokémon Daily Log</h1>
        <h2>{isRegister ? '회원가입' : '로그인'}</h2>

        <input
          type="email"
          placeholder="ID (이메일)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="PW (비밀번호)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isRegister && (
          <input
            type="text"
            placeholder="CODE (인증코드)"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            required
          />
        )}

        {error && <p style={{ color: 'red', marginTop: '-10px' }}>{error}</p>}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? '처리 중...' : isRegister ? '회원가입 및 로그인' : '로그인'}
        </button>

        <button
          type="button"
          className="auth-button secondary"
          onClick={() => setIsRegister(prev => !prev)}
        >
          {isRegister ? '로그인 화면으로 돌아가기' : '회원가입'}
        </button>
      </form>
    </div>
  );
}

export default AuthScreen;