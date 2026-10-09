"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import SubscriptionCard from "@/components/ui/SubscriptionCard";
import SubscriptionModal from "@/components/ui/SubscriptionModal";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Subscription } from "@/types/subscription";
import { Search, X } from "lucide-react";

export default function ListPage() {
  const { subscriptions, settings, isLoaded, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("active_only");
  const [filterCategory, setFilterCategory] = useState("");

  if (!isLoaded) return null;

  const handleOpenModal = (sub?: Subscription) => {
    setEditingSub(sub || null);
    setIsModalOpen(true);
  };

  const handleSave = (sub: Subscription) => {
    if (editingSub) updateSubscription(sub.id, sub);
    else addSubscription(sub);
  };

  const filteredSubs = subscriptions.filter(sub => {
    if (filterStatus === "active_only" && (sub.status === "cancelled" || sub.status === "archived")) return false;
    if (filterStatus === "archived" && sub.status !== "cancelled" && sub.status !== "archived") return false;
    if (filterCategory && sub.category !== filterCategory) return false;
    if (searchQuery && !sub.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-full bg-background pb-10">
      <Header 
        title="一覧" 
        showSearch 
        showFilter 
        onSearchClick={() => setIsSearchOpen(!isSearchOpen)}
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
      />
      
      {/* Search Bar */}
      {isSearchOpen && (
        <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center space-x-2 slide-up-animation">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="サービス名で検索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
              autoFocus
            />
          </div>
          <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="text-sm font-bold text-gray-500 p-2">
            閉じる
          </button>
        </div>
      )}

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="px-4 py-3 bg-white border-b border-gray-100 space-y-3 slide-up-animation">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">ステータス</label>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilterStatus("active_only")} 
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${filterStatus === "active_only" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              >
                アクティブのみ
              </button>
              <button 
                onClick={() => setFilterStatus("all")} 
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${filterStatus === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              >
                すべて表示
              </button>
              <button 
                onClick={() => setFilterStatus("archived")} 
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${filterStatus === "archived" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              >
                アーカイブ
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">カテゴリー</label>
            <select 
              value={filterCategory} 
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">すべてのカテゴリー</option>
              {settings.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}
      
      <div className="p-4 space-y-3">
        {filteredSubs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
            条件に一致するサブスクリプションがありません。
          </div>
        ) : (
          filteredSubs.map(sub => (
            <SubscriptionCard key={sub.id} subscription={sub} onClick={() => handleOpenModal(sub)} />
          ))
        )}
      </div>

      <FloatingActionButton onClick={() => handleOpenModal()} />

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={deleteSubscription}
        initialData={editingSub}
        settings={settings}
      />
    </div>
  );
}
