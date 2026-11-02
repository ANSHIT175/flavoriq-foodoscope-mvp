"use client";

import React from "react";
import Link from "next/link";
import { BarChart2, Trash2, Award, Clock, Flame, Beaker } from "lucide-react";
import { useFlavorIq } from "../../context/FlavorIqContext";
import ComparisonTable from "../../components/ComparisonTable";
import EmptyState from "../../components/EmptyState";

export default function CompareRecipesDashboardPage() {
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

  const bestOverall = [...comparedItems].sort(
    (a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore
  )[0];
  const fastest = [...comparedItems].sort(
    (a, b) => a.recipe.cookingTimeMinutes - b.recipe.cookingTimeMinutes
  )[0];
  const highestProtein = [...comparedItems].sort(
    (a, b) => b.recipe.nutrition.proteinG - a.recipe.nutrition.proteinG
  )[0];
  const bestFlavor = [...comparedItems].sort(
    (a, b) =>
      b.scoreBreakdown.flavorCompatibility -
      a.scoreBreakdown.flavorCompatibility
  )[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-dark to-brand-primary text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-brand-lime text-xs font-extrabold">
            <BarChart2 className="w-3.5 h-3.5" />
            Multi-Recipe Decision Matrix
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            Recipe Comparison Analytics ({comparedItems.length}/3 Active)
          </h1>
          <p className="text-xs sm:text-sm text-brand-lime/90 mt-1">
            Compare Recipe A, Recipe B, and Recipe C side-by-side across all 6 scoring dimensions and nutritional macros.
          </p>
        </div>

        {comparedItems.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/25 transition self-start"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Slots
          </button>
        )}
      </section>

      {/* Slot Selector Pills (Recipe A / Recipe B / Recipe C) */}
      <section className="bg-white rounded-2xl border border-brand-border p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-dark">
            Toggle Recipes in Comparison Slots (Up to 3)
          </span>
          <span className="text-xs text-gray-500">
            Slot A, Slot B, Slot C
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allRecipes.map((r) => {
            const slotIdx = compareRecipeIds.indexOf(r.id);
            const active = slotIdx !== -1;
            const slotLabel =
              slotIdx === 0
                ? "Recipe A"
                : slotIdx === 1
                ? "Recipe B"
                : slotIdx === 2
                ? "Recipe C"
                : null;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleCompareRecipe(r.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  active
                    ? "bg-brand-dark text-brand-lime border-brand-dark shadow-xs"
                    : "bg-brand-surface/50 text-brand-dark border-brand-border hover:bg-brand-lime/40"
                }`}
              >
                {slotLabel && (
                  <span className="px-1.5 py-0.5 rounded bg-brand-primary text-white text-[10px]">
                    {slotLabel}
                  </span>
                )}
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {comparedItems.length === 0 ? (
        <EmptyState
          title="No recipes selected for comparison"
          description="Select up to 3 recipes above or click Compare on any recipe card."
          actionLabel="Load Default 3 Recipes (A, B, C)"
          onAction={() => {
            toggleCompareRecipe("fiq-rec-01");
            toggleCompareRecipe("fiq-rec-02");
            toggleCompareRecipe("fiq-rec-08");
          }}
        />
      ) : (
        <>
          <ComparisonTable
            items={comparedItems}
            onRemove={(id) => toggleCompareRecipe(id)}
          />

          {/* Bottom 4 Winner Podium Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestOverall && (
              <Link
                href={`/recipes/${bestOverall.recipe.id}`}
                className="bg-white rounded-2xl border-2 border-brand-primary p-5 shadow-sm hover:shadow-md transition space-y-2"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                  <Award className="w-4 h-4" /> 🏆 Best Overall
                </span>
                <p className="text-base font-extrabold text-brand-dark line-clamp-1">
                  {bestOverall.recipe.name}
                </p>
                <p className="text-xs font-bold text-emerald-700">
                  {bestOverall.scoreBreakdown.totalScore}/100 Total Match Score
                </p>
              </Link>
            )}

            {fastest && (
              <Link
                href={`/recipes/${fastest.recipe.id}`}
                className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm hover:shadow-md transition space-y-2"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  <Clock className="w-4 h-4" /> ⚡ Fastest
                </span>
                <p className="text-base font-extrabold text-brand-dark line-clamp-1">
                  {fastest.recipe.name}
                </p>
                <p className="text-xs font-bold text-gray-600">
                  Ready in {fastest.recipe.cookingTimeMinutes} minutes
                </p>
              </Link>
            )}

            {highestProtein && (
              <Link
                href={`/recipes/${highestProtein.recipe.id}`}
                className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm hover:shadow-md transition space-y-2"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-600">
                  <Flame className="w-4 h-4" /> 💪 Highest Protein
                </span>
                <p className="text-base font-extrabold text-brand-dark line-clamp-1">
                  {highestProtein.recipe.name}
                </p>
                <p className="text-xs font-bold text-gray-600">
                  {highestProtein.recipe.nutrition.proteinG}g Protein per serving
                </p>
              </Link>
            )}

            {bestFlavor && (
              <Link
                href={`/recipes/${bestFlavor.recipe.id}`}
                className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm hover:shadow-md transition space-y-2"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-700">
                  <Beaker className="w-4 h-4" /> 🧪 Best Flavor Match
                </span>
                <p className="text-base font-extrabold text-brand-dark line-clamp-1">
                  {bestFlavor.recipe.name}
                </p>
                <p className="text-xs font-bold text-gray-600">
                  {bestFlavor.scoreBreakdown.flavorCompatibility}/25 FlavorDB Points
                </p>
              </Link>
            )}
          </section>
        </>
      )}
    </div>
  );
}
