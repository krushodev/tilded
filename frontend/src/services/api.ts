import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { API_URL } from '@/config';

const api = axios.create({
  baseURL: API_URL || 'http://localhost:8080'
});

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
