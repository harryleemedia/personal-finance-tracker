'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { CSVImporter } from '@/components/transactions/CSVImporter';
import { Plus, Search, Filter, Download } from 'lucide-react';

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (transactionId: string) => {
    setEditingId(transactionId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(undefined);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">交易記錄</h1>
          <p className="text-gray-400">管理您的所有收支記錄</p>
        </div>
        <div className="flex gap-3">
          <Button
            icon={<Download size={20} />}
            variant="secondary"
            onClick={() => setShowCSVImporter(true)}
          >
            匯入 CSV
          </Button>
          <Button
            icon={<Plus size={20} />}
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            新增交易
          </Button>
        </div>
      </div>

      <Card padding="lg">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="搜尋交易..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <Button variant="secondary" icon={<Filter size={18} />}>
            篩選
          </Button>
        </div>

        <TransactionList onEdit={handleEdit} />
      </Card>

      {showForm && (
        <TransactionForm onClose={handleCloseForm} transactionId={editingId} />
      )}

      {/* CSV Importer Modal */}
      {showCSVImporter && (
        <CSVImporter onClose={() => setShowCSVImporter(false)} />
      )}
    </div>
  );
}
