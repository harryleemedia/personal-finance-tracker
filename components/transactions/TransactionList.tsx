'use client';

import { useEffect, useState } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface TransactionListProps {
  onEdit: (transactionId: string) => void;
  limit?: number;
}

export function TransactionList({ onEdit, limit }: TransactionListProps) {
  const { transactions, loadTransactions, deleteTransaction, isLoading } =
    useTransactionStore();
  const { categories, getCategoryById } = useCategoryStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除這筆交易嗎？')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        alert('刪除失敗，請重試');
      }
    }
  };

  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">載入中...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-2">尚無交易記錄</p>
        <p className="text-sm text-gray-500">點擊「新增交易」按鈕開始記帳</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction) => {
        const category = getCategoryById(transaction.categoryId);

        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-xl bg-[#2d3142] hover:bg-[#343849] transition-colors group"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Category Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${category?.color}20` }}
              >
                {category?.icon || '📦'}
              </div>

              {/* Transaction Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{transaction.description}</p>
                  {transaction.isRecurring && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      重複
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                  <span>{category?.name}</span>
                  {transaction.merchant && (
                    <>
                      <span>·</span>
                      <span>{transaction.merchant}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{format(new Date(transaction.date), 'yyyy/MM/dd', { locale: zhTW })}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  NT$ {transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative ml-4">
              <button
                onClick={() => setOpenMenuId(openMenuId === transaction.id ? null : transaction.id)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#23273a] rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical size={18} />
              </button>

              {openMenuId === transaction.id && (
                <div className="absolute right-0 mt-2 w-40 bg-[#23273a] border border-gray-700 rounded-xl shadow-lg overflow-hidden z-10">
                  <button
                    onClick={() => {
                      onEdit(transaction.id);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2d3142] flex items-center gap-2 transition-colors"
                  >
                    <Edit2 size={16} />
                    編輯
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(transaction.id);
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} />
                    刪除
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
