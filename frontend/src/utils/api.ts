// frontend/src/utils/api.ts
import axios from 'axios';

// 배포된 백엔드 서버 주소 (EC2 퍼블릭 IP 기준)
// Nginx 등으로 80포트에 프록시된 경우 포트 없이 사용합니다.
const API_BASE_URL = 'http://43.200.8.171/api/v1';

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