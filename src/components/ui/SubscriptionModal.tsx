"use client";

import { useState, useEffect } from "react";
import { X, Trash2, RotateCcw } from "lucide-react";
import { Subscription, Settings } from "@/types/subscription";
import toast from "react-hot-toast";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Subscription) => void;
  onDelete?: (id: string) => void;
  initialData?: Subscription | null;
  settings: Settings;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  settings,
}: SubscriptionModalProps) {
  const [formData, setFormData] = useState<Partial<Subscription>>({
    name: "",
    amount: 0,
    billingCycle: "毎月",
    billingMonth: 1,
    billingDate: 1,
    paymentMethod: settings.paymentMethods[0],
    category: settings.categories[0],
    planType: settings.planTypes[0],
    startDate: new Date().toISOString().split("T")[0],
    cancellationDate: new Date().toISOString().split("T")[0],
    status: "active",
    isChargeRequired: false,
    reminders: [],
    isChargedThisMonth: false,
    lastChargedMonth: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        cancellationDate: initialData.cancellationDate || new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        name: "",
        amount: 0,
        billingCycle: "毎月",
        billingMonth: 1,
        billingDate: 1,
        paymentMethod: settings.paymentMethods[0],
        category: settings.categories[0],
        planType: settings.planTypes[0],
        startDate: new Date().toISOString().split("T")[0],
        cancellationDate: new Date().toISOString().split("T")[0],
        status: "active",
        isChargeRequired: false,
        reminders: [],
        isChargedThisMonth: false,
        lastChargedMonth: "",
      });
    }
  }, [initialData, isOpen, settings]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(value))) {
      setFormData((prev) => ({ ...prev, amount: Number(value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.amount === undefined) return;

    const newSub: Subscription = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name,
      amount: formData.amount,
      billingCycle: formData.billingCycle || "毎月",
      billingMonth: Number(formData.billingMonth) || 1,
      billingDate: Number(formData.billingDate) || 1,
      billingDayOfWeek: Number(formData.billingDayOfWeek) || 0,
      paymentMethod: formData.paymentMethod || settings.paymentMethods[0],
      category: formData.category || settings.categories[0],
      planType: formData.planType || settings.planTypes[0],
      startDate: formData.startDate || new Date().toISOString().split("T")[0],
      status: formData.status as any || "active",
      cancellationDate: formData.status === "cancelled" ? formData.cancellationDate : undefined,
      isChargeRequired: formData.isChargeRequired || false,
      reminders: formData.reminders || [],
      isChargedThisMonth: formData.isChargedThisMonth || false,
      lastChargedMonth: formData.lastChargedMonth || "",
      notes: formData.notes,
      officialCancelUrl: formData.officialCancelUrl,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newSub);
    toast.success(initialData ? "更新しました" : "追加しました");
    onClose();
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      if (window.confirm("本当に削除しますか？")) {
        onDelete(initialData.id);
        toast.success("削除しました");
        onClose();
      }
    }
  };

  const handleResetCharge = () => {
    setFormData(prev => ({ ...prev, isChargedThisMonth: false }));
    toast.success("チャージ済みの状態を取り消しました。保存を押して完了してください。");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-x-hidden slide-up-animation">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-10 pt-[env(safe-area-inset-top)] w-full">
        <button onClick={onClose} className="p-2 -ml-2 text-gray-500 hover:text-gray-900">
          <X size={24} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">
          {initialData ? "編集" : "サブスク追加"}
        </h2>
        <button onClick={handleSubmit} className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-full">
          保存
        </button>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5rem)] p-4 interactive-widget-resizes-content w-full">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto pb-20 px-2 w-full">
          
          {/* Action to undo charge if it's already charged */}
          {formData.isChargedThisMonth && (
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200">
              <span className="text-sm font-bold text-gray-600">今月のチャージ完了済</span>
              <button 
                type="button" 
                onClick={handleResetCharge}
                className="text-xs flex items-center space-x-1 font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full"
              >
                <RotateCcw size={14} />
                <span>取り消す</span>
              </button>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">サービス名</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="例: Apple One"
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-base"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">金額 (円)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">¥</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={formData.amount === 0 ? "" : (formData.amount?.toLocaleString() || "")}
                onChange={handleAmountChange}
                placeholder="1,200"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-base font-bold"
              />
            </div>
          </div>

          {/* Billing Cycle & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">支払いサイクル</label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
              >
                {settings.billingCycles.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                支払日 {
                  (formData.billingCycle === "毎年" || formData.billingCycle === "半年に1回") ? "(月/日)" : 
                  formData.billingCycle === "週払い" ? "(曜日)" : "(日)"
                }
              </label>
              <div className="flex space-x-2">
                {(formData.billingCycle === "毎年" || formData.billingCycle === "半年に1回") && (
                  <select
                    name="billingMonth"
                    value={formData.billingMonth || 1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}月</option>
                    ))}
                  </select>
                )}
                {formData.billingCycle === "週払い" ? (
                  <select
                    name="billingDayOfWeek"
                    value={formData.billingDayOfWeek || 0}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
                  >
                    {['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'].map((day, i) => (
                      <option key={i} value={i}>{day}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    name="billingDate"
                    value={formData.billingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}日</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">支払い方法</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
            >
              {settings.paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Toggle Charge Required */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-bold text-sm text-gray-900">事前チャージが必要</p>
              <p className="text-xs text-gray-500">PayPayなど残高不足を防ぐため</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isChargeRequired}
                onChange={(e) => setFormData(p => ({ ...p, isChargeRequired: e.target.checked }))}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Category & Plan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">カテゴリー</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
              >
                {settings.categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">プラン</label>
              <select
                name="planType"
                value={formData.planType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
              >
                {settings.planTypes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ステータス</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
            >
              <option value="active">契約中</option>
              <option value="trial">無料トライアル中</option>
              <option value="considering_cancellation">解約検討中</option>
              <option value="cancelled">解約済</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">契約開始日</label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
              />
            </div>
            {formData.status === "cancelled" && (
              <div className="slide-up-animation">
                <label className="block text-sm font-bold text-gray-700 mb-1">解約日</label>
                <input
                  type="date"
                  name="cancellationDate"
                  required
                  value={formData.cancellationDate || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-base"
                />
              </div>
            )}
          </div>

          {/* Danger Zone */}
          {initialData && (
            <div className="pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center justify-center space-x-2 w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl active:bg-red-100 transition-colors"
              >
                <Trash2 size={18} />
                <span>このサブスクを削除</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
