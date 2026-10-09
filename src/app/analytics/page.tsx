"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { differenceInMonths, differenceInYears } from "date-fns";

const COLORS = ['#8B5CF6', '#C4B5FD', '#F472B6', '#34D399', '#FBBF24', '#60A5FA', '#A78BFA', '#9CA3AF'];

export default function AnalyticsPage() {
  const { subscriptions, isLoaded } = useSubscriptions();
  const [isMonthly, setIsMonthly] = useState(true);

  if (!isLoaded) return null;

  const activeSubs = subscriptions.filter(s => s.status !== "archived" && s.status !== "cancelled");

  const totalMonthly = activeSubs.reduce((sum, sub) => {
    return sum + (sub.billingCycle === "毎年" ? Math.round(sub.amount / 12) : sub.amount);
  }, 0);
  
  const totalYearly = activeSubs.reduce((sum, sub) => {
    return sum + (sub.billingCycle === "毎月" ? sub.amount * 12 : sub.amount);
  }, 0);

  const dailyCost = Math.round(totalYearly / 365);

  const totalCumulative = subscriptions.reduce((sum, sub) => {
    const startDate = new Date(sub.startDate);
    const endDate = sub.status === "cancelled" && sub.cancellationDate 
      ? new Date(sub.cancellationDate) 
      : new Date();
    
    let paid = 0;
    if (sub.billingCycle === "毎月") {
      paid = sub.amount * Math.max(1, differenceInMonths(endDate, startDate) + 1);
    } else if (sub.billingCycle === "毎年") {
      paid = sub.amount * Math.max(1, differenceInYears(endDate, startDate) + 1);
    } else {
      paid = sub.amount;
    }
    return sum + paid;
  }, 0);

  const calculateAmount = (sub: typeof activeSubs[0]) => {
    if (isMonthly) {
      return sub.billingCycle === "毎年" ? Math.round(sub.amount / 12) : sub.amount;
    }
    return sub.billingCycle === "毎月" ? sub.amount * 12 : sub.amount;
  };

  const categoryData = Object.entries(
    activeSubs.reduce((acc, sub) => {
      const amt = calculateAmount(sub);
      acc[sub.category] = (acc[sub.category] || 0) + amt;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  const paymentData = Object.entries(
    activeSubs.reduce((acc, sub) => {
      const amt = calculateAmount(sub);
      acc[sub.paymentMethod] = (acc[sub.paymentMethod] || 0) + amt;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-100 text-xs font-bold text-gray-700">
          {payload[0].name}: ¥{payload[0].value.toLocaleString()}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="分析" />
      <div className="p-4 space-y-6">
        
        {/* Cumulative Total */}
        <div className="bg-gradient-to-br from-primary to-purple-400 rounded-2xl shadow-sm p-6 text-center text-white">
          <h2 className="text-xs font-bold text-purple-100 mb-1">これまでの累計支払い総額</h2>
          <p className="text-3xl font-extrabold tracking-tight">¥{totalCumulative.toLocaleString()}</p>
          <p className="text-[10px] text-purple-200 mt-2">※ 解約済みのサブスクリプションを含みます</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 max-w-xs mx-auto">
          <button 
            onClick={() => setIsMonthly(true)}
            className={`flex-1 py-1.5 text-sm font-bold rounded-full transition-all ${isMonthly ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            月別
          </button>
          <button 
            onClick={() => setIsMonthly(false)}
            className={`flex-1 py-1.5 text-sm font-bold rounded-full transition-all ${!isMonthly ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            年別
          </button>
        </div>

        {/* Costs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <h2 className="text-sm font-bold text-gray-500 mb-2">1日あたりの換算コスト</h2>
          <p className="text-3xl font-extrabold text-primary">¥{dailyCost.toLocaleString()}</p>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-sm">
            <div className={`transition-opacity ${isMonthly ? "opacity-100" : "opacity-40"}`}>
              <p className="text-gray-500 font-bold text-xs">月額換算</p>
              <p className="font-bold text-gray-900">¥{totalMonthly.toLocaleString()}</p>
            </div>
            <div className={`transition-opacity ${!isMonthly ? "opacity-100" : "opacity-40"}`}>
              <p className="text-gray-500 font-bold text-xs">年額換算</p>
              <p className="font-bold text-gray-900">¥{totalYearly.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 pl-2">カテゴリー別</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={categoryData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={2}
                     dataKey="value"
                     stroke="none"
                   >
                     {categoryData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip content={renderCustomTooltip} />
                   <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                 </PieChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Payment Methods Breakdown */}
        {paymentData.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 pl-2">支払い方法別</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={paymentData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={2}
                     dataKey="value"
                     stroke="none"
                   >
                     {paymentData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip content={renderCustomTooltip} />
                   <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                 </PieChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
