'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { getCategoryBreakdown, CategoryStat } from '@/lib/utils/calculations';
import { startOfMonth, endOfMonth } from 'date-fns';

interface CategoryPieChartProps {
  type?: 'income' | 'expense';
}

export function CategoryPieChart({ type = 'expense' }: CategoryPieChartProps) {
  const [data, setData] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const today = new Date();
        const breakdown = await getCategoryBreakdown(
          startOfMonth(today),
          endOfMonth(today),
          type
        );
        setData(breakdown);
      } catch (error) {
        console.error('Failed to load category breakdown:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [type]);

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

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.amount,
    percentage: item.percentage,
    color: item.color,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage.toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
          />
          <Legend
            wrapperStyle={{ color: '#9ca3af' }}
            formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category List */}
      <div className="mt-6 space-y-2">
        {data.map((category) => (
          <div key={category.categoryId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-gray-300">{category.categoryName}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                NT$ {category.amount.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 w-12 text-right">
                {category.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
