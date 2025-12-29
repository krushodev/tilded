import { create } from 'zustand';
import api from '@/services/api';
import type { Project } from '@/types';

interface ProjectState {
  projects: Project[];
  selectedProjectId: string | null;
  fetchProjects: (isFavorite?: boolean) => Promise<void>;
  fetchFavoriteProjects: () => Promise<void>;
  createProject: (name: string, color?: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSelectedProject: (id: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProjectId: null,
  fetchProjects: async (isFavorite) => {
    const params = new URLSearchParams();
    if (isFavorite !== undefined) params.append('isFavorite', String(isFavorite));
    const url = `/api/projects${params.toString() ? `?${params.toString()}` : ''}`;
    const { data } = await api.get(url);
    set({ projects: data });
  },
  fetchFavoriteProjects: async () => {
    const { data } = await api.get('/api/projects?isFavorite=true');
    set({ projects: data });
  },
  createProject: async (name, color) => {
    const { data } = await api.post('/api/projects', { name, color });
    set({ projects: [...get().projects, data] });
  },
  updateProject: async (id, data) => {
    const { data: updated } = await api.patch(`/api/projects/${id}`, data);
    set({
      projects: get().projects.map(p => (p.id === id ? updated : p))
    });
  },
  toggleFavorite: async (id) => {
    const project = get().projects.find(p => p.id === id);
    if (!project) return;
    const newFavoriteStatus = !project.isFavorite;
    await get().updateProject(id, { isFavorite: newFavoriteStatus });
  },
  deleteProject: async id => {
    await api.delete(`/api/projects/${id}`);
    set({ projects: get().projects.filter(p => p.id !== id) });
    if (get().selectedProjectId === id) {
      set({ selectedProjectId: null });
    }
  },
  setSelectedProject: (id) => {
    set({ selectedProjectId: id });
  }
}));

