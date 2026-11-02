"use client";

import React from "react";
import { Utensils } from "lucide-react";

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-10 text-center space-y-3 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border mx-auto flex items-center justify-center text-brand-primary">
        <Utensils className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-brand-dark">{title}</h3>
      <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition shadow-sm"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
