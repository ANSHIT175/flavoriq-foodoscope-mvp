"use client";

import React from "react";
import { Beaker, Sparkles } from "lucide-react";

export default function LoadingState({
  stage = "Analyzing your pantry...",
}: {
  stage?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-brand-lime/60 text-brand-primary mx-auto flex items-center justify-center animate-pulse">
        <Beaker className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-bold text-brand-dark flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-primary animate-spin" />
          {stage}
        </p>
        <p className="text-xs text-gray-500">
          Evaluating RecipeDB ingredient coverage, FlavorDB shared volatile compounds &amp; 100-point multi-factor weights
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="rounded-xl border border-brand-border/60 p-4 space-y-3 animate-pulse bg-brand-surface/30"
          >
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
