"use client";

import React from "react";
import { Sliders, Sparkles } from "lucide-react";
import { useFlavorIq } from "../context/FlavorIqContext";
import {
  CalorieRangeOption,
  CookingTimeOption,
  CuisineOption,
  DietaryOption,
  ProteinLevelOption,
  TasteOption,
} from "../lib/foodoscope/types";

const CUISINES: CuisineOption[] = [
  "Any",
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Thai",
  "Japanese",
  "Mediterranean",
  "Continental",
];

const TASTES: TasteOption[] = [
  "Any",
  "Spicy",
  "Savory",
  "Tangy",
  "Sweet",
  "Mild",
  "Balanced",
];

const DIETS: DietaryOption[] = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "High-protein",
  "Low-oil",
  "Gluten-free",
  "Dairy-free",
];

const TIMES: { label: string; value: CookingTimeOption }[] = [
  { label: "Any Time", value: "Any" },
  { label: "15 min", value: "Under 15 min" },
  { label: "30 min", value: "Under 30 min" },
  { label: "45 min", value: "Under 45 min" },
  { label: "60+ min", value: "Under 60 min" },
];

const CALORIES: CalorieRangeOption[] = [
  "Any",
  "Under 300",
  "300–500",
  "500–700",
  "700+",
];

const PROTEINS: ProteinLevelOption[] = ["Any", "Low", "Medium", "High"];

export default function PreferenceSelector({
  onCompute,
}: {
  onCompute?: () => void;
}) {
  const {
    cuisine,
    taste,
    dietaryPreference,
    maxCookingTime,
    calorieRange,
    proteinLevel,
    allowAdditionalIngredients,
    setCuisine,
    setTaste,
    setDietaryPreference,
    setMaxCookingTime,
    setCalorieRange,
    setProteinLevel,
    setAllowAdditionalIngredients,
    computeRecommendations,
    loading,
  } = useFlavorIq();

  const handleCompute = async () => {
    await computeRecommendations();
    if (onCompute) onCompute();
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm space-y-5">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" />
          Personalize Cooking Context
        </span>
        <h2 className="text-lg font-bold text-brand-dark mt-0.5">
          How do you want to eat today?
        </h2>
        <p className="text-xs text-gray-600 mt-0.5">
          Every change dynamically recalculates the 100-point multi-factor recommendation score.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cuisine */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1.5">
            Cuisine Preference (15 pts)
          </label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value as CuisineOption)}
            className="w-full rounded-xl border border-brand-border bg-brand-surface/40 px-3 py-2 text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {CUISINES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Taste */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1.5">
            Taste Profile (10 pts)
          </label>
          <select
            value={taste}
            onChange={(e) => setTaste(e.target.value as TasteOption)}
            className="w-full rounded-xl border border-brand-border bg-brand-surface/40 px-3 py-2 text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {TASTES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Diet */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1.5">
            Dietary Preference (10 pts)
          </label>
          <select
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value as DietaryOption)}
            className="w-full rounded-xl border border-brand-border bg-brand-surface/40 px-3 py-2 text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {DIETS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Max Cooking Time */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1.5">
            Maximum Cooking Time (10 pts)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TIMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setMaxCookingTime(t.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  maxCookingTime === t.value
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-gray-700 border-brand-border hover:bg-brand-surface"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calories */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1.5">
            Target Calories
          </label>
          <select
            value={calorieRange}
            onChange={(e) => setCalorieRange(e.target.value as CalorieRangeOption)}
            className="w-full rounded-xl border border-brand-border bg-brand-surface/40 px-3 py-2 text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {CALORIES.map((cal) => (
              <option key={cal} value={cal}>
                {cal === "Any" ? "Any Calorie Range" : `${cal} kcal`}
              </option>
            ))}
          </select>
        </div>

        {/* Protein */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1.5">
            Protein Target
          </label>
          <div className="flex gap-1.5">
            {PROTEINS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProteinLevel(p)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                  proteinLevel === p
                    ? "bg-brand-dark text-brand-lime border-brand-dark"
                    : "bg-white text-gray-700 border-brand-border hover:bg-brand-surface"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={allowAdditionalIngredients}
            onChange={(e) => setAllowAdditionalIngredients(e.target.checked)}
            className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
          />
          Allow recipes that need 1–2 extra core ingredients (auto-adds to Smart Grocery List)
        </label>

        <button
          type="button"
          onClick={handleCompute}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-dark to-brand-primary hover:from-brand-primary hover:to-brand-dark text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4 text-brand-lime" />
          {loading
            ? "Computing Flavor-Aware Scores..."
            : "Compute Flavor-Aware Recommendations"}
        </button>
      </div>
    </div>
  );
}
