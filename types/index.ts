// Transaction types
export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  description: string;
  merchant?: string;
  accountId?: string;
  plaidTransactionId?: string;
  isRecurring: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'income' | 'expense';
  categoryIds?: string[];
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

// Subscription types
export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'weekly' | 'monthly' | 'yearly';
  nextBillingDate: Date;
  categoryId: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  description?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionInput = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>;

// Category types
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  budget?: number;
  parentId?: string;
  createdAt: Date;
}

export type CategoryInput = Omit<Category, 'id' | 'createdAt'>;

// Account types
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  balance: number;
  plaidAccountId?: string;
  isActive: boolean;
  createdAt: Date;
}

// Settings types
export interface Settings {
  id: string;
  currency: string;
  locale: string;
  plaidAccessToken?: string;
  lastSyncDate?: Date;
  defaultCategories: string[];
}

// Analytics types
export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  transactionCount: number;
  comparisonWithLastMonth: number;
}

export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  color: string;
  categoryIcon: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthTrend {
  month: string; // 'YYYY-MM'
  income: number;
  expense: number;
}

export interface BudgetProgress {
  categoryId: string;
  categoryName: string;
  budget: number;
  spent: number;
  percentage: number;
  isOverBudget: boolean;
}
