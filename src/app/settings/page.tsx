"use client";

import Header from "@/components/layout/Header";
import { useSubscriptions } from "@/hooks/useSubscriptions";

export default function SettingsPage() {
  const { settings, subscriptions, updateSettings } = useSubscriptions();

  const handleExport = () => {
    const data = {
      settings,
      subscriptions
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `strace_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="設定" />
      <div className="p-4 space-y-6">
        
        {/* Master Data Settings (Mock) */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 px-2">マスタ管理</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              支払いサイクル管理
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              カテゴリー管理
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              支払い方法管理
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              プラン種別管理
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 px-2">通知</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              通知設定
              <span className="text-gray-400">未許可 →</span>
            </button>
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-primary hover:bg-gray-50 flex justify-between">
              テスト通知を送信
            </button>
          </div>
        </div>

        {/* Data Backup */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 px-2">データ管理</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button onClick={handleExport} className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              データを書き出す (JSON)
            </button>
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              データを読み込む
            </button>
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              アーカイブ一覧
            </button>
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex justify-between">
              全データ初期化
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
