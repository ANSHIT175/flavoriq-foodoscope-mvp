"use client";

import React from "react";
import { Info } from "lucide-react";
import { ScoreBreakdown as ScoreBreakdownType } from "../lib/recommendation/scoring";

export function ScoreRing({
  score,
  size = 64,
  strokeWidth = 6,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const offset = circumference - (clamped / 100) * circumference;

  const colorClass =
    clamped >= 80
      ? "text-emerald-600"
      : clamped >= 65
      ? "text-brand-primary"
      : "text-amber-600";

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E4EFE0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-700`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-sm font-extrabold text-brand-dark leading-none">
          {clamped}
        </span>
        <span className="text-[9px] font-semibold text-gray-500 mt-0.5">
          /100
        </span>
      </div>
    </div>
  );
}

const FACTOR_META: {
  key: keyof Omit<ScoreBreakdownType, "preferenceFitCombined" | "totalScore">;
  label: string;
  max: number;
  tooltip: string;
}[] = [
  {
    key: "ingredientCoverage",
    label: "Ingredients",
    max: 30,
    tooltip: "30 pts max: Ratio of recipe core ingredients present in your pantry + pantry utilization.",
  },
  {
    key: "flavorCompatibility",
    label: "FlavorDB",
    max: 25,
    tooltip: "25 pts max: Shared volatile flavor compound density across active ingredients in FlavorDB.",
  },
  {
    key: "cuisineFit",
    label: "Cuisine Fit",
    max: 15,
    tooltip: "15 pts max: Alignment with your selected regional cuisine preference.",
  },
  {
    key: "tasteFit",
    label: "Taste Fit",
    max: 10,
    tooltip: "10 pts max: Match with your desired sensory taste profile (Spicy, Savory, Tangy, etc.).",
  },
  {
    key: "timeFit",
    label: "Time Fit",
    max: 10,
    tooltip: "10 pts max: Whether total prep + cook time fits inside your maximum time constraint.",
  },
  {
    key: "dietaryFit",
    label: "Dietary Fit",
    max: 10,
    tooltip: "10 pts max: Strict compliance with Vegetarian, Vegan, High-Protein, Low-Oil, or Gluten-Free rules.",
  },
];

export default function ScoreBreakdown({
  breakdown,
  compact = false,
}: {
  breakdown: ScoreBreakdownType;
  compact?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
          100-Point Multi-Factor Score Breakdown
        </span>
        <span className="text-xs font-extrabold text-brand-primary">
          Total: {breakdown.totalScore}/100
        </span>
      </div>
      <div
        className={`grid gap-2 ${
          compact
            ? "grid-cols-2 sm:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
        }`}
      >
        {FACTOR_META.map((item) => {
          const val = breakdown[item.key];
          const pct = Math.min(100, Math.round((val / item.max) * 100));
          return (
            <div
              key={item.key}
              title={item.tooltip}
              className="group relative rounded-xl border border-brand-border/80 bg-brand-surface/50 px-2.5 py-2 hover:border-brand-primary/50 hover:bg-white transition cursor-help"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-brand-dark">
                <span className="truncate flex items-center gap-1">
                  {item.label}
                  <Info className="w-2.5 h-2.5 text-gray-400 group-hover:text-brand-primary shrink-0" />
                </span>
                <span className="text-brand-primary font-bold ml-1">
                  {val}/{item.max}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200/80 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {/* Hover Tooltip */}
              <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 p-2 rounded-lg bg-brand-dark text-white text-[10px] leading-snug shadow-lg">
                {item.tooltip}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
