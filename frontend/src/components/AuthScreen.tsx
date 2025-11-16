// frontend/src/components/AuthScreen.tsx
import React, { useState, FormEvent } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
      const detail = err.response?.data?.detail || '알 수 없는 오류가 발생했습니다.';
      setError(detail);
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