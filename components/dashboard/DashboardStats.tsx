'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { getMonthlyStats } from '@/lib/utils/calculations';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { db } from '@/lib/db/dexie';
import { MonthlyStats, Transaction } from '@/types';
import { Sparkles, Layers, Clock, TrendingUp, TrendingDown } from 'lucide-react';

export function DashboardStats() {
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const { subscriptions, loadSubscriptions } = useSubscriptionStore();
  const { transactions } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [transactions]); // Re-load when transactions change

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get all transactions to find the most recent month with data
      const allTransactions = await db.transactions.toArray();

      let year: number;
      let month: number;

      if (allTransactions.length > 0) {
        // Sort by date descending to get the most recent transaction
        allTransactions.sort((a: Transaction, b: Transaction) => b.date.getTime() - a.date.getTime());
        const mostRecentDate = allTransactions[0].date;
        year = mostRecentDate.getFullYear();
        month = mostRecentDate.getMonth() + 1;
      } else {
        // No transactions, use current month
        const today = new Date();
        year = today.getFullYear();
        month = today.getMonth() + 1;
      }

      const monthlyStats = await getMonthlyStats(year, month);
      setStats(monthlyStats);
      await loadSubscriptions();
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeSubscriptions = subscriptions.filter((s) => s.isActive);
  const monthlySubscriptionTotal = activeSubscriptions
    .filter((s) => s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} padding="md">
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-700 rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Income/Expense */}
      <Card padding="md" className="bg-green-500/10 border-green-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Sparkles className="text-green-400" size={20} />
          </div>
        </div>
        <h3 className="text-sm text-gray-400 mb-1">本月總收入</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-bold text-white">
            {stats ? `NT$ ${stats.totalIncome.toLocaleString()}` : 'NT$ 0'}
          </p>
        </div>
        {stats && stats.totalIncome > 0 && (
          <div className="flex items-center gap-1 mt-2 text-sm">
            {stats.comparisonWithLastMonth > 0 ? (
              <>
                <TrendingUp size={14} className="text-green-400" />
                <span className="text-green-400">+{stats.comparisonWithLastMonth.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingDown size={14} className="text-red-400" />
                <span className="text-red-400">{stats.comparisonWithLastMonth.toFixed(1)}%</span>
              </>
            )}
            <span className="text-gray-500">vs 上月</span>
          </div>
        )}
      </Card>

      {/* Monthly Expense */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Layers className="text-blue-400" size={20} />
          </div>
        </div>
        <h3 className="text-sm text-gray-400 mb-1">本月總支出</h3>
        <p className="text-4xl font-bold text-white">
          {stats ? `NT$ ${stats.totalExpense.toLocaleString()}` : 'NT$ 0'}
        </p>
        {stats && (
          <p className="text-xs text-gray-400 mt-1">
            {stats.transactionCount} 筆交易
          </p>
        )}
      </Card>

      {/* Subscriptions */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Clock className="text-purple-400" size={20} />
          </div>
        </div>
        <h3 className="text-sm text-gray-400 mb-1">訂閱總額</h3>
        <div className="text-4xl font-bold text-white">
          NT$ {monthlySubscriptionTotal.toLocaleString()}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {activeSubscriptions.length} 個活躍訂閱
        </p>
      </Card>
    </div>
  );
}
