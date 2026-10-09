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
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 pt-[calc(env(safe-area-inset-top)+0.5rem)] border-b border-gray-100">
      <div className="px-5 py-2 flex flex-col justify-center relative min-h-[72px]">
        {/* Top Center App Name */}
        <div className="absolute top-2 left-0 right-0 text-center">
          <span className="text-sm font-bold text-gray-800 tracking-wide">
            S-Trace
          </span>
        </div>
        {/* Bottom Left Page Title */}
        <div className="flex justify-between items-end mt-6 pb-1">
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
      </div>
    </header>
  );
}
