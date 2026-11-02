"use client";

import React from "react";
import { BarChart2, Plus, Trash2 } from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import ComparisonTable from "../../components/ComparisonTable";
import EmptyState from "../../components/EmptyState";

export default function CompareRecipesPage() {
  const {
    compareRecipeIds,
    toggleCompareRecipe,
    clearCompare,
    getRankedOrEvaluatedRecipe,
    allRecipes,
  } = useFlavorIq();

  const comparedItems = compareRecipeIds
    .map((id) => getRankedOrEvaluatedRecipe(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4" />
            Side-by-Side Multi-Factor Evaluation
          </span>
          <h1 className="text-2xl font-extrabold text-brand-dark mt-0.5">
            Compare Recipes ({comparedItems.length}/3 Selected)
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Highlights the strongest recipe across Match Score, Pantry Coverage, FlavorDB Synergy, Speed, Calories, and Protein.
          </p>
        </div>

        {comparedItems.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition self-start"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Comparison
          </button>
        )}
      </section>

      {/* Quick Recipe Selector Strip */}
      <section className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block">
          Select Up to 3 Recipes to Compare:
        </span>
        <div className="flex flex-wrap gap-2">
          {allRecipes.map((r) => {
            const active = compareRecipeIds.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleCompareRecipe(r.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  active
                    ? "bg-brand-primary text-white border-brand-primary shadow-2xs"
                    : "bg-brand-surface text-brand-dark border-brand-border hover:bg-brand-lime/50"
                }`}
              >
                <Plus className={`w-3.5 h-3.5 ${active ? "rotate-45" : ""}`} />
                {r.name}
              </button>
            );
          })}
        </div>
      </section>

      {comparedItems.length === 0 ? (
        <EmptyState
          title="No recipes selected for comparison"
          description="Click any recipe button above or click 'Compare' on any Recipe Card to compare up to 3 dishes side-by-side."
          actionLabel="Load Top 3 Recommended Recipes"
          onAction={() => {
            toggleCompareRecipe("fiq-rec-01");
            toggleCompareRecipe("fiq-rec-02");
            toggleCompareRecipe("fiq-rec-08");
          }}
        />
      ) : (
        <ComparisonTable
          items={comparedItems}
          onRemove={(id) => toggleCompareRecipe(id)}
        />
      )}
    </div>
  );
}
