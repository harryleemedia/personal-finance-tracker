import { create } from 'zustand';
import { Subscription, SubscriptionInput } from '@/types';
import { SubscriptionService } from '@/lib/db/queries';

interface SubscriptionStore {
  subscriptions: Subscription[];
  isLoading: boolean;

  // Actions
  loadSubscriptions: () => Promise<void>;
  addSubscription: (data: SubscriptionInput) => Promise<void>;
  updateSubscription: (id: string, data: Partial<SubscriptionInput>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  getActiveSubscriptions: () => Subscription[];
  getUpcomingSubscriptions: (days: number) => Promise<Subscription[]>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  isLoading: false,

  loadSubscriptions: async () => {
    set({ isLoading: true });
    try {
      const subscriptions = await SubscriptionService.getAll();
      set({ subscriptions, isLoading: false });
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      set({ isLoading: false });
    }
  },

  addSubscription: async (data) => {
    try {
      await SubscriptionService.create(data);
      await get().loadSubscriptions();
    } catch (error) {
      console.error('Failed to add subscription:', error);
      throw error;
    }
  },

  updateSubscription: async (id, data) => {
    try {
      await SubscriptionService.update(id, data);
      await get().loadSubscriptions();
    } catch (error) {
      console.error('Failed to update subscription:', error);
      throw error;
    }
  },

  deleteSubscription: async (id) => {
    try {
      await SubscriptionService.delete(id);
      await get().loadSubscriptions();
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      throw error;
    }
  },

  getActiveSubscriptions: () => {
    return get().subscriptions.filter((sub) => sub.isActive);
  },

  getUpcomingSubscriptions: async (days) => {
    return await SubscriptionService.getUpcomingSubscriptions(days);
  },
}));
