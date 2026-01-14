import Dexie, { Table } from 'dexie';
import { Account, Category, Settings, Subscription, Transaction } from '@/types';

class FinanceDatabase extends Dexie {
  transactions!: Table<Transaction>;
  subscriptions!: Table<Subscription>;
  categories!: Table<Category>;
  accounts!: Table<Account>;
  settings!: Table<Settings>;

  constructor() {
    super('FinanceTrackerDB');
    
    // Define schema
    this.version(1).stores({
      transactions: 'id, date, type, categoryId, accountId, isRecurring, [date+type]',
      subscriptions: 'id, nextBillingDate, isActive, categoryId',
      categories: 'id, type, name',
      accounts: 'id, type, isActive',
      settings: 'id'
    });
  }
}

export const db = new FinanceDatabase();
