import { db } from './dexie';
import { 
  Category, 
  CategoryInput, 
  Subscription, 
  SubscriptionInput, 
  Transaction, 
  TransactionFilters, 
  TransactionInput 
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Transaction Services
export const TransactionService = {
  getAll: async (filters: TransactionFilters = {}) => {
    let collection = db.transactions.orderBy('date').reverse();

    if (filters.startDate) {
      collection = collection.filter(t => t.date >= filters.startDate!);
    }
    
    if (filters.endDate) {
      collection = collection.filter(t => t.date <= filters.endDate!);
    }

    if (filters.type) {
      collection = collection.filter(t => t.type === filters.type);
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      collection = collection.filter(t => filters.categoryIds!.includes(t.categoryId));
    }

    if (filters.minAmount !== undefined) {
      collection = collection.filter(t => t.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      collection = collection.filter(t => t.amount <= filters.maxAmount!);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      collection = collection.filter(t => 
        t.description.toLowerCase().includes(query) || 
        (t.merchant && t.merchant.toLowerCase().includes(query))
      );
    }

    return await collection.toArray();
  },

  create: async (data: TransactionInput) => {
    const id = uuidv4();
    const transaction: Transaction = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.transactions.add(transaction);
    return transaction;
  },

  update: async (id: string, data: Partial<TransactionInput>) => {
    const changes = {
      ...data,
      updatedAt: new Date()
    };
    await db.transactions.update(id, changes);
    return await db.transactions.get(id);
  },

  delete: async (id: string) => {
    await db.transactions.delete(id);
  }
};

// Category Services
export const CategoryService = {
  getAll: async () => {
    return await db.categories.toArray();
  },

  create: async (data: CategoryInput) => {
    const id = uuidv4();
    const category: Category = {
      ...data,
      id,
      createdAt: new Date()
    };
    await db.categories.add(category);
    return category;
  },

  update: async (id: string, data: Partial<Category>) => {
    await db.categories.update(id, data);
    return await db.categories.get(id);
  },

  delete: async (id: string) => {
    await db.categories.delete(id);
  },

  // Seed default categories if empty
  seedDefaults: async () => {
    const count = await db.categories.count();
    if (count === 0) {
      const defaultCategories: CategoryInput[] = [
        { name: 'Food & Dining', type: 'expense', color: '#EF4444', icon: 'utensils' },
        { name: 'Shopping', type: 'expense', color: '#F59E0B', icon: 'shopping-bag' },
        { name: 'Transportation', type: 'expense', color: '#3B82F6', icon: 'car' },
        { name: 'Entertainment', type: 'expense', color: '#8B5CF6', icon: 'film' },
        { name: 'Housing', type: 'expense', color: '#10B981', icon: 'home' },
        { name: 'Utilities', type: 'expense', color: '#6366F1', icon: 'zap' },
        { name: 'Health', type: 'expense', color: '#EC4899', icon: 'heart' },
        { name: 'Salary', type: 'income', color: '#059669', icon: 'briefcase' },
        { name: 'Freelance', type: 'income', color: '#0D9488', icon: 'laptop' },
        { name: 'Investments', type: 'income', color: '#7C3AED', icon: 'trending-up' }
      ];

      for (const cat of defaultCategories) {
        await CategoryService.create(cat);
      }
    }
  }
};

// Subscription Services
export const SubscriptionService = {
  getAll: async () => {
    return await db.subscriptions.toArray();
  },

  create: async (data: SubscriptionInput) => {
    const id = uuidv4();
    const subscription: Subscription = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Automatically create the first transaction if start date is in past or today
    /* 
       Note: In a real app, you'd likely have a background job or a check on app load
       to generate transactions for subscriptions.
    */
    
    await db.subscriptions.add(subscription);
    return subscription;
  },

  update: async (id: string, data: Partial<SubscriptionInput>) => {
    const changes = {
      ...data,
      updatedAt: new Date()
    };
    await db.subscriptions.update(id, changes);
    return await db.subscriptions.get(id);
  },

  delete: async (id: string) => {
    await db.subscriptions.delete(id);
  },

  getUpcomingSubscriptions: async (days: number = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    // This is a simplified check. Real world would need precise date calc based on billingCycle
    return await db.subscriptions
      .where('nextBillingDate')
      .between(today, futureDate, true, true)
      .and(sub => sub.isActive)
      .toArray();
  }
};
