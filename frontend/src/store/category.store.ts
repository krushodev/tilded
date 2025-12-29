import { create } from 'zustand';
import api from '@/services/api';
import type { Category } from '@/types';

interface CategoryState {
  categories: Category[];
  selectedCategoryId: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, color?: string) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  setSelectedCategory: (id: string | null) => void;
  getDefaultCategory: () => Category | undefined;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategoryId: null,
  fetchCategories: async () => {
    const { data } = await api.get('/api/categories');
    set({ categories: data });
    const defaultCategory = data.find((c: Category) => c.isDefault);
    if (defaultCategory && !get().selectedCategoryId) {
      set({ selectedCategoryId: defaultCategory.id });
    }
  },
  createCategory: async (name, color) => {
    const { data } = await api.post('/api/categories', { name, color });
    set({ categories: [...get().categories, data] });
  },
  updateCategory: async (id, data) => {
    const { data: updated } = await api.patch(`/api/categories/${id}`, data);
    set({
      categories: get().categories.map(c => (c.id === id ? updated : c))
    });
  },
  deleteCategory: async id => {
    await api.delete(`/api/categories/${id}`);
    set({ categories: get().categories.filter(c => c.id !== id) });
    if (get().selectedCategoryId === id) {
      const defaultCategory = get().categories.find(c => c.isDefault);
      set({ selectedCategoryId: defaultCategory?.id || null });
    }
  },
  setSelectedCategory: (id) => {
    set({ selectedCategoryId: id });
  },
  getDefaultCategory: () => {
    return get().categories.find(c => c.isDefault);
  }
}));

