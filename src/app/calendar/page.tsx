"use client";

import Header from "@/components/layout/Header";

export default function CalendarPage() {
  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="カレンダー" />
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <h2 className="text-sm font-bold text-gray-500 mb-2">カレンダー機能</h2>
          <p className="text-sm text-gray-600 mt-4">
            カレンダー描画・月送り機能は順次追加予定です。<br/>
            日付マスに引き落とし日（紫）や要チャージ日（オレンジ）のドットが表示される予定です。
          </p>
        </div>
      </div>
    </div>
  );
}
