"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Settings } from "@/types/subscription";
import toast from "react-hot-toast";
import { X, Plus, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { settings, subscriptions, updateSettings } = useSubscriptions();
  const [activeModal, setActiveModal] = useState<keyof Settings | null>(null);
  const [editList, setEditList] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState("");

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
    toast.success("データを書き出しました");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.subscriptions && json.settings) {
          localStorage.setItem("s-trace-subscriptions", JSON.stringify(json.subscriptions));
          localStorage.setItem("s-trace-settings", JSON.stringify(json.settings));
          toast.success("データを読み込みました。アプリを再起動します。");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error("無効なファイルフォーマットです");
        }
      } catch (err) {
        toast.error("JSONのパースに失敗しました");
      }
    };
    reader.readAsText(file);
  };

  const handleWipeData = () => {
    if (window.confirm("本当にすべてのデータを初期化しますか？この操作は取り消せません！")) {
      if (window.confirm("最終確認です。データを全消去します。よろしいですか？")) {
        localStorage.clear();
        toast.success("データを初期化しました");
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  const openMasterModal = (key: keyof Settings) => {
    setEditList([...settings[key]]);
    setNewItemText("");
    setActiveModal(key);
  };

  const saveMasterList = () => {
    if (activeModal) {
      updateSettings({ ...settings, [activeModal]: editList });
      toast.success("設定を更新しました");
    }
    setActiveModal(null);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim() && !editList.includes(newItemText.trim())) {
      setEditList([...editList, newItemText.trim()]);
      setNewItemText("");
    }
  };

  const handleRemoveItem = (item: string) => {
    setEditList(editList.filter(i => i !== item));
  };

  const testNotification = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("S-Trace", {
            body: "通知のテストです。正しく受信できています！",
            icon: "/icon-192x192.png"
          });
          toast.success("テスト通知を送信しました");
        } else {
          toast.error("通知がブロックされています。ブラウザの設定を確認してください。");
        }
      });
    } else {
      toast.error("このブラウザはWeb通知をサポートしていません");
    }
  };

  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="設定" />
      <div className="p-4 space-y-6">
        
        {/* Master Data Settings */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 px-2">マスタ管理</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button onClick={() => openMasterModal("billingCycles")} className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              支払いサイクル管理
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => openMasterModal("categories")} className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              カテゴリー管理
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => openMasterModal("paymentMethods")} className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
              支払い方法管理
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => openMasterModal("planTypes")} className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between">
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
              <span className="text-primary">許可済み</span>
            </button>
            <button onClick={testNotification} className="w-full px-4 py-4 text-left text-sm font-bold text-primary hover:bg-gray-50 flex justify-between">
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
            <label className="w-full px-4 py-4 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex justify-between cursor-pointer">
              データを読み込む (JSON)
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button className="w-full px-4 py-4 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex justify-between" onClick={handleWipeData}>
              全データ初期化
            </button>
          </div>
        </div>

      </div>

      {/* Master Data Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh] shadow-xl slide-up-animation">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">マスタ項目の編集</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <ul className="space-y-2 mb-4">
                {editList.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-bold text-gray-700">{item}</span>
                    <button onClick={() => handleRemoveItem(item)} className="text-red-400 p-1 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              
              <form onSubmit={handleAddItem} className="flex space-x-2">
                <input 
                  type="text" 
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="新しい項目を追加"
                  className="flex-1 px-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <button type="submit" disabled={!newItemText.trim()} className="bg-primary text-white p-2 rounded-xl disabled:opacity-50">
                  <Plus size={20} />
                </button>
              </form>
            </div>
            
            <div className="p-4 border-t border-gray-100">
              <button onClick={saveMasterList} className="w-full py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-transform">
                保存して閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
