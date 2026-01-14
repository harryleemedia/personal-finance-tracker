import { create } from 'zustand';
import { Transaction, TransactionFilters, TransactionInput } from '@/types';
import { TransactionService } from '@/lib/db/queries';

interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  filters: TransactionFilters;
  
  // Actions
  loadTransactions: () => Promise<void>;
  addTransaction: (data: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, data: Partial<TransactionInput>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({\n  transactions: [],\n  isLoading: false,\n  filters: {},\n\n  loadTransactions: async () => {\n    set({ isLoading: true });\n    try {\n      const transactions = await TransactionService.getAll(get().filters);\n      set({ transactions, isLoading: false });\n    } catch (error) {\n      console.error('Failed to load transactions:', error);\n      set({ isLoading: false });\n    }\n  },\n\n  addTransaction: async (data) => {\n    try {\n      await TransactionService.create(data);\n      await get().loadTransactions();\n    } catch (error) {\n      console.error('Failed to add transaction:', error);\n      throw error;\n    }\n  },\n\n  updateTransaction: async (id, data) => {\n    try {\n      await TransactionService.update(id, data);\n      await get().loadTransactions();\n    } catch (error) {\n      console.error('Failed to update transaction:', error);\n      throw error;\n    }\n  },\n\n  deleteTransaction: async (id) => {\n    try {\n      await TransactionService.delete(id);\n      await get().loadTransactions();\n    } catch (error) {\n      console.error('Failed to delete transaction:', error);\n      throw error;\n    }\n  },\n\n  setFilters: (filters) => {\n    set({ filters });\n    get().loadTransactions();\n  },\n\n  clearFilters: () => {\n    set({ filters: {} });\n    get().loadTransactions();\n  },\n}));\n