"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, PieChart, Calendar, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "ホーム", href: "/", icon: Home },
    { label: "一覧", href: "/list", icon: CreditCard },
    { label: "分析", href: "/analytics", icon: PieChart },
    { label: "カレンダー", href: "/calendar", icon: Calendar },
    { label: "設定", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-primary font-bold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={24} className={isActive ? "text-primary" : ""} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
