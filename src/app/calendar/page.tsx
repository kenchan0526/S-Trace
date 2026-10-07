"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import SubscriptionCard from "@/components/ui/SubscriptionCard";
import SubscriptionModal from "@/components/ui/SubscriptionModal";
import { Subscription } from "@/types/subscription";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ja } from "date-fns/locale";

export default function CalendarPage() {
  const { subscriptions, settings, isLoaded, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  if (!isLoaded) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getSubsForDate = (date: Date) => {
    const day = date.getDate();
    const isEndOfMonth = date.getDate() === endOfMonth(date).getDate();
    
    return subscriptions.filter(sub => {
      if (sub.status === "archived") return false;
      
      // Calculate adjusted billing date for months with fewer days
      let targetDay = sub.billingDate;
      if (targetDay > 28 && isEndOfMonth) {
        if (targetDay >= date.getDate()) {
            return true; // Match if sub billing date is greater than or equal to current month's max days and we're at the end of the month
        }
      }
      return sub.billingDate === day;
    });
  };

  const selectedSubs = selectedDate ? getSubsForDate(selectedDate) : [];

  const handleOpenModal = (sub?: Subscription) => {
    setEditingSub(sub || null);
    setIsModalOpen(true);
  };

  const handleSave = (sub: Subscription) => {
    if (editingSub) updateSubscription(sub.id, sub);
    else addSubscription(sub);
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="min-h-full bg-background pb-10">
      <Header title="カレンダー" />
      <div className="p-4 space-y-4">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 text-gray-500 hover:text-primary transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {format(currentMonth, "yyyy年 M月", { locale: ja })}
            </h2>
            <button onClick={nextMonth} className="p-2 text-gray-500 hover:text-primary transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(day => {
              const subsOnDay = getSubsForDate(day);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const hasCharge = subsOnDay.some(s => s.isChargeRequired && !s.isChargedThisMonth);

              return (
                <div 
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    flex flex-col items-center p-2 rounded-xl cursor-pointer transition-all aspect-square relative
                    ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                    ${isSelected ? "bg-primary-light border-2 border-primary" : "border-2 border-transparent hover:bg-gray-50"}
                  `}
                >
                  <span className={`text-sm font-bold ${isToday && !isSelected ? "bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center -mt-1" : ""}`}>
                    {format(day, "d")}
                  </span>
                  
                  {/* Indicators */}
                  <div className="flex gap-1 mt-1 absolute bottom-1.5">
                    {subsOnDay.length > 0 && (
                      <span className={`w-1.5 h-1.5 rounded-full ${hasCharge ? "bg-orange-500" : "bg-primary"}`}></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="slide-up-animation">
            <h3 className="text-sm font-bold text-gray-900 mb-3 px-2">
              {format(selectedDate, "M月d日 (E)", { locale: ja })}の支払い
            </h3>
            <div className="space-y-3">
              {selectedSubs.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  支払いの予定はありません
                </div>
              ) : (
                selectedSubs.map(sub => (
                  <SubscriptionCard key={sub.id} subscription={sub} onClick={() => handleOpenModal(sub)} />
                ))
              )}
            </div>
          </div>
        )}

      </div>

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
