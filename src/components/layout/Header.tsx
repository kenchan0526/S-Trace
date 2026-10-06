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
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 pt-[env(safe-area-inset-top)] border-b border-gray-100">
      <div className="px-4 py-3 flex flex-col justify-center relative min-h-[64px]">
        <div className="text-[10px] text-gray-500 font-medium absolute top-2 left-0 right-0 text-center uppercase tracking-wider">
          S-Trace
        </div>
        <div className="flex justify-between items-end mt-3">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex space-x-3 pb-1">
            {showSearch && (
              <button 
                onClick={onSearchClick} 
                className="text-gray-500 hover:text-primary transition-colors p-1"
                aria-label="検索"
              >
                <Search size={22} />
              </button>
            )}
            {showFilter && (
              <button 
                onClick={onFilterClick} 
                className="text-gray-500 hover:text-primary transition-colors p-1"
                aria-label="絞り込み"
              >
                <Filter size={22} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
