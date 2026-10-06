"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import SubscriptionCard from "@/components/ui/SubscriptionCard";
import SubscriptionModal from "@/components/ui/SubscriptionModal";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Subscription } from "@/types/subscription";

export default function ListPage() {
  const { subscriptions, settings, isLoaded, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [filterActive, setFilterActive] = useState(true);

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
    if (filterActive) return sub.status !== "archived";
    return true;
  });

  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="一覧" showSearch showFilter />
      
      <div className="p-4 space-y-3">
        {filteredSubs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
            表示できるサブスクリプションがありません。
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
