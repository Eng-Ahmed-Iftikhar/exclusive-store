import axios, { AxiosError, AxiosResponse } from 'axios';

// Configure axios with interceptors
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    // Debug JWT token details
    if (config.url?.includes('/auth/me')) {
      console.log('=== /api/auth/me Request Debug ===');
      console.log('Full token:', token);
      console.log('Token length:', token.length);
      console.log('Authorization header:', config.headers.Authorization);

      // Try to decode JWT payload (without verification)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT payload:', payload);
        console.log('Token issued at:', new Date(payload.iat * 1000));
        console.log('Token expires at:', new Date(payload.exp * 1000));
        console.log('Current time:', new Date());
        console.log('Token expired:', Date.now() > payload.exp * 1000);
      } catch (e) {
        console.log('Could not decode JWT payload:', e);
      }
      console.log('================================');
    }
  } else {
    console.log('Request interceptor - no token found for:', config.url);
  }
  return config;
});

// Response interceptor for automatic token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('=== 401 Unauthorized Error Debug ===');
      console.log('URL:', originalRequest.url);
      console.log('Method:', originalRequest.method);
      console.log('Request headers:', originalRequest.headers);
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
      console.log('Error response headers:', error.response.headers);
      console.log('==================================');
      // Skip refresh for login and register routes
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If refresh is in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No token to refresh');
        }

        // Call refresh token endpoint
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/refresh`,
          { accessToken: token }
        );

        const newToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process queued requests
        processQueue(null, newToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        localStorage.removeItem('accessToken');
        processQueue(refreshError, null);

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
