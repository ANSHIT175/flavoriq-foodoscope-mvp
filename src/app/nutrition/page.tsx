"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Flame,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Utensils,
} from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import { ScoreRing } from "../../components/ScoreBreakdown";

export default function NutritionAnalyticsDashboardPage() {
  const params = useParams();
  const routeId = params?.id ? String(params.id) : null;

  const {
    allRecipes,
    selectedNutritionRecipeId,
    setSelectedNutritionRecipeId,
    showToast,
  } = useFlavorIq();

  const activeId = routeId || selectedNutritionRecipeId || allRecipes[0].id;
  const recipe =
    allRecipes.find((r) => r.id === activeId) || allRecipes[0];

  const [optimized, setOptimized] = useState(false);

  const cal = optimized
    ? Math.round(recipe.nutrition.calories * 0.85)
    : recipe.nutrition.calories;
  const proteinG = optimized
    ? recipe.nutrition.proteinG + 6
    : recipe.nutrition.proteinG;
  const carbsG = optimized
    ? Math.round(recipe.nutrition.carbsG * 0.88)
    : recipe.nutrition.carbsG;
  const fatG = optimized
    ? Math.max(4, Math.round(recipe.nutrition.fatG * 0.7))
    : recipe.nutrition.fatG;
  const fiberG = (recipe.nutrition.fiberG || 6) + (optimized ? 3 : 0);

  // Macro calorie distribution for Donut Chart
  const protKcal = proteinG * 4;
  const carbKcal = carbsG * 4;
  const fatKcal = fatG * 9;
  const totalMacroKcal = Math.max(1, protKcal + carbKcal + fatKcal);

  const protPct = Math.round((protKcal / totalMacroKcal) * 100);
  const carbPct = Math.round((carbKcal / totalMacroKcal) * 100);
  const fatPct = Math.max(0, 100 - protPct - carbPct);

  const dailyCalPct = Math.min(100, Math.round((cal / 2000) * 100));
  const dailyProtPct = Math.min(100, Math.round((proteinG / 60) * 100));
  const dailyFiberPct = Math.min(100, Math.round((fiberG / 28) * 100));

  const ALL_DIET_BADGES = [
    "Vegetarian",
    "Vegan",
    "High-protein",
    "Low-oil",
    "Gluten-free",
    "Dairy-free",
  ] as const;

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/recipes/${recipe.id}`}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-primary hover:text-brand-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {recipe.name}
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Switch Dish:</span>
          <select
            value={recipe.id}
            onChange={(e) => setSelectedNutritionRecipeId(e.target.value)}
            className="rounded-xl border border-brand-border bg-white px-3 py-1.5 text-xs font-bold text-brand-dark"
          >
            {allRecipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.nutrition.calories} kcal)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics Header Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-dark via-[#1C4225] to-brand-primary text-white p-6 sm:p-8 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
            <Flame className="w-3.5 h-3.5 text-orange-300" />
            Nutrition Analytics Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {recipe.name}
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90">
            {recipe.cuisine} • {recipe.cookingTimeMinutes} min • Per-Serving Macro &amp; Daily Target Analysis
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const next = !optimized;
            setOptimized(next);
            showToast(
              next ? "Nutrition Optimized!" : "Baseline Restored",
              next
                ? `Applied High-Protein (+6g) & Low-Oil (-30% fat) swap to ${recipe.name}.`
                : `Restored standard recipe macros.`
            );
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-extrabold shadow-md transition flex items-center gap-2 self-start lg:self-center ${
            optimized
              ? "bg-brand-lime text-brand-dark"
              : "bg-white text-brand-dark hover:bg-brand-lime"
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-primary" />
          {optimized ? "✓ Optimized Profile Active (Reset)" : "✨ Optimize Macro Profile"}
        </button>
      </section>

      {/* 5 LARGE MACRO ANALYTICS CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Calories", val: `${cal}`, unit: "kcal", pct: Math.min(100, Math.round((cal / 600) * 100)), bar: "bg-orange-500" },
          { label: "Protein", val: `${proteinG}g`, unit: "per serving", pct: Math.min(100, Math.round((proteinG / 30) * 100)), bar: "bg-emerald-600" },
          { label: "Carbs", val: `${carbsG}g`, unit: "net carbs", pct: Math.min(100, Math.round((carbsG / 75) * 100)), bar: "bg-blue-500" },
          { label: "Total Fat", val: `${fatG}g`, unit: "lipids", pct: Math.min(100, Math.round((fatG / 30) * 100)), bar: "bg-amber-500" },
          { label: "Dietary Fiber", val: `${fiberG}g`, unit: "prebiotic", pct: Math.min(100, Math.round((fiberG / 15) * 100)), bar: "bg-brand-primary" },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">{m.label}</span>
              <span className="text-[10px] font-semibold text-gray-400">
                {m.unit}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
              {m.val}
            </p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${m.bar} rounded-full transition-all duration-500`}
                style={{ width: `${m.pct}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* CHARTS ROW: Calorie Distribution + Daily Progress Rings + Diet Compatibility */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Calorie Distribution Stacked Chart */}
        <section className="lg:col-span-4 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              Energy Breakdown
            </span>
            <h2 className="text-base font-extrabold text-brand-dark">
              Calorie Distribution
            </h2>
          </div>

          <div className="w-full h-6 rounded-xl overflow-hidden flex border border-brand-border">
            <div
              style={{ width: `${protPct}%` }}
              className="bg-emerald-600 h-full transition-all duration-500"
              title={`Protein: ${protPct}%`}
            />
            <div
              style={{ width: `${carbPct}%` }}
              className="bg-blue-500 h-full transition-all duration-500"
              title={`Carbs: ${carbPct}%`}
            />
            <div
              style={{ width: `${fatPct}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`Fat: ${fatPct}%`}
            />
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70">
              <span className="font-bold text-emerald-950 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                Protein Energy
              </span>
              <span className="font-extrabold text-emerald-800">
                {protKcal} kcal ({protPct}%)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70">
              <span className="font-bold text-blue-950 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                Carbohydrate Energy
              </span>
              <span className="font-extrabold text-blue-800">
                {carbKcal} kcal ({carbPct}%)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70">
              <span className="font-bold text-amber-950 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                Lipid / Fat Energy
              </span>
              <span className="font-extrabold text-amber-800">
                {fatKcal} kcal ({fatPct}%)
              </span>
            </div>
          </div>
        </section>

        {/* Center: Daily Nutrition Summary & Protein Progress Rings */}
        <section className="lg:col-span-4 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              2,000 kcal Reference Intake
            </span>
            <h2 className="text-base font-extrabold text-brand-dark">
              Daily Nutrition Summary &amp; Protein Progress
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center py-2">
            <div className="flex flex-col items-center p-2.5 rounded-2xl bg-brand-surface/50 border border-brand-border">
              <ScoreRing score={dailyProtPct} size={62} />
              <span className="text-xs font-extrabold text-brand-dark mt-2">
                Protein Goal
              </span>
              <span className="text-[10px] text-gray-500">
                {proteinG}g / 60g daily
              </span>
            </div>

            <div className="flex flex-col items-center p-2.5 rounded-2xl bg-brand-surface/50 border border-brand-border">
              <ScoreRing score={dailyFiberPct} size={62} />
              <span className="text-xs font-extrabold text-brand-dark mt-2">
                Fiber Goal
              </span>
              <span className="text-[10px] text-gray-500">
                {fiberG}g / 28g daily
              </span>
            </div>

            <div className="flex flex-col items-center p-2.5 rounded-2xl bg-brand-surface/50 border border-brand-border">
              <ScoreRing score={dailyCalPct} size={62} />
              <span className="text-xs font-extrabold text-brand-dark mt-2">
                Calorie Share
              </span>
              <span className="text-[10px] text-gray-500">
                {cal} / 2000 kcal
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-600 bg-brand-surface/60 p-3 rounded-xl border border-brand-border">
            One serving of <strong>{recipe.name}</strong> fulfills{" "}
            <strong>{dailyProtPct}%</strong> of your daily protein target while using only{" "}
            <strong>{dailyCalPct}%</strong> of your daily calorie allowance.
          </p>
        </section>

        {/* Right: Diet Compatibility Matrix */}
        <section className="lg:col-span-4 bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              Compliance Verification
            </span>
            <h2 className="text-base font-extrabold text-brand-dark">
              Diet Compatibility Matrix
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {ALL_DIET_BADGES.map((badge) => {
              const supported =
                recipe.dietaryTags.includes(badge) ||
                (optimized && (badge === "High-protein" || badge === "Low-oil"));
              return (
                <div
                  key={badge}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    supported
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}
                >
                  <ShieldCheck
                    className={`w-4 h-4 shrink-0 ${
                      supported ? "text-emerald-600" : "text-gray-300"
                    }`}
                  />
                  <span>{badge}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href={`/substitutions/${recipe.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-dark hover:bg-brand-primary text-brand-lime text-xs font-bold text-center block transition"
            >
              Adapt Ingredients in Substitution Workspace →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
