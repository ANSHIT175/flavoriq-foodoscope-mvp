"use client";

import React, { useState, useMemo } from "react";
import { Utensils, Search, Filter, RotateCcw } from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import RecipeCard from "../../components/RecipeCard";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import {
  CuisineOption,
  DietaryOption,
  TasteOption,
} from "../../lib/foodoscope/types";

export default function RecipeFinderPage() {
  const {
    rankedResults,
    loading,
    loadingStage,
    cuisine,
    taste,
    dietaryPreference,
    setCuisine,
    setTaste,
    setDietaryPreference,
    restoreDefaultPantry,
  } = useFlavorIq();

  const [textFilter, setTextFilter] = useState("");
  const [minScore, setMinScore] = useState<number>(0);

  const filteredResults = useMemo(() => {
    return rankedResults.filter((r) => {
      if (r.scoreBreakdown.totalScore < minScore) return false;
      if (!textFilter.trim()) return true;
      const q = textFilter.toLowerCase();
      return (
        r.recipe.name.toLowerCase().includes(q) ||
        r.recipe.cuisine.toLowerCase().includes(q) ||
        r.recipe.region.toLowerCase().includes(q) ||
        r.recipe.ingredients.some((i) => i.name.toLowerCase().includes(q))
      );
    });
  }, [rankedResults, minScore, textFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
              <Utensils className="w-4 h-4" />
              RecipeDB Discovery &amp; Multi-Factor Filter
            </span>
            <h1 className="text-2xl font-extrabold text-brand-dark mt-0.5">
              Your Top Matches ({filteredResults.length})
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setTextFilter("");
              setMinScore(0);
              setCuisine("Any");
              setTaste("Any");
              setDietaryPreference("No preference");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-lime/60 text-brand-dark text-xs font-bold border border-brand-border transition self-start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brand-primary" />
            Reset All Filters
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-brand-border/60">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
              placeholder="Filter by dish name, ingredient, or region..."
              className="w-full rounded-xl border border-brand-border pl-9 pr-3 py-2 text-xs font-medium bg-brand-surface/30"
            />
          </div>

          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value as CuisineOption)}
            className="rounded-xl border border-brand-border px-3 py-2 text-xs font-semibold bg-white"
          >
            {["Any", "Indian", "Chinese", "Italian", "Mexican", "Thai", "Japanese", "Mediterranean", "Continental"].map(
              (c) => (
                <option key={c} value={c}>
                  Cuisine: {c}
                </option>
              )
            )}
          </select>

          <select
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value as DietaryOption)}
            className="rounded-xl border border-brand-border px-3 py-2 text-xs font-semibold bg-white"
          >
            {["No preference", "Vegetarian", "Vegan", "High-protein", "Low-oil", "Gluten-free", "Dairy-free"].map(
              (d) => (
                <option key={d} value={d}>
                  Diet: {d}
                </option>
              )
            )}
          </select>

          <div className="flex items-center gap-2 bg-brand-surface/50 px-3 py-1.5 rounded-xl border border-brand-border">
            <Filter className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-600 block">
                Min Match Score: {minScore}
              </span>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-brand-primary h-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState stage={loadingStage} />
      ) : filteredResults.length === 0 ? (
        <EmptyState
          title="No recipes match your current preferences."
          description="Try lowering the minimum Match Score slider or resetting your dietary filter."
          actionLabel="Reset Filters"
          onAction={() => {
            setTextFilter("");
            setMinScore(0);
            setCuisine("Any");
            setTaste("Any");
            setDietaryPreference("No preference");
            restoreDefaultPantry();
          }}
        />
      ) : (
        <div className="space-y-5">
          {filteredResults.map((item, idx) => (
            <RecipeCard key={item.recipe.id} item={item} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
