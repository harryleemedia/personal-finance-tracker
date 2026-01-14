'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { parseCSV, downloadCSVTemplate, CSVParseResult } from '@/lib/utils/csvParser';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Upload, X, Download, CheckCircle, AlertCircle } from 'lucide-react';

interface CSVImporterProps {
  onClose: () => void;
}

export function CSVImporter({ onClose }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<CSVParseResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setImportComplete(false);

    try {
      const parseResult = await parseCSV(selectedFile);
      setResult(parseResult);
    } catch (error) {
      alert(error instanceof Error ? error.message : '檔案解析失敗');
      setFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileSelect(droppedFile);
    } else {
      alert('請上傳 CSV 檔案');
    }
  };

  const handleImport = async () => {
    if (!result || result.valid.length === 0) return;

    setIsImporting(true);

    try {
      // Find default category for transactions without categoryId
      const defaultExpenseCategory = categories.find(
        (c) => c.type === 'expense' && c.name === '其他'
      );
      const defaultIncomeCategory = categories.find(
        (c) => c.type === 'income' && c.name === '其他收入'
      );

      // Create a map for category name lookup (case-insensitive)
      const categoryNameMap = new Map<string, string>();
      categories.forEach((cat) => {
        categoryNameMap.set(cat.name.toLowerCase(), cat.id);
      });

      for (const transaction of result.valid) {
        // Try to find category by ID or name
        let categoryId = transaction.categoryId;

        // Check if categoryId is not a valid UUID (likely a name or keyword)
        if (categoryId && !categoryId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          // Try to find by name
          const foundId = categoryNameMap.get(categoryId.toLowerCase());
          if (foundId) {
            categoryId = foundId;
          } else {
            // Use default category if not found
            categoryId = '';
          }
        }

        // If still no valid categoryId, use default category
        if (!categoryId || categoryId === '') {
          categoryId =
            transaction.type === 'expense'
              ? defaultExpenseCategory?.id || ''
              : defaultIncomeCategory?.id || '';
        }

        await addTransaction({
          ...transaction,
          categoryId,
        });
      }

      setImportComplete(true);
    } catch (error) {
      alert('匯入失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#23273a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-[#23273a] z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">匯入 CSV</h2>
            <p className="text-sm text-gray-400 mt-1">從 CSV 檔案批量匯入交易記錄</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Download Template */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Download className="text-blue-400 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">下載範本</h3>
                <p className="text-sm text-gray-400 mb-3">
                  如果這是您第一次匯入，建議先下載範本檔案查看格式
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={downloadCSVTemplate}
                  icon={<Download size={16} />}
                >
                  下載 CSV 範本
                </Button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          {!importComplete && (
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) handleFileSelect(selectedFile);
                }}
              />
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-white mb-2">
                {file ? file.name : '拖放 CSV 檔案到這裡，或點擊選擇檔案'}
              </p>
              <p className="text-sm text-gray-400">支援 .csv 格式</p>
            </div>
          )}

          {/* Parse Result */}
          {result && !importComplete && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-white font-medium">有效記錄</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{result.valid.length}</p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="text-red-400" size={20} />
                    <span className="text-white font-medium">錯誤記錄</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{result.errors.length}</p>
                </div>
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <h4 className="text-white font-medium mb-2">錯誤詳情：</h4>
                  <div className="space-y-1">
                    {result.errors.map((err, index) => (
                      <p key={index} className="text-sm text-gray-300">
                        第 {err.row} 行：{err.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {result.valid.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">
                    預覽前 5 筆記錄：
                  </h4>
                  <div className="bg-[#1a1d29] rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                    {result.valid.slice(0, 5).map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm border-b border-gray-700 pb-2"
                      >
                        <div>
                          <span className="text-white">{transaction.description}</span>
                          <span className="text-gray-400 ml-2">
                            {transaction.date.toLocaleDateString('zh-TW')}
                          </span>
                        </div>
                        <div
                          className={`font-medium ${
                            transaction.type === 'income'
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          NT$ {transaction.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Import Complete */}
          {importComplete && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-white mb-2">匯入完成！</h3>
              <p className="text-gray-400">
                成功匯入 {result?.valid.length} 筆交易記錄
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            {importComplete ? '關閉' : '取消'}
          </Button>
          {result && result.valid.length > 0 && !importComplete && (
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={isImporting}
            >
              {isImporting ? '匯入中...' : `匯入 ${result.valid.length} 筆記錄`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
