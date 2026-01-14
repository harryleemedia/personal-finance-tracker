'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { SubscriptionList } from '@/components/subscriptions/SubscriptionList';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';

export default function SubscriptionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const { subscriptions, loadSubscriptions } = useSubscriptionStore();

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleEdit = (subscriptionId: string) => {
    setEditingId(subscriptionId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(undefined);
  };

  // Calculate stats
  const activeSubscriptions = subscriptions.filter((s) => s.isActive);
  const monthlyTotal = activeSubscriptions
    .filter((s) => s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);

  const weeklyTotal = activeSubscriptions
    .filter((s) => s.billingCycle === 'weekly')
    .reduce((sum, s) => sum + s.amount * 4, 0);

  const yearlyTotal = activeSubscriptions
    .filter((s) => s.billingCycle === 'yearly')
    .reduce((sum, s) => sum + s.amount / 12, 0);

  const totalMonthly = monthlyTotal + weeklyTotal + yearlyTotal;

  const upcoming = activeSubscriptions.filter((s) => {
    const days = Math.ceil(
      (new Date(s.nextBillingDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days >= 0 && days <= 3;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">訂閱管理</h1>
          <p className="text-gray-400">追蹤您的所有訂閱服務</p>
        </div>
        <Button
          icon={<Plus size={20} />}
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          新增訂閱
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="bg-green-500/10 border-green-500/20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20 mb-3">
              <RefreshCw className="text-green-400" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              NT$ {Math.round(totalMonthly).toLocaleString()}
            </div>
            <div className="text-gray-400">月度訂閱總額</div>
          </div>
        </Card>

        <Card padding="md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {activeSubscriptions.length}
            </div>
            <div className="text-gray-400">活躍訂閱數</div>
          </div>
        </Card>

        <Card padding="md" className={upcoming.length > 0 ? 'bg-yellow-500/10 border-yellow-500/20' : ''}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 mb-3">
              <AlertCircle className="text-yellow-400" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-1">{upcoming.length}</div>
            <div className="text-gray-400">即將扣款（3天內）</div>
          </div>
        </Card>
      </div>

      <Card title="訂閱列表" subtitle="管理您的所有訂閱" padding="lg">
        <SubscriptionList onEdit={handleEdit} />
      </Card>

      {showForm && (
        <SubscriptionForm onClose={handleCloseForm} subscriptionId={editingId} />
      )}
    </div>
  );
}
