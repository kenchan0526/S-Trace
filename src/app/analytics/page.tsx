"use client";

import Header from "@/components/layout/Header";
import { useSubscriptions } from "@/hooks/useSubscriptions";

export default function AnalyticsPage() {
  const { subscriptions, isLoaded } = useSubscriptions();

  if (!isLoaded) return null;

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const dailyCost = Math.round(totalMonthly / 30);
  const totalYearly = totalMonthly * 12; // Simplified
  
  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="分析" />
      <div className="p-4 space-y-6">
        {/* Toggle (Mock) */}
        <div className="flex bg-gray-100 rounded-full p-1 max-w-xs mx-auto">
          <button className="flex-1 py-1.5 text-sm font-bold bg-white text-gray-900 rounded-full shadow-sm">月別</button>
          <button className="flex-1 py-1.5 text-sm font-bold text-gray-500 rounded-full">年別</button>
        </div>

        {/* Costs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <h2 className="text-sm font-bold text-gray-500 mb-2">1日あたりの換算コスト</h2>
          <p className="text-3xl font-extrabold text-primary">¥{dailyCost.toLocaleString()}</p>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-sm">
            <div>
              <p className="text-gray-500 font-bold text-xs">月額換算</p>
              <p className="font-bold text-gray-900">¥{totalMonthly.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 font-bold text-xs">年額換算</p>
              <p className="font-bold text-gray-900">¥{totalYearly.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown (Mock UI) */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3">カテゴリー別</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-40 flex items-center justify-center">
             <div className="text-sm font-bold text-gray-400">グラフ描画エリア</div>
          </div>
        </div>

        {/* Payment Methods Breakdown (Mock UI) */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3">支払い方法別</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-40 flex items-center justify-center">
             <div className="text-sm font-bold text-gray-400">グラフ描画エリア</div>
          </div>
        </div>

      </div>
    </div>
  );
}
