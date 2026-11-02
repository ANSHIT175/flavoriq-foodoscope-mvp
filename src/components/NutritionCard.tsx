"use client";

import React, { useState } from "react";
import { Flame, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { NormalizedRecipe } from "../lib/foodoscope/types";
import { ScoreRing } from "./ScoreBreakdown";

export default function NutritionCard({
  recipe,
  onOptimizeToast,
}: {
  recipe: NormalizedRecipe;
  onOptimizeToast?: (msg: string) => void;
}) {
  const [optimized, setOptimized] = useState(false);

  const cal = optimized
    ? Math.round(recipe.nutrition.calories * 0.86)
    : recipe.nutrition.calories;
  const prot = optimized
    ? recipe.nutrition.proteinG + 6
    : recipe.nutrition.proteinG;
  const carbs = optimized
    ? Math.round(recipe.nutrition.carbsG * 0.9)
    : recipe.nutrition.carbsG;
  const fat = optimized
    ? Math.max(4, Math.round(recipe.nutrition.fatG * 0.72))
    : recipe.nutrition.fatG;
  const fiber = (recipe.nutrition.fiberG || 6) + (optimized ? 3 : 0);

  const proteinScore = Math.min(100, Math.round((prot / 24) * 100));
  const healthScore = Math.min(
    99,
    Math.round(
      65 +
        (prot >= 16 ? 12 : 6) +
        (fat <= 12 ? 10 : 4) +
        (fiber >= 7 ? 10 : 5)
    )
  );

  const macros = [
    { label: "Calories", value: `${cal} kcal`, pct: Math.min(100, Math.round((cal / 600) * 100)), color: "bg-orange-500" },
    { label: "Protein", value: `${prot} g`, pct: Math.min(100, Math.round((prot / 30) * 100)), color: "bg-emerald-600" },
    { label: "Carbohydrates", value: `${carbs} g`, pct: Math.min(100, Math.round((carbs / 80) * 100)), color: "bg-blue-500" },
    { label: "Total Fat", value: `${fat} g`, pct: Math.min(100, Math.round((fat / 30) * 100)), color: "bg-amber-500" },
    { label: "Dietary Fiber", value: `${fiber} g`, pct: Math.min(100, Math.round((fiber / 15) * 100)), color: "bg-brand-primary" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/70 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            Macro &amp; Micronutrient Intelligence
          </span>
          <h3 className="text-xl font-extrabold text-brand-dark mt-0.5">
            {recipe.name}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {recipe.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {tag} Compatible
              </span>
            ))}
            {optimized && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-lime text-brand-dark">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                Nutrition Optimized (+6g Protein, -28% Fat)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center bg-brand-surface px-3.5 py-2.5 rounded-2xl border border-brand-border">
            <ScoreRing score={proteinScore} size={54} />
            <span className="text-[11px] font-bold text-brand-dark block mt-1">
              Protein Score
            </span>
          </div>
          <div className="text-center bg-brand-surface px-3.5 py-2.5 rounded-2xl border border-brand-border">
            <ScoreRing score={healthScore} size={54} />
            <span className="text-[11px] font-bold text-brand-dark block mt-1">
              Health Score
            </span>
          </div>
        </div>
      </div>

      {/* Macro Visual Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3.5">
          {macros.map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-brand-dark">
                <span>{m.label}</span>
                <span>{m.value}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/60">
                <div
                  className={`h-full ${m.color} rounded-full transition-all duration-500`}
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Improve Nutrition Action Box */}
        <div className="bg-brand-surface/60 rounded-2xl p-5 border border-brand-border space-y-3">
          <h4 className="text-sm font-extrabold text-brand-dark flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            AI Nutrition Optimizer
          </h4>
          <p className="text-xs text-gray-700 leading-relaxed">
            Upgrade this recipe&apos;s macro profile without sacrificing FlavorDB aroma synergy:
          </p>
          <ul className="text-xs text-gray-700 space-y-1.5">
            {(recipe.nutritionTips && recipe.nutritionTips.length > 0
              ? recipe.nutritionTips
              : [
                  "Add 100g firm tofu or roasted chickpeas to increase complete protein by +6g.",
                  "Use cold-pressed spray oil and high-heat pan searing to cut lipid calories by 28%.",
                ]
            ).map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              const nextState = !optimized;
              setOptimized(nextState);
              if (onOptimizeToast) {
                onOptimizeToast(
                  nextState
                    ? `Applied High-Protein / Low-Oil optimization to ${recipe.name}!`
                    : `Restored standard baseline macros for ${recipe.name}.`
                );
              }
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-2xs flex items-center justify-center gap-2 ${
              optimized
                ? "bg-brand-dark text-brand-lime"
                : "bg-brand-primary hover:bg-brand-dark text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {optimized ? "Optimized Macros Active ✓ (Click to Reset)" : "Improve Nutrition"}
          </button>
        </div>
      </div>
    </div>
  );
}
