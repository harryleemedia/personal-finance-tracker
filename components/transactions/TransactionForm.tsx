'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { transactionSchema, TransactionFormData } from '@/lib/validators/schemas';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { X } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  transactionId?: string;
}

export function TransactionForm({ onClose, transactionId }: TransactionFormProps) {
  const { addTransaction, updateTransaction, transactions } = useTransactionStore();
  const { categories, loadCategories } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
      type: 'expense',
      isRecurring: false,
      tags: [],
    },
  });

  const transactionType = watch('type');

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Load existing transaction if editing
  useEffect(() => {
    if (transactionId) {
      const transaction = transactions.find((t) => t.id === transactionId);
      if (transaction) {
        setValue('date', transaction.date);
        setValue('amount', transaction.amount);
        setValue('type', transaction.type);
        setValue('categoryId', transaction.categoryId);
        setValue('description', transaction.description);
        setValue('merchant', transaction.merchant);
        setValue('isRecurring', transaction.isRecurring);
        setValue('tags', transaction.tags);
      }
    }
  }, [transactionId, transactions, setValue]);

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      if (transactionId) {
        await updateTransaction(transactionId, data);
      } else {
        await addTransaction(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('儲存失敗，請重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((cat) => cat.type === transactionType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#23273a] rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#23273a] border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {transactionId ? '編輯交易' : '新增交易'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">交易類型</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setValue('type', 'expense')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  transactionType === 'expense'
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-gray-700 bg-[#2d3142] text-gray-400 hover:border-gray-600'
                }`}
              >
                支出
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'income')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  transactionType === 'income'
                    ? 'border-green-500 bg-green-500/10 text-white'
                    : 'border-gray-700 bg-[#2d3142] text-gray-400 hover:border-gray-600'
                }`}
              >
                收入
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">金額</label>
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

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">日期</label>
            <input
              type="date"
              {...register('date', { valueAsDate: true })}
              className="input"
            />
            {errors.date && (
              <p className="mt-1.5 text-sm text-red-400">{errors.date.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">分類</label>
            <select {...register('categoryId')} className="input">
              <option value="">請選擇分類</option>
              {filteredCategories.map((category) => (
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
            <label className="block text-sm font-medium text-white mb-2">描述</label>
            <input
              type="text"
              {...register('description')}
              className="input"
              placeholder="例如：午餐、薪資入帳"
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              商家（選填）
            </label>
            <input
              type="text"
              {...register('merchant')}
              className="input"
              placeholder="例如：全聯、星巴克"
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isRecurring"
              {...register('isRecurring')}
              className="w-5 h-5 rounded border-gray-700 bg-[#2d3142] text-green-500 focus:ring-green-500"
            />
            <label htmlFor="isRecurring" className="text-sm text-white cursor-pointer">
              重複性交易
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button type="button" variant="secondary" onClick={onClose} fullWidth>
              取消
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? '儲存中...' : transactionId ? '更新' : '新增'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
