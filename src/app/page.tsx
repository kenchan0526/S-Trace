"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import SubscriptionCard from "@/components/ui/SubscriptionCard";
import SubscriptionModal from "@/components/ui/SubscriptionModal";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Subscription } from "@/types/subscription";
import { Bell, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Home() {
  const { subscriptions, settings, isLoaded, addSubscription, updateSubscription, deleteSubscription, updateSettings } = useSubscriptions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  if (!isLoaded) return null;

  const activeSubs = subscriptions.filter(s => s.status !== "archived" && s.status !== "cancelled");
  const upcomingChargeSubs = activeSubs.filter(s => s.isChargeRequired && !s.isChargedThisMonth);

  const totalMonthly = activeSubs.reduce((sum, sub) => {
    return sum + (sub.billingCycle === "毎年" ? Math.round(sub.amount / 12) : sub.amount);
  }, 0);

  const getUpcomingSubs = () => {
    const today = new Date().getDate();
    return activeSubs
      .filter(s => s.billingDate >= today || (s.isChargeRequired && !s.isChargedThisMonth))
      .sort((a,b) => a.billingDate - b.billingDate)
      .slice(0, 5);
  };
  const upcomingList = getUpcomingSubs();

  const handleOpenModal = (sub?: Subscription) => {
    setEditingSub(sub || null);
    setIsModalOpen(true);
  };

  const handleSave = (sub: Subscription) => {
    if (editingSub) {
      updateSubscription(sub.id, sub);
    } else {
      addSubscription(sub);
    }
  };

  const markAsCharged = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateSubscription(id, { 
      isChargedThisMonth: true,
      lastChargedMonth: new Date().toISOString().slice(0, 7)
    });
    toast.success("チャージ完了を記録しました");
  };

  const handleEnableNotification = () => {
    updateSettings({ ...settings, notificationEnabled: true });
    toast.success("通知をオンにしました");
  };

  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="ホーム" />
      
      <div className="p-4 space-y-6">
        
        {/* Dashboard Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-300"></div>
          <p className="text-sm font-bold text-gray-500 mb-2">今月の合計支出予定額</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold text-gray-400">¥</span>
            <span className="text-4xl font-extrabold text-primary tracking-tight">
              {totalMonthly.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">登録数: {activeSubs.length}件</p>
        </div>

        {/* Action Required: Charge */}
        {upcomingChargeSubs.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 px-2">要チャージ</h2>
            <div className="space-y-3">
              {upcomingChargeSubs.map(sub => (
                <div key={sub.id} className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-orange-900">{sub.name}</h3>
                    <p className="text-xs text-orange-700 mt-1">¥{sub.amount.toLocaleString()} • {sub.billingDate}日支払</p>
                  </div>
                  <button 
                    onClick={(e) => markAsCharged(sub.id, e)}
                    className="flex items-center space-x-1 bg-white text-orange-600 px-3 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform"
                  >
                    <CheckCircle2 size={16} />
                    <span>チャージ完了</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Prompt */}
        {!settings.notificationEnabled && (
          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex items-start space-x-3 slide-up-animation">
            <div className="bg-blue-50 text-blue-500 p-2 rounded-full shrink-0">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">通知をオンにしませんか？</h3>
              <p className="text-xs text-gray-600 mt-1 mb-2 leading-relaxed">支払い前のチャージ忘れを防ぐためにお知らせします。</p>
              <button onClick={handleEnableNotification} className="text-xs font-bold text-blue-600 bg-white px-4 py-1.5 rounded-full border border-blue-200 shadow-sm active:scale-95 transition-transform">
                オンにする
              </button>
            </div>
          </div>
        )}

        {/* Upcoming List */}
        <div>
          <div className="flex justify-between items-end mb-3 px-2">
            <h2 className="text-sm font-bold text-gray-900">今月の直近の支払い</h2>
            <Link href="/list" className="text-xs font-bold text-primary hover:underline">
              すべて見る
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingList.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
                今月予定されている支払いはありません。
              </div>
            ) : (
              upcomingList.map(sub => (
                <SubscriptionCard key={sub.id} subscription={sub} onClick={() => handleOpenModal(sub)} />
              ))
            )}
          </div>
        </div>

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
