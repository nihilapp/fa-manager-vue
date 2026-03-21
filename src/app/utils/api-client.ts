import axios from 'axios';
import { useCookie } from '#imports';

import { appConfig } from '@app/config/app.config';

export const apiClient = axios.create({
  baseURL: appConfig.api.route,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 인증 토큰 자동 주입
apiClient.interceptors.request.use((config) => {
  const token = useCookie<string | null>('token');

  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`;
  }

  return config;
});

// 응답 인터셉터: 필요한 경우 전역 에러 처리 등 추가 가능
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Axios 에러를 일관된 형식으로 반환하거나 처리
    return Promise.reject(error);
  }
);
