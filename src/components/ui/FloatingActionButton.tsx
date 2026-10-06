"use client";

import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-5 z-40 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark transition-all active:scale-95"
      aria-label="サブスクリプションを追加"
    >
      <Plus size={28} />
    </button>
  );
}
