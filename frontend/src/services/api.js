import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dentalstock-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle token expiration (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatches an event that AuthContext listens to for session expiration
      window.dispatchEvent(new CustomEvent('auth-expired', {
        detail: { message: error.response.data?.message || 'Your session has expired. Please log in again.' }
      }));
    }
    return Promise.reject(error);
  }
);

export default api;
