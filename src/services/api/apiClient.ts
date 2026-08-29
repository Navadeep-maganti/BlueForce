import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    const tokensStr = localStorage.getItem('kc_tokens');
    if (tokensStr) {
      try {
        const tokens = JSON.parse(tokensStr);
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`;
        }
      } catch (e) {
        console.error('Error parsing stored tokens:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login/' && originalRequest.url !== '/auth/refresh/') {
      originalRequest._retry = true;
      const tokensStr = localStorage.getItem('kc_tokens');

      if (tokensStr) {
        try {
          const tokens = JSON.parse(tokensStr);
          if (tokens?.refresh) {
            const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
              refresh: tokens.refresh,
            });

            if (refreshRes.data?.success && refreshRes.data?.data?.access) {
              const newAccess = refreshRes.data.data.access;
              const updatedTokens = {
                ...tokens,
                access: newAccess,
                ...(refreshRes.data.data.refresh ? { refresh: refreshRes.data.data.refresh } : {}),
              };
              localStorage.setItem('kc_tokens', JSON.stringify(updatedTokens));

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
              }
              return apiClient(originalRequest);
            }
          }
        } catch (refreshErr) {
          console.warn('Session expired. Logging out.');
          localStorage.removeItem('kc_tokens');
          localStorage.removeItem('kc_current_user');
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(error);
  }
);
