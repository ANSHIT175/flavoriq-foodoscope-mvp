"use client";

import React from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-brand-border max-w-xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/60">
          <h3 className="text-base font-bold text-brand-dark">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
