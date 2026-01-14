'use client';

import { useEffect, useState } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Edit2, Trash2, MoreVertical, AlertCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface SubscriptionListProps {
  onEdit: (subscriptionId: string) => void;
}

export function SubscriptionList({ onEdit }: SubscriptionListProps) {
  const { subscriptions, loadSubscriptions, deleteSubscription, isLoading } =
    useSubscriptionStore();
  const { getCategoryById } = useCategoryStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除這個訂閱嗎？')) {
      try {
        await deleteSubscription(id);
      } catch (error) {
        alert('刪除失敗，請重試');
      }
    }
  };

  const getDaysUntilBilling = (date: Date) => {
    return differenceInDays(new Date(date), new Date());
  };

  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case 'weekly':
        return '每週';
      case 'monthly':
        return '每月';
      case 'yearly':
        return '每年';
      default:
        return cycle;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">載入中...</div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-2">尚無訂閱記錄</p>
        <p className="text-sm text-gray-500">點擊「新增訂閱」按鈕開始管理訂閱</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((subscription) => {
        const category = getCategoryById(subscription.categoryId);
        const daysUntil = getDaysUntilBilling(subscription.nextBillingDate);
        const isUpcoming = daysUntil >= 0 && daysUntil <= 3;

        return (
          <div
            key={subscription.id}
            className={`p-6 rounded-2xl border transition-all ${
              subscription.isActive
                ? 'bg-[#2d3142] border-gray-700 hover:border-gray-600'
                : 'bg-gray-800/30 border-gray-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${category?.color}20` }}
                >
                  {subscription.logo || category?.icon || '📱'}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{subscription.name}</h3>
                  <p className="text-sm text-gray-400">{category?.name}</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === subscription.id ? null : subscription.id)
                  }
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <MoreVertical size={18} />
                </button>

                {openMenuId === subscription.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#23273a] border border-gray-700 rounded-xl shadow-lg overflow-hidden z-10">
                    <button
                      onClick={() => {
                        onEdit(subscription.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2d3142] flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      編輯
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(subscription.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      刪除
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  NT$ {subscription.amount.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400">
                  / {getBillingCycleText(subscription.billingCycle)}
                </span>
              </div>

              {subscription.isActive && (
                <div>
                  {isUpcoming && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-2">
                      <AlertCircle size={16} className="text-yellow-400" />
                      <span className="text-sm text-yellow-400">
                        {daysUntil === 0 ? '今天' : `${daysUntil} 天後`}扣款
                      </span>
                    </div>
                  )}

                  <div className="text-sm text-gray-400">
                    下次扣款：
                    {format(new Date(subscription.nextBillingDate), 'yyyy/MM/dd', {
                      locale: zhTW,
                    })}
                  </div>
                </div>
              )}

              {!subscription.isActive && (
                <div className="px-3 py-2 bg-gray-700/30 rounded-lg">
                  <span className="text-sm text-gray-400">已暫停</span>
                </div>
              )}

              {subscription.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {subscription.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
