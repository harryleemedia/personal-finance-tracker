'use client';

import { Card } from '@/components/ui/Card';
import { ArrowDownRight, ArrowUpRight, CreditCard, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  // Mock data
  const stats = [
    {
      title: '\u7e3d\u6536\u5165',
      amount: 'NT$ 85,000',
      change: '+12.5%',
      trend: 'up',
      icon: <ArrowUpRight className=\"text-green-400\" size={24} />,
      color: 'green',
    },
    {
      title: '\u7e3d\u652f\u51fa',
      amount: 'NT$ 52,340',
      change: '-8.3%',
      trend: 'down',
      icon: <ArrowDownRight className=\"text-red-400\" size={24} />,
      color: 'red',
    },
    {
      title: '\u6de8\u6536\u652f',
      amount: 'NT$ 32,660',
      change: '+25.1%',
      trend: 'up',
      icon: <TrendingUp className=\"text-blue-400\" size={24} />,
      color: 'blue',
    },
    {
      title: '\u8a02\u95b1\u7e3d\u984d',
      amount: 'NT$ 2,450',
      change: '+2 \u9805',
      trend: 'neutral',
      icon: <CreditCard className=\"text-purple-400\" size={24} />,
      color: 'purple',
    },
  ];

  const recentTransactions = [
    { id: 1, description: '\u5168\u806f\u8d85\u5e02', amount: -450, category: '\u9910\u98f2', date: '2026-01-13' },
    { id: 2, description: '\u85aa\u8cc7\u5165\u5e33', amount: 85000, category: '\u85aa\u8cc7', date: '2026-01-10' },
    { id: 3, description: 'Netflix', amount: -390, category: '\u8a02\u95b1', date: '2026-01-08' },
    { id: 4, description: '\u6377\u904b\u5132\u503c', amount: -1000, category: '\u4ea4\u901a', date: '2026-01-07' },
    { id: 5, description: '\u661f\u5df4\u514b', amount: -250, category: '\u9910\u98f2', date: '2026-01-06' },
  ];

  return (
    <div className=\"space-y-8 animate-fade-in\">
      <div>
        <h1 className=\"text-3xl font-bold text-white mb-2\">\u5100\u8868\u677f</h1>\n        <p className=\"text-white/60\">2026 \u5e74 1 \u6708\u8ca1\u52d9\u6982\u89bd</p>\n      </div>\n\n      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">\n        {stats.map((stat, index) => (\n          <Card\n            key={stat.title}\n            icon={stat.icon}\n            hover\n            className=\"animate-slide-up\"\n            style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}\n          >\n            <div className=\"space-y-2\">\n              <p className=\"text-sm text-white/60\">{stat.title}</p>\n              <p className=\"text-2xl font-bold text-white\">{stat.amount}</p>\n              <div className=\"flex items-center gap-2\">\n                <span\n                  className={`text-sm font-medium ${\n                    stat.trend === 'up'\n                      ? 'text-green-400'\n                      : stat.trend === 'down'\n                      ? 'text-red-400'\n                      : 'text-white/60'\n                  }`}\n                >\n                  {stat.change}\n                </span>\n                <span className=\"text-xs text-white/40\">\u8207\u4e0a\u6708\u6bd4\u8f03</span>\n              </div>\n            </div>\n          </Card>\n        ))}\n      </div>\n\n      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">\n        <Card title=\"\u652f\u51fa\u8da8\u52e2\" subtitle=\"\u8fd1 6 \u500b\u6708\">\n          <div className=\"h-64 flex items-center justify-center text-white/40\">\n            <div className=\"text-center\">\n              <TrendingUp size={48} className=\"mx-auto mb-2 text-white/30\" />\n              <p>\u5716\u8868\u5340\u57df</p>\n              <p className=\"text-sm mt-1\">\u5c07\u6574\u5408 Recharts \u6298\u7dda\u5716</p>\n            </div>\n          </div>\n        </Card>\n\n        <Card title=\"\u6700\u8fd1\u4ea4\u6613\" subtitle=\"\u6700\u65b0 5 \u7b46\u8a18\u9304\">\n          <div className=\"space-y-3\">\n            {recentTransactions.map((transaction) => (\n              <div\n                key={transaction.id}\n                className=\"flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors\"\n              >\n                <div className=\"flex-1\">\n                  <p className=\"text-white font-medium\">{transaction.description}</p>\n                  <p className=\"text-sm text-white/50\">\n                    {transaction.category} \u00b7 {transaction.date}\n                  </p>\n                </div>\n                <span\n                  className={`font-semibold ${\n                    transaction.amount > 0 ? 'text-green-400' : 'text-red-400'\n                  }`}\n                >\n                  {transaction.amount > 0 ? '+' : ''}\n                  {transaction.amount.toLocaleString()}\n                </span>\n              </div>\n            ))}\n          </div>\n        </Card>\n      </div>\n\n      <Card title=\"\u5206\u985e\u7d71\u8a08\" subtitle=\"\u672c\u6708\u652f\u51fa\u5206\u4f48\">\n        <div className=\"h-64 flex items-center justify-center text-white/40\">\n          <div className=\"text-center\">\n            <div className=\"w-32 h-32 rounded-full border-8 border-white/20 mx-auto mb-2\"></div>\n            <p>\u5713\u9905\u5716\u5340\u57df</p>\n            <p className=\"text-sm mt-1\">\u5c07\u6574\u5408 Recharts \u5713\u9905\u5716</p>\n          </div>\n        </div>\n      </Card>\n    </div>\n  );\n}\n