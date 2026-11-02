"use client";

import React from "react";
import { Flame, ShieldCheck, Award } from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import NutritionCard from "../../components/NutritionCard";

export default function NutritionAnalyzerPage() {
  const {
    allRecipes,
    selectedNutritionRecipeId,
    setSelectedNutritionRecipeId,
    showToast,
  } = useFlavorIq();

  const activeRecipe =
    allRecipes.find((r) => r.id === selectedNutritionRecipeId) || allRecipes[0];

  const avgCalories = Math.round(
    allRecipes.reduce((a, r) => a + r.nutrition.calories, 0) / allRecipes.length
  );
  const avgProtein = Math.round(
    allRecipes.reduce((a, r) => a + r.nutrition.proteinG, 0) / allRecipes.length
  );

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-brand-dark to-brand-primary text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            RecipeDB Nutritional &amp; Macro Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Nutrition Analyzer &amp; Macro Optimizer
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90 leading-relaxed">
            Inspect per-serving Calories, Protein, Carbohydrates, Fat, and Dietary Fiber across recipes, and apply AI-assisted ingredient modifications to boost protein and lower oil.
          </p>
        </div>
      </section>

      {/* Recipe Switcher */}
      <section className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-primary">
            Select Recipe to Analyze
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Catalog Average: {avgCalories} kcal • {avgProtein}g Protein per serving
          </p>
        </div>

        <select
          value={activeRecipe.id}
          onChange={(e) => setSelectedNutritionRecipeId(e.target.value)}
          className="rounded-xl border border-brand-border bg-brand-surface/50 px-4 py-2.5 text-sm font-bold text-brand-dark min-w-[280px]"
        >
          {allRecipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.nutrition.calories} kcal • {r.nutrition.proteinG}g Protein)
            </option>
          ))}
        </select>
      </section>

      {/* Main Nutrition Card */}
      <NutritionCard
        recipe={activeRecipe}
        onOptimizeToast={(msg) => showToast("Nutrition Optimizer", msg)}
      />

      {/* Catalog Nutrition Leaderboard */}
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-primary" />
          High-Protein &amp; Low-Calorie Recipe Leaderboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allRecipes.slice(0, 8).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedNutritionRecipeId(r.id)}
              className={`text-left p-3.5 rounded-xl border transition ${
                r.id === activeRecipe.id
                  ? "bg-brand-lime/40 border-brand-primary"
                  : "bg-brand-surface/40 border-brand-border hover:bg-white"
              }`}
            >
              <p className="text-xs font-extrabold text-brand-dark truncate">
                {r.name}
              </p>
              <p className="text-[11px] text-brand-primary font-bold mt-1">
                {r.nutrition.proteinG}g Protein • {r.nutrition.calories} kcal
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Carbs: {r.nutrition.carbsG}g • Fat: {r.nutrition.fatG}g • Fiber:{" "}
                {r.nutrition.fiberG || 6}g
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
