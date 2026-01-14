'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SpendingTrendChart } from '@/components/analytics/SpendingTrendChart';
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart';
import { MonthlyComparisonChart } from '@/components/analytics/MonthlyComparisonChart';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">詳細分析</h1>
          <p className="text-gray-400">深入了解您的財務狀況</p>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Spending Trend */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <TrendingUp className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">收支趨勢</h2>
            <p className="text-sm text-gray-400">近 6 個月收支變化</p>
          </div>
        </div>
        <SpendingTrendChart />
      </Card>

      {/* Category Breakdown and Monthly Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <PieChartIcon className="text-purple-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">分類統計</h2>
                <p className="text-sm text-gray-400">本月分類占比</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={categoryType === 'expense' ? 'primary' : 'secondary'}
                onClick={() => setCategoryType('expense')}
              >
                支出
              </Button>
              <Button
                size="sm"
                variant={categoryType === 'income' ? 'primary' : 'secondary'}
                onClick={() => setCategoryType('income')}
              >
                收入
              </Button>
            </div>
          </div>
          <CategoryPieChart type={categoryType} />
        </Card>

        {/* Monthly Comparison */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <BarChart3 className="text-green-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">月度對比</h2>
              <p className="text-sm text-gray-400">近 6 個月收支對比</p>
            </div>
          </div>
          <MonthlyComparisonChart />
        </Card>
      </div>
    </div>
  );
}
