'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CSVImporter } from '@/components/transactions/CSVImporter';
import {
  exportTransactionsToCSV,
  exportAllDataToJSON,
  importDataFromJSON,
  clearAllData,
} from '@/lib/utils/export';
import { Download, Upload, Trash2, Database, FileJson, FileSpreadsheet } from 'lucide-react';

export default function SettingsPage() {
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      await exportTransactionsToCSV();
    } catch (error) {
      alert('匯出失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      await exportAllDataToJSON();
    } catch (error) {
      alert('備份失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportJSON = async (file: File) => {
    try {
      await importDataFromJSON(file);
    } catch (error) {
      alert('還原失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    }
  };

  const handleClearData = async () => {
    try {
      await clearAllData();
    } catch (error) {
      alert('清除失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">設定</h1>
        <p className="text-gray-400">管理您的應用偏好設定</p>
      </div>

      {/* Data Export */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileSpreadsheet className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">資料匯出</h2>
            <p className="text-sm text-gray-400">下載您的交易記錄</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1d29] border border-gray-700">
            <div>
              <div className="text-white font-medium">匯出 CSV</div>
              <div className="text-sm text-gray-400 mt-1">
                下載所有交易記錄為 CSV 格式，適合在 Excel 中開啟
              </div>
            </div>
            <Button
              variant="secondary"
              icon={<Download size={18} />}
              onClick={handleExportCSV}
              disabled={isExporting}
            >
              匯出 CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Backup & Restore */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Database className="text-green-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">備份與還原</h2>
            <p className="text-sm text-gray-400">完整備份或還原所有資料</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1d29] border border-gray-700">
            <div>
              <div className="text-white font-medium">完整備份</div>
              <div className="text-sm text-gray-400 mt-1">
                匯出所有資料（交易、訂閱、分類）為 JSON 格式
              </div>
            </div>
            <Button
              variant="secondary"
              icon={<FileJson size={18} />}
              onClick={handleExportJSON}
              disabled={isExporting}
            >
              備份資料
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1d29] border border-gray-700">
            <div>
              <div className="text-white font-medium">還原備份</div>
              <div className="text-sm text-gray-400 mt-1">
                從備份檔案還原所有資料（會覆蓋現有資料）
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportJSON(file);
                }}
              />
              <Button
                variant="secondary"
                icon={<Upload size={18} />}
                onClick={() => fileInputRef.current?.click()}
              >
                還原資料
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1d29] border border-gray-700">
            <div>
              <div className="text-white font-medium">匯入 CSV</div>
              <div className="text-sm text-gray-400 mt-1">
                從 CSV 檔案批量匯入交易記錄
              </div>
            </div>
            <Button
              variant="secondary"
              icon={<Upload size={18} />}
              onClick={() => setShowCSVImporter(true)}
            >
              匯入 CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Trash2 className="text-red-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">危險操作</h2>
            <p className="text-sm text-gray-400">不可復原的操作</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">清除所有資料</div>
              <div className="text-sm text-gray-400 mt-1">
                永久刪除所有交易和訂閱記錄（保留分類設定）
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-400"
              icon={<Trash2 size={18} />}
              onClick={handleClearData}
            >
              清除資料
            </Button>
          </div>
        </div>
      </Card>

      {/* App Info */}
      <Card title="應用資訊" padding="lg">
        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-gray-700">
            <span className="text-gray-400">版本</span>
            <span className="text-white font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-700">
            <span className="text-gray-400">資料儲存</span>
            <span className="text-white font-medium">本地 IndexedDB</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-700">
            <span className="text-gray-400">資料庫名稱</span>
            <span className="text-white font-medium">FinanceTrackerDB</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-400">開發者</span>
            <span className="text-white font-medium">Personal Finance Tracker</span>
          </div>
        </div>
      </Card>

      {/* CSV Importer Modal */}
      {showCSVImporter && (
        <CSVImporter onClose={() => setShowCSVImporter(false)} />
      )}
    </div>
  );
}
