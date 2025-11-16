// frontend/src/utils/api.ts
import axios from 'axios';

// 백엔드 서버 주소는 환경변수(VITE_API_URL)로 관리합니다.
// 예) 개발: http://localhost:8000/api/v1
//    운영: https://api.my-domain.com/api/v1
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰을 헤더에 삽입하는 헬퍼 함수
const attachToken = (token: string | null) => ({
  Authorization: token ? `Bearer ${token}` : '',
});

export default {
  // 인증이 필요한 GET 요청
  get: (url: string, token: string | null) => {
    return api.get(url, {
      headers: attachToken(token),
    });
  },

  // 인증이 필요한 POST 요청
  post: (url: string, data: any, token: string | null) => {
    return api.post(url, data, {
      headers: attachToken(token),
    });
  },

  // multipart/form-data 요청 (일지 작성용)
  postMultipart: (url: string, formData: FormData, token: string | null) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...attachToken(token),
      },
    });
  },

  // 인증 불필요 (로그인/회원가입)
  publicPost: (url: string, data: any, isFormData = false) => {
    const headers = isFormData ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {};
    return api.post(url, data, { headers });
  },
};