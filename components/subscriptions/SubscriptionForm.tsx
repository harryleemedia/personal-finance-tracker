'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { subscriptionSchema, SubscriptionFormData } from '@/lib/validators/schemas';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { X } from 'lucide-react';

interface SubscriptionFormProps {
  onClose: () => void;
  subscriptionId?: string;
}

export function SubscriptionForm({ onClose, subscriptionId }: SubscriptionFormProps) {
  const { addSubscription, updateSubscription, subscriptions } = useSubscriptionStore();
  const { categories, loadCategories } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      isActive: true,
      billingCycle: 'monthly',
      startDate: new Date(),
      nextBillingDate: new Date(),
    },
  });

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Load existing subscription if editing
  useEffect(() => {
    if (subscriptionId) {
      const subscription = subscriptions.find((s) => s.id === subscriptionId);
      if (subscription) {
        setValue('name', subscription.name);
        setValue('amount', subscription.amount);
        setValue('billingCycle', subscription.billingCycle);
        setValue('nextBillingDate', subscription.nextBillingDate);
        setValue('categoryId', subscription.categoryId);
        setValue('isActive', subscription.isActive);
        setValue('startDate', subscription.startDate);
        setValue('description', subscription.description);
        setValue('logo', subscription.logo);
      }
    }
  }, [subscriptionId, subscriptions, setValue]);

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    try {
      if (subscriptionId) {
        await updateSubscription(subscriptionId, data);
      } else {
        await addSubscription(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save subscription:', error);
      alert('儲存失敗，請重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subscriptionCategories = categories.filter((cat) => cat.type === 'expense');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#23273a] rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#23273a] border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {subscriptionId ? '編輯訂閱' : '新增訂閱'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">訂閱名稱</label>
            <input
              type="text"
              {...register('name')}
              className="input"
              placeholder="例如：Netflix、Spotify"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">月費</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                NT$
              </span>
              <input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="input pl-16"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1.5 text-sm text-red-400">{errors.amount.message}</p>
            )}
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">扣款週期</label>
            <select {...register('billingCycle')} className="input">
              <option value="weekly">每週</option>
              <option value="monthly">每月</option>
              <option value="yearly">每年</option>
            </select>
            {errors.billingCycle && (
              <p className="mt-1.5 text-sm text-red-400">{errors.billingCycle.message}</p>
            )}
          </div>

          {/* Next Billing Date */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">下次扣款日期</label>
            <input
              type="date"
              {...register('nextBillingDate', { valueAsDate: true })}
              className="input"
            />
            {errors.nextBillingDate && (
              <p className="mt-1.5 text-sm text-red-400">
                {errors.nextBillingDate.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">分類</label>
            <select {...register('categoryId')} className="input">
              <option value="">請選擇分類</option>
              {subscriptionCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1.5 text-sm text-red-400">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              描述（選填）
            </label>
            <textarea
              {...register('description')}
              className="input min-h-[80px]"
              placeholder="備註說明..."
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="w-5 h-5 rounded border-gray-700 bg-[#2d3142] text-green-500 focus:ring-green-500"
            />
            <label htmlFor="isActive" className="text-sm text-white cursor-pointer">
              訂閱啟用中
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button type="button" variant="secondary" onClick={onClose} fullWidth>
              取消
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? '儲存中...' : subscriptionId ? '更新' : '新增'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
