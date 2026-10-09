"use client";

import { Search, Filter } from "lucide-react";

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  showFilter?: boolean;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
}

export default function Header({ 
  title, 
  showSearch = false, 
  showFilter = false, 
  onSearchClick, 
  onFilterClick 
}: HeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 w-full shadow-sm">
      {/* Top 44px bar like React Navigation */}
      <div className="h-[44px] flex items-center justify-center relative pt-[env(safe-area-inset-top)] box-content">
        <span className="text-[16px] font-bold text-[#333]">
          S-Trace
        </span>
      </div>
      {/* Tab Name (Page Title) */}
      <div className="px-5 pt-1 pb-3 flex justify-between items-end">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        <div className="flex space-x-4">
          {showSearch && (
            <button 
              onClick={onSearchClick} 
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="検索"
            >
              <Search size={24} />
            </button>
          )}
          {showFilter && (
            <button 
              onClick={onFilterClick} 
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="絞り込み"
            >
              <Filter size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
