"use client";

import { Subscription } from "@/types/subscription";
import { differenceInMonths, differenceInYears } from "date-fns";

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick: () => void;
}

export default function SubscriptionCard({ subscription, onClick }: SubscriptionCardProps) {
  const categoryInitial = subscription.name.charAt(0).toUpperCase();

  const startDate = new Date(subscription.startDate);
  const endDate = subscription.status === "cancelled" && subscription.cancellationDate 
    ? new Date(subscription.cancellationDate) 
    : new Date();
  let totalPaid = 0;

  if (subscription.billingCycle === "毎月") {
    const months = Math.max(1, differenceInMonths(endDate, startDate) + 1); // include current month
    totalPaid = subscription.amount * months;
  } else if (subscription.billingCycle === "毎年") {
    const years = Math.max(1, differenceInYears(endDate, startDate) + 1);
    totalPaid = subscription.amount * years;
  } else {
    totalPaid = subscription.amount;
  }

  const today = new Date().getDate();
  let paymentText = `毎月${subscription.billingDate}日`;
  let isUpcoming = false;
  
  if (subscription.status !== "cancelled") {
    if (subscription.billingDate === today) {
      paymentText = "今日が支払日";
      isUpcoming = true;
    } else if (subscription.billingDate > today) {
      paymentText = `支払いまであと${subscription.billingDate - today}日`;
      isUpcoming = true;
    }
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold shrink-0">
            {categoryInitial}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{subscription.name}</h3>
            <p className="text-[10px] text-gray-500 mt-1">
              {subscription.planType} <span className="mx-1">•</span> 通算 ¥{totalPaid.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`font-bold text-lg ${isUpcoming ? "text-primary" : "text-gray-900"}`}>
            ¥{subscription.amount.toLocaleString()}
            <span className="text-[10px] font-normal text-gray-500 ml-0.5">
              /{subscription.billingCycle === "毎月" ? "月" : subscription.billingCycle === "毎年" ? "年" : "回"}
            </span>
          </p>
          <p className={`text-[10px] mt-1 font-bold ${isUpcoming ? "text-primary" : "text-gray-500"}`}>
            {paymentText}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
          {subscription.paymentMethod}
        </span>
        {subscription.isChargeRequired && !subscription.isChargedThisMonth && (
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-primary-dark text-[10px] font-medium border border-purple-100">
            要チャージ
          </span>
        )}
        {subscription.isChargedThisMonth && (
          <span className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 text-[10px] font-medium border border-gray-200">
            ✓ チャージ済
          </span>
        )}
        {subscription.status === "trial" && (
          <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-medium border border-orange-100">
            トライアル中
          </span>
        )}
        {subscription.status === "cancelled" && (
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium border border-gray-200">
            解約済 (アーカイブ)
          </span>
        )}
      </div>
    </div>
  );
}
