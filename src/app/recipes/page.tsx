"use client";

import React, { useState, useMemo } from "react";
import { Utensils, Search, Filter, Play, Info } from "lucide-react";
import { useFlavorIq, JUDGE_DEMO_PRESETS } from "../../context/FlavorIqContext";
import PantryManager from "../../components/PantryManager";
import PreferenceSelector from "../../components/PreferenceSelector";
import RecipeCard from "../../components/RecipeCard";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

export default function RecipeFinderWorkspacePage() {
  const {
    rankedResults,
    loading,
    loadingStage,
    scoreLabel,
    applyDemoPreset,
    restoreDefaultPantry,
    setCuisine,
    setTaste,
    setDietaryPreference,
    setCalorieRange,
    setProteinLevel,
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
      {/* Top Workspace Header + Quick Demo Presets */}
      <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
            <Utensils className="w-4 h-4" />
            RecipeDB + FlavorDB Recommendation Engine
          </span>
          <h1 className="text-2xl font-extrabold text-brand-dark mt-0.5">
            Recipe Finder Workspace
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Configure your kitchen pantry &amp; cooking preferences on the left — inspect ranked 0–100 matches on the right.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mr-1">
            <Play className="w-3.5 h-3.5 text-brand-primary" />
            Presets:
          </span>
          {JUDGE_DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyDemoPreset(preset)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-surface hover:bg-brand-lime text-brand-dark border border-brand-border transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-COLUMN SPLIT LAYOUT: LEFT = Pantry + Filters, RIGHT = Ranked Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN */}
        <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <PantryManager />
          <PreferenceSelector />
        </aside>

        {/* RIGHT COLUMN */}
        <section className="lg:col-span-7 space-y-5">
          {/* Search & Score Filter Bar */}
          <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-brand-dark">
                  Ranked Recommendations ({filteredResults.length})
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-lime text-brand-dark">
                  0–100 Multi-Factor
                </span>
              </div>
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-brand-primary" />
                {scoreLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-brand-border/60">
              <div className="sm:col-span-7 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={textFilter}
                  onChange={(e) => setTextFilter(e.target.value)}
                  placeholder="Filter ranked matches by dish or ingredient..."
                  className="w-full rounded-xl border border-brand-border pl-9 pr-3 py-2 text-xs bg-brand-surface/30"
                />
              </div>

              <div className="sm:col-span-5 flex items-center gap-2 bg-brand-surface/50 px-3 py-1.5 rounded-xl border border-brand-border">
                <Filter className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-600 block">
                    Min Match Score: {minScore}/100
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
              description="Try relaxing your dietary/time constraints on the left or restoring default pantry staples."
              actionLabel="Restore Default Pantry & Filters"
              onAction={() => {
                restoreDefaultPantry();
                setCuisine("Any");
                setTaste("Any");
                setDietaryPreference("No preference");
                setCalorieRange("Any");
                setProteinLevel("Any");
                setMinScore(0);
                setTextFilter("");
              }}
            />
          ) : (
            <div className="space-y-5">
              {filteredResults.map((item, idx) => (
                <RecipeCard key={item.recipe.id} item={item} rank={idx + 1} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
