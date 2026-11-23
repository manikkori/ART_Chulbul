import axios from 'axios';

// Normalize API base URL to safely handle missing /api, trailing slashes, or relative paths
const getNormalizedBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: getNormalizedBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header token if stored in localStorage as fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('artchulbul_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, could clear token
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/my-orders')) {
        // Only redirect if on protected page
      }
    }
    return Promise.reject(error);
  }
);

export default api;
