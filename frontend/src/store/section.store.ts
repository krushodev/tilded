import { create } from 'zustand';
import api from '@/services/api';
import type { Section } from '@/types';

interface SectionStore {
  sections: Section[];
  loading: boolean;
  error: string | null;
  fetchSections: (projectId: string) => Promise<void>;
  addSection: (projectId: string, name: string) => Promise<Section | undefined>;
  updateSection: (sectionId: string, data: Partial<Section>) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
  reorderSections: (projectId: string, sectionOrders: { id: string; order: number }[]) => Promise<void>;
}

export const useSectionStore = create<SectionStore>((set, get) => ({
  sections: [],
  loading: false,
  error: null,

  fetchSections: async (projectId: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/api/sections/project/${projectId}`);
      set({ sections: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addSection: async (projectId: string, name: string) => {
    set({ error: null });
    try {
      const { data } = await api.post('/api/sections', { projectId, name });
      set(state => ({ sections: [...state.sections, data] }));
      return data;
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateSection: async (sectionId: string, data: Partial<Section>) => {
    set({ error: null });
    try {
      const { data: updatedSection } = await api.patch(`/api/sections/${sectionId}`, data);
      set(state => ({
        sections: state.sections.map(s => s.id === sectionId ? updatedSection : s)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteSection: async (sectionId: string) => {
    set({ error: null });
    try {
      await api.delete(`/api/sections/${sectionId}`);
      set(state => ({
        sections: state.sections.filter(s => s.id !== sectionId)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  reorderSections: async (projectId: string, sectionOrders: { id: string; order: number }[]) => {
    set({ error: null });
    try {
      const { data } = await api.post('/api/sections/reorder', { projectId, sectionOrders });
      set({ sections: data });
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));

