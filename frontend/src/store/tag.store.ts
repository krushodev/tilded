import { create } from 'zustand';
import api from '@/services/api';
import type { Tag } from '@/types';

interface TagState {
  tags: Tag[];
  fetchTags: () => Promise<void>;
  createTag: (name: string, color?: string) => Promise<void>;
  updateTag: (id: string, data: Partial<Tag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  fetchTags: async () => {
    const { data } = await api.get('/api/tags');
    set({ tags: data });
  },
  createTag: async (name, color) => {
    const { data } = await api.post('/api/tags', { name, color });
    set({ tags: [...get().tags, data] });
  },
  updateTag: async (id, data) => {
    const { data: updated } = await api.patch(`/api/tags/${id}`, data);
    set({
      tags: get().tags.map(t => (t.id === id ? updated : t))
    });
  },
  deleteTag: async id => {
    await api.delete(`/api/tags/${id}`);
    set({ tags: get().tags.filter(t => t.id !== id) });
  }
}));

