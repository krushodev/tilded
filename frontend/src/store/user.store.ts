import { create } from 'zustand';
import api from '@/services/api';
import i18n from '@/i18n/config';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  language?: string;
}

interface UserState {
  currentUser: User | null;
  fetchCurrentUser: () => Promise<void>;
  updateCurrentUser: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  fetchCurrentUser: async () => {
    const { data } = await api.get('/api/users/me');
    set({ currentUser: data });
    
    // Aplicar el idioma del usuario si está guardado
    if (data.language) {
      i18n.changeLanguage(data.language);
      localStorage.setItem('i18nextLng', data.language);
    }
  },
  updateCurrentUser: async (userData) => {
    const { data } = await api.patch('/api/users/me', userData);
    set({ currentUser: data });
  }
}));

