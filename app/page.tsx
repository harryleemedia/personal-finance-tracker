'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { SubscriptionList } from '@/components/subscriptions/SubscriptionList';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { Plus, Download, MoreVertical, AlertCircle } from 'lucide-react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

export default function DashboardPage() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [editingType, setEditingType] = useState<'transaction' | 'subscription'>('transaction');

  const { getActiveSubscriptions, getUpcomingSubscriptions } = useSubscriptionStore();

  const handleEdit = (id: string, type: 'transaction' | 'subscription') => {
    setEditingId(id);
    setEditingType(type);
    if (type === 'transaction') {
      setShowTransactionForm(true);
    } else {
      setShowSubscriptionForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowTransactionForm(false);
    setShowSubscriptionForm(false);
    setEditingId(undefined);
  };

  const activeSubscriptions = getActiveSubscriptions();
  const [upcoming, setUpcoming] = useState<any[]>([]);

  // Load upcoming on mount
  useState(() => {
    useSubscriptionStore.getState().getUpcomingSubscriptions(3).then(setUpcoming);
  });

  const today = new Date();
  const dayName = today.toLocaleDateString('zh-TW', { weekday: 'long' });
  const dayNumber = today.getDate();

  return (
    <div className=\"space-y-6 animate-fade-in\">
      <div className=\"flex flex-col md:flex-row md:items-center justify-between gap-4\">
        <div>
          <h1 className=\"text-3xl font-bold text-white mb-1\">\u65e9\u5b89\uff0cHarry</h1>
          <p className=\"text-gray-400\">\u9019\u662f\u60a8\u4eca\u5929\u7684\u8ca1\u52d9\u6982\u6cc1</p>
        </div>
        <div className=\"flex gap-3\">
          <Button variant=\"secondary\" icon={<Download size={20} />}>
            \u532f\u5165\u5831\u8868
          </Button>
          <Button variant=\"primary\" icon={<Plus size={20} />} onClick={() => setShowTransactionForm(true)}>
            \u65b0\u589e\u4ea4\u6613
          </Button>
        </div>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        {/* Welcome / Date Card */}
        <Card padding=\"none\" className=\"md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 border-none\">
          <div className=\"p-6 h-full flex flex-col justify-between text-white\">
            <div>
              <div className=\"flex items-center gap-3 mb-2\">
                <h2 className=\"text-xl font-semibold text-white\">{dayName}</h2>
                <Button variant=\"primary\" size=\"sm\" className=\"rounded-full\" onClick={() => setShowTransactionForm(true)}>
                  <Plus size={14} />
                  \u65b0\u589e\u4ea4\u6613
                </Button>
              </div>
              <div className=\"text-7xl font-bold text-white\">{dayNumber}</div>
              <div className=\"mt-4 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded\">
                <p className=\"text-sm text-blue-400\">
                  \u958b\u59cb\u8a18\u9304\u60a8\u7684\u6536\u652f\uff0c\u638c\u63e1\u8ca1\u52d9\u72c0\u6cc1
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions Card */}
        <Card padding=\"md\">
          <div className=\"flex items-center justify-between mb-4\">
            <h3 className=\"text-sm font-medium text-white\">\u5feb\u901f\u64cd\u4f5c</h3>
            <button className=\"text-gray-400 hover:text-white\">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className=\"space-y-3\">
            <Button
              variant=\"secondary\"
              fullWidth
              size=\"md\"
              className=\"justify-start\"
              onClick={() => setShowTransactionForm(true)}
            >
              <Plus size={18} />
              \u65b0\u589e\u4ea4\u6613
            </Button>
            <Button variant=\"secondary\" fullWidth size=\"md\" className=\"justify-start\">
              <Download size={18} />
              \u532f\u5165 CSV
            </Button>
          </div>

          {/* Mini Calendar Placeholder */}
          <div className=\"mt-6 pt-6 border-t border-gray-700\">
            <div className=\"text-center text-sm text-gray-400\">
              <p className=\"mb-2\">\u672c\u6708\u5df2\u8a18\u9304</p>
              <p className=\"text-3xl font-bold text-white\">
                {today.getDate()}
              </p>
              <p className=\"text-xs text-gray-500 mt-1\">\u5929</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Recent Transactions */}
      <Card title=\"\u6700\u8fd1\u4ea4\u6613\" subtitle=\"\u6700\u65b0\u8a18\u9304\" padding=\"lg\">
        <TransactionList onEdit={(id) => handleEdit(id, 'transaction')} limit={10} />

        {showTransactionForm && (
          <TransactionForm onClose={handleCloseForm} transactionId={editingId} />
        )}
      </Card>

      {showSubscriptionForm && (
        <SubscriptionForm onClose={handleCloseForm} subscriptionId={editingId} />
      )}
    </div>
  );
}
