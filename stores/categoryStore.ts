import { create } from 'zustand';
import { Category } from '@/types';
import { CategoryService } from '@/lib/db/queries';

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;

  // Actions
  loadCategories: () => Promise<void>;
  getExpenseCategories: () => Category[];
  getIncomeCategories: () => Category[];
  getCategoryById: (id: string) => Category | undefined;
  addCategory: (data: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,

  loadCategories: async () => {
    set({ isLoading: true });
    try {
      const categories = await CategoryService.getAll();
      set({ categories, isLoading: false });
    } catch (error) {
      console.error('Failed to load categories:', error);
      set({ isLoading: false });
    }
  },

  getExpenseCategories: () => {
    return get().categories.filter((cat) => cat.type === 'expense');
  },

  getIncomeCategories: () => {
    return get().categories.filter((cat) => cat.type === 'income');
  },

  getCategoryById: (id) => {
    return get().categories.find((cat) => cat.id === id);
  },

  addCategory: async (data) => {
    try {
      await CategoryService.create(data);
      await get().loadCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      await CategoryService.update(id, data);
      await get().loadCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      await CategoryService.delete(id);
      await get().loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  },
}));
