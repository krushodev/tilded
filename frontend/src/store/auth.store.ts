import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        set({ token: data.token, isAuthenticated: true });
      },
      register: async (email, password) => {
        await api.post('/api/auth/register', { email, password });
      },
      logout: () => set({ token: null, isAuthenticated: false })
    }),
    { name: 'auth-storage' }
  )
);
