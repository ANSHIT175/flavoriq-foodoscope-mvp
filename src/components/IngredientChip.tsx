"use client";

import React from "react";
import { X, Plus, Check } from "lucide-react";

export default function IngredientChip({
  name,
  category,
  selected = false,
  variant = "default",
  onRemove,
  onClick,
}: {
  name: string;
  category?: string;
  selected?: boolean;
  variant?: "default" | "matched" | "missing";
  onRemove?: () => void;
  onClick?: () => void;
}) {
  if (variant === "matched") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
        <Check className="w-3 h-3 text-emerald-600" />
        {name}
      </span>
    );
  }

  if (variant === "missing") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={onClick ? "Click to add to pantry or find substitution" : undefined}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition"
      >
        <Plus className="w-3 h-3 text-amber-700" />
        {name}
      </button>
    );
  }

  if (onRemove) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-dark text-brand-lime shadow-sm transition hover:bg-brand-primary">
        <span>{name}</span>
        {category && (
          <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-white/15 text-white/90">
            {category}
          </span>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-white/20 text-brand-lime hover:text-white transition"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
        selected
          ? "bg-brand-primary text-white border-brand-primary shadow-sm"
          : "bg-white text-brand-dark border-brand-border hover:bg-brand-lime/40 hover:border-brand-primary/40"
      }`}
    >
      {selected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-brand-primary" />}
      <span>{name}</span>
    </button>
  );
}
