'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getSpendingTrend, MonthTrend } from '@/lib/utils/calculations';

export function MonthlyComparisonChart() {
  const [data, setData] = useState<MonthTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const trends = await getSpendingTrend(6);
        setData(trends);
      } catch (error) {
        console.error('Failed to load monthly comparison:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-gray-400">載入中...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-gray-400">暫無數據</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="month"
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af' }}
        />
        <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
        />
        <Legend wrapperStyle={{ color: '#9ca3af' }} />
        <Bar dataKey="income" fill="#10b981" name="收入" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" name="支出" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
