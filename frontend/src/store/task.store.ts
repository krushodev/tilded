import { create } from 'zustand';
import api from '@/services/api';
import type { Task } from '@/types';

interface TaskState {
  tasks: Task[];
  fetchTasks: (projectId?: string | null, dueDate?: string) => Promise<void>;
  addTask: (title: string, projectId?: string, description?: string, tagIds?: string[], dueDate?: string | null, priority?: string | null, sectionId?: string | null) => Promise<void>;
  toggleTask: (id: string, isCompleted: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, data: Partial<Task> & { tagIds?: string[] }) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  fetchTasks: async (projectId, dueDate) => {
    const params = new URLSearchParams();
    if (projectId !== undefined) {
      if (projectId === null) {
        params.append('projectId', 'null');
      } else {
        params.append('projectId', projectId);
      }
    }
    if (dueDate) {
      params.append('dueDate', dueDate);
    }
    const url = `/api/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const { data } = await api.get(url);
    set({ tasks: data });
  },
  addTask: async (title, projectId, description, tagIds, dueDate, priority, sectionId) => {
    const { data } = await api.post('/api/tasks', { title, projectId, description, tagIds, dueDate, priority, sectionId });
    set({ tasks: [data, ...get().tasks] });
  },
  toggleTask: async (id, isCompleted) => {
    const originalTasks = get().tasks;
    set({
      tasks: originalTasks.map(t => (t.id === id ? { ...t, isCompleted } : t))
    });

    try {
      await api.patch(`/api/tasks/${id}`, { isCompleted });
    } catch (error) {
      set({ tasks: originalTasks });
      console.error('Error al actualizar la tarea:', error);
    }
  },
  deleteTask: async id => {
    set({ tasks: get().tasks.filter(t => t.id !== id) });
    await api.delete(`/api/tasks/${id}`);
  },
  updateTask: async (id, data) => {
    const { data: updated } = await api.patch(`/api/tasks/${id}`, data);
    set({
      tasks: get().tasks.map(t => (t.id === id ? updated : t))
    });
  }
}));
