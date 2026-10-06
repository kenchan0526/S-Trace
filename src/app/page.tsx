"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import SubscriptionCard from "@/components/ui/SubscriptionCard";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import SubscriptionModal from "@/components/ui/SubscriptionModal";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Subscription } from "@/types/subscription";
import { Bell, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { subscriptions, settings, isLoaded, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  if (!isLoaded) return null; // or a loading spinner

  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const chargeRequiredSubs = subscriptions.filter(s => s.isChargeRequired && !s.isChargedThisMonth);
  const totalChargeAmount = chargeRequiredSubs.reduce((sum, sub) => sum + sub.amount, 0);

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
    updateSubscription(id, { isChargedThisMonth: true });
  };

  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="ホーム" />

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Empty State */}
        {subscriptions.length === 0 ? (
          <div className="bg-primary-light/50 border border-primary-light rounded-2xl p-8 text-center mt-8 shadow-sm">
            <h2 className="text-xl font-bold text-primary-dark mb-2">S-Traceへようこそ！</h2>
            <p className="text-sm text-gray-600 mb-6">
              まだサブスクが登録されていません。<br />
              右下の「＋」ボタンから<br />最初のサブスクを追加しましょう！
            </p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
              <h2 className="text-sm font-bold text-gray-500 mb-1 relative z-10">今月の合計支出予定額</h2>
              <div className="flex items-baseline space-x-1 relative z-10">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">¥{totalAmount.toLocaleString()}</span>
              </div>
              
              {totalChargeAmount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">うち事前チャージ必要額</span>
                    <span className="text-sm font-bold text-primary-dark bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                      ¥{totalChargeAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Prompt (Mock) */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start space-x-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full shrink-0">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">通知をオンにしませんか？</h3>
                <p className="text-xs text-gray-600 mt-1 mb-2 leading-relaxed">支払い前のチャージ忘れを防ぐためにお知らせします。</p>
                <button className="text-xs font-bold text-blue-600 bg-white px-4 py-1.5 rounded-full border border-blue-200 shadow-sm active:scale-95 transition-transform">
                  許可する
                </button>
              </div>
            </div>

            {/* Charge Alerts */}
            {chargeRequiredSubs.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 shadow-sm"></span>
                  要チャージ（もうすぐ支払日）
                </h2>
                <div className="space-y-3">
                  {chargeRequiredSubs.map(sub => (
                    <div key={sub.id} className="relative">
                      <SubscriptionCard subscription={sub} onClick={() => handleOpenModal(sub)} />
                      <button 
                        onClick={(e) => markAsCharged(sub.id, e)}
                        className="absolute right-4 bottom-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1 hover:bg-primary-dark transition-colors active:scale-95 z-10"
                      >
                        <CheckCircle2 size={14} />
                        <span>チャージ完了</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900">直近の支払い</h2>
                <Link href="/list" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors bg-primary-light px-3 py-1 rounded-full">
                  すべて見る →
                </Link>
              </div>
              <div className="space-y-3">
                {subscriptions.slice(0, 3).map(sub => (
                  <SubscriptionCard key={sub.id} subscription={sub} onClick={() => handleOpenModal(sub)} />
                ))}
              </div>
            </div>
          </>
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
