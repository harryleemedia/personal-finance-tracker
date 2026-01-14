import { CategoryStat, MonthlyStats, MonthTrend, Transaction } from '@/types';
import { startOfMonth, endOfMonth, subMonths, format, isSameMonth } from 'date-fns';

export const calculateMonthlyStats = (transactions: Transaction[], currentMonth: Date = new Date()): MonthlyStats => {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const lastMonthStart = startOfMonth(subMonths(currentMonth, 1));
  const lastMonthEnd = endOfMonth(subMonths(currentMonth, 1));

  const currentMonthTransactions = transactions.filter(t => 
    t.date >= start && t.date <= end
  );

  const lastMonthTransactions = transactions.filter(t => 
    t.date >= lastMonthStart && t.date <= lastMonthEnd
  );

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthNet = lastMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) -
    lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpense;
  
  // Calculate percentage change
  let comparisonWithLastMonth = 0;
  if (lastMonthNet !== 0) {
    comparisonWithLastMonth = ((netIncome - lastMonthNet) / Math.abs(lastMonthNet)) * 100;
  } else if (netIncome !== 0) {
    comparisonWithLastMonth = 100; // If last month was 0 and this month isn't
  }

  return {
    totalIncome,
    totalExpense,
    netIncome,
    transactionCount: currentMonthTransactions.length,
    comparisonWithLastMonth
  };
};

export const calculateCategoryStats = (
  transactions: Transaction[], 
  categories: { id: string, name: string, color: string, icon: string }[],
  type: 'expense' | 'income' = 'expense'
): CategoryStat[] => {
  const filteredTx = transactions.filter(t => t.type === type);
  const totalAmount = filteredTx.reduce((sum, t) => sum + t.amount, 0);

  if (totalAmount === 0) return [];

  const statsMap = new Map<string, CategoryStat>();

  filteredTx.forEach(t => {
    const category = categories.find(c => c.id === t.categoryId);
    const categoryName = category?.name || 'Uncategorized';
    const color = category?.color || '#94A3B8'; // slate-400
    const icon = category?.icon || 'help-circle';
    const categoryId = t.categoryId || 'uncategorized';

    const current = statsMap.get(categoryId) || {
      categoryId,
      categoryName,
      color,
      categoryIcon: icon,
      amount: 0,
      percentage: 0,
      transactionCount: 0
    };

    current.amount += t.amount;
    current.transactionCount += 1;
    statsMap.set(categoryId, current);
  });

  return Array.from(statsMap.values())
    .map(stat => ({
      ...stat,
      percentage: Math.round((stat.amount / totalAmount) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const calculateSpendingTrend = (transactions: Transaction[], monthsToLookBack: number = 6): MonthTrend[] => {
  const trends: MonthTrend[] = [];
  const today = new Date();

  for (let i = monthsToLookBack - 1; i >= 0; i--) {
    const date = subMonths(today, i);
    const monthStr = format(date, 'MMM');
    const fullMonthStr = format(date, 'yyyy-MM');

    const monthlyTx = transactions.filter(t => isSameMonth(t.date, date));
    
    const income = monthlyTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    trends.push({
      month: monthStr,
      income,
      expense
    });
  }

  return trends;
};
